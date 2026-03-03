/**
 * Shared pricing utility — single source of truth for price resolution.
 * Used by builder UI, checkout, reorder, homepage, and admin pages.
 */

export interface PricingBracket {
  id: string;
  min: number;
  max: number;
  sortOrder: number;
}

export interface BracketPrice {
  id: string;
  bracketId: string;
  bagSize: string;
  pricePerBag: number;
  shippingCost: number;
  currency: string;
}

export interface PricingData {
  brackets: PricingBracket[];
  prices: BracketPrice[];
  minOrder: number;
  maxOrder: number;
}

/**
 * Resolve the price for a given quantity + bag size.
 * Finds the bracket that contains the quantity, then looks up the price.
 * Returns null if no matching bracket or price found.
 */
export function getPriceForQuantity(
  quantity: number,
  bagSize: string,
  data: PricingData
): { pricePerBag: number; shippingCost: number; bracket: PricingBracket } | null {
  // Find matching bracket (sorted by sort_order, first match wins)
  const bracket = data.brackets
    .filter((b) => quantity >= b.min && quantity <= b.max)
    .sort((a, b) => a.sortOrder - b.sortOrder)[0];

  if (!bracket) return null;

  // Find price for this bracket + bag size
  const price = data.prices.find(
    (p) => p.bracketId === bracket.id && p.bagSize === bagSize
  );

  if (!price) return null;

  return {
    pricePerBag: price.pricePerBag,
    shippingCost: price.shippingCost,
    bracket,
  };
}

/**
 * Generate a human-readable label for a bracket, e.g. "25–49"
 */
export function getBracketLabel(bracket: PricingBracket): string {
  return `${bracket.min}–${bracket.max}`;
}
