// ═══════════════════════════════════════════════════════════════
// AI Credits — shared check & consume helpers for all AI routes
// ═══════════════════════════════════════════════════════════════

import { createServerClient } from "@/lib/supabase";
import type { Json } from "@/types/database";
import {
  type AiActionType,
  type TierLevel,
  getAiCreditCost,
  AI_CREDITS_PER_MONTH,
} from "@/lib/tier-config";

// ── Types ─────────────────────────────────────────────────────

export interface CreditCheckResult {
  allowed: boolean;
  creditsRequired: number;
  creditsRemaining: number;
  monthlyUsed: number;
  monthlyAllocation: number;
  topupBalance: number;
  error?: string;
}

export interface CreditConsumeResult {
  success: boolean;
  creditsUsed: number;
  source: "monthly" | "topup_admin" | "topup_purchase";
  error?: string;
}

// ── Helpers ───────────────────────────────────────────────────

/**
 * Get current credit state for a roaster — handles monthly reset logic.
 * Returns the effective monthly usage (reset to 0 if new month).
 */
async function getCreditState(roasterId: string) {
  const supabase = createServerClient();

  const { data: roaster, error } = await supabase
    .from("partner_roasters")
    .select(
      "sales_tier, monthly_ai_credits_used, monthly_ai_credits_reset_at, ai_credits_topup_balance"
    )
    .eq("id", roasterId)
    .single();

  if (error || !roaster) {
    throw new Error(`Failed to fetch roaster: ${error?.message}`);
  }

  const tier = (roaster.sales_tier || "free") as TierLevel;
  const allocation = AI_CREDITS_PER_MONTH[tier] ?? 0;
  const topupBalance = roaster.ai_credits_topup_balance ?? 0;

  // Check if the monthly counter needs a reset (new month)
  let monthlyUsed = roaster.monthly_ai_credits_used ?? 0;
  const resetAt = roaster.monthly_ai_credits_reset_at;

  if (resetAt) {
    const resetDate = new Date(resetAt);
    const now = new Date();
    // Reset if the stored reset timestamp is from a previous month
    if (
      resetDate.getUTCFullYear() < now.getUTCFullYear() ||
      resetDate.getUTCMonth() < now.getUTCMonth()
    ) {
      monthlyUsed = 0;
    }
  } else {
    // No reset date means never used — effectively 0
    monthlyUsed = 0;
  }

  return { tier, allocation, monthlyUsed, topupBalance };
}

/**
 * Look up the roaster ID for an authenticated user.
 * Returns null if the user has no linked roaster.
 */
export async function resolveRoasterId(
  userId: string
): Promise<string | null> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("partner_roasters")
    .select("id")
    .eq("user_id", userId)
    .single();
  return data?.id ?? null;
}

// ── Public API ────────────────────────────────────────────────

/**
 * Check whether a roaster has enough credits for an AI action.
 * Call BEFORE the AI request to fast-fail.
 */
export async function checkAiCredits(
  roasterId: string,
  actionType: AiActionType
): Promise<CreditCheckResult> {
  const cost = getAiCreditCost(actionType);

  try {
    const { allocation, monthlyUsed, topupBalance } =
      await getCreditState(roasterId);

    const monthlyRemaining = Math.max(allocation - monthlyUsed, 0);
    const totalRemaining = monthlyRemaining + topupBalance;

    if (totalRemaining < cost) {
      return {
        allowed: false,
        creditsRequired: cost,
        creditsRemaining: totalRemaining,
        monthlyUsed,
        monthlyAllocation: allocation,
        topupBalance,
        error:
          totalRemaining === 0
            ? "You've used all your AI credits this month. Upgrade your plan or purchase a top-up."
            : `This action requires ${cost} credits but you only have ${totalRemaining} remaining.`,
      };
    }

    return {
      allowed: true,
      creditsRequired: cost,
      creditsRemaining: totalRemaining,
      monthlyUsed,
      monthlyAllocation: allocation,
      topupBalance,
    };
  } catch (err) {
    return {
      allowed: false,
      creditsRequired: cost,
      creditsRemaining: 0,
      monthlyUsed: 0,
      monthlyAllocation: 0,
      topupBalance: 0,
      error: err instanceof Error ? err.message : "Failed to check credits",
    };
  }
}

/**
 * Consume credits after a successful AI response.
 * Draws from monthly allocation first, then top-up balance.
 * Writes an entry to ai_credit_ledger for the audit trail.
 */
export async function consumeAiCredits(
  roasterId: string,
  actionType: AiActionType,
  metadata?: { [key: string]: Json | undefined }
): Promise<CreditConsumeResult> {
  const cost = getAiCreditCost(actionType);
  const supabase = createServerClient();

  try {
    const { allocation, monthlyUsed, topupBalance } =
      await getCreditState(roasterId);

    const monthlyRemaining = Math.max(allocation - monthlyUsed, 0);

    let source: "monthly" | "topup_admin" | "topup_purchase";
    let monthlyToConsume: number;
    let topupToConsume: number;

    if (monthlyRemaining >= cost) {
      // Fully covered by monthly allocation
      source = "monthly";
      monthlyToConsume = cost;
      topupToConsume = 0;
    } else if (monthlyRemaining + topupBalance >= cost) {
      // Split: exhaust monthly remainder, then draw from top-up
      source = "topup_purchase"; // top-up is the overflow source
      monthlyToConsume = monthlyRemaining;
      topupToConsume = cost - monthlyRemaining;
    } else {
      return {
        success: false,
        creditsUsed: 0,
        source: "monthly",
        error: "Insufficient credits",
      };
    }

    // 1. Increment the monthly counter (the RPC handles month boundary reset)
    if (monthlyToConsume > 0) {
      const { error: incErr } = await supabase.rpc(
        "increment_monthly_ai_credits",
        {
          p_roaster_id: roasterId,
          p_count: monthlyToConsume,
        }
      );
      if (incErr) {
        throw new Error(
          `Failed to increment monthly credits: ${incErr.message}`
        );
      }
    }

    // 2. Decrement top-up balance if needed
    if (topupToConsume > 0) {
      const { error: decErr } = await supabase.rpc(
        "decrement_ai_topup_balance",
        {
          p_roaster_id: roasterId,
          p_count: topupToConsume,
        }
      );
      if (decErr) {
        throw new Error(`Failed to decrement topup balance: ${decErr.message}`);
      }
    }

    // 3. Write audit ledger entry
    const { error: ledgerErr } = await supabase
      .from("ai_credit_ledger")
      .insert({
        roaster_id: roasterId,
        credits_used: cost,
        action_type: actionType,
        source,
        metadata: metadata ?? {},
      });

    if (ledgerErr) {
      console.error("Failed to write credit ledger:", ledgerErr.message);
      // Non-fatal — credits were already deducted, log and continue
    }

    return { success: true, creditsUsed: cost, source };
  } catch (err) {
    return {
      success: false,
      creditsUsed: 0,
      source: "monthly",
      error: err instanceof Error ? err.message : "Failed to consume credits",
    };
  }
}
