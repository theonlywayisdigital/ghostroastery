import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export const revalidate = 300; // ISR: revalidate every 5 minutes

export async function GET() {
  try {
    const supabase = createServerClient();

    const [settingsResult, bracketsResult] = await Promise.all([
      supabase
        .from("builder_settings")
        .select("max_order_quantity, wholesale_threshold")
        .limit(1)
        .single(),
      supabase
        .from("pricing_tier_brackets")
        .select("min_quantity")
        .eq("is_active", true)
        .order("min_quantity", { ascending: true })
        .limit(1)
        .single(),
    ]);

    const minOrderQuantity = bracketsResult.data?.min_quantity ?? 25;
    const maxOrderQuantity = settingsResult.data?.max_order_quantity ?? 99;
    const wholesaleThreshold = settingsResult.data?.wholesale_threshold ?? 99;

    return NextResponse.json(
      { maxOrderQuantity, wholesaleThreshold, minOrderQuantity },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("Builder settings API error:", error);
    return NextResponse.json({
      maxOrderQuantity: 99,
      wholesaleThreshold: 99,
      minOrderQuantity: 25,
    });
  }
}
