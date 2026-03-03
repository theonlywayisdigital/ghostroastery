import { createServerClient } from "@/lib/supabase";

interface PartnerMatch {
  roasterId: string;
  territoryId: string;
  matchType: "regional" | "country";
}

/**
 * Find the fulfilment partner for a given delivery territory.
 * Returns null if no partner assigned (head office fulfilment).
 */
export async function getPartnerForOrder(
  countryCode: string,
  region?: string | null
): Promise<PartnerMatch | null> {
  const supabase = createServerClient();

  const { data, error } = await supabase.rpc("get_partner_for_order", {
    p_country_code: countryCode,
    p_region: region ?? undefined,
  });

  if (error || !data || data.length === 0) {
    return null;
  }

  const row = data[0];
  return {
    roasterId: row.roaster_id,
    territoryId: row.territory_id,
    matchType: row.match_type as "regional" | "country",
  };
}

/**
 * Get the per-bag rate for a partner, bag size, and quantity.
 * Returns null if the partner has no rate configured for this bag size.
 * Uses the same tier breakpoints as customer pricing (10-24, 25-49, 50-74, 75-99).
 */
export async function getPartnerRate(
  roasterId: string,
  bagSize: string,
  quantity: number
): Promise<number | null> {
  const supabase = createServerClient();

  const { data, error } = await supabase.rpc("get_partner_rate", {
    p_roaster_id: roasterId,
    p_bag_size: bagSize,
    p_quantity: quantity,
  });

  if (error || data === null || data === undefined) {
    return null;
  }

  return Number(data);
}
