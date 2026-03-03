import { groq } from "next-sanity";

// DEPRECATED: Bag sizes now served from Supabase bag_sizes table.
// Kept for reference only — do not use in new code.
export const bagSizesQuery = groq`
  *[_type == "bagSizes" && isActive == true] | order(sortOrder asc) {
    _id,
    name,
    description,
    sortOrder,
    isActive
  }
`;

export const bagColoursQuery = groq`
  *[_type == "bagColours" && isActive == true] | order(sortOrder asc) {
    _id,
    name,
    hex,
    "bagPhotoUrl": bagPhoto.asset->url,
    "actualBagPhotoUrl": actualBagPhoto.asset->url,
    sortOrder,
    isActive
  }
`;

// DEPRECATED: Roast profiles now served from Supabase roast_profiles table.
// Kept for reference only — do not use in new code.
export const roastProfilesQuery = groq`
  *[_type == "roastProfiles" && isActive == true] | order(sortOrder asc) {
    _id,
    name,
    "slug": slug,
    descriptor,
    tastingNotes,
    roastLevel,
    isDecaf,
    badge,
    sortOrder,
    isActive
  }
`;

// DEPRECATED: Grind options now served from Supabase grind_options table.
// Kept for reference only — do not use in new code.
export const grindOptionsQuery = groq`
  *[_type == "grindOptions" && isActive == true] | order(sortOrder asc) {
    _id,
    name,
    description,
    icon,
    "imageUrl": image.asset->url,
    sortOrder,
    isActive
  }
`;

// DEPRECATED: Pricing now served from Supabase pricing_tier_brackets + pricing_tier_prices tables.
// The old pricing_tiers table has been dropped. Kept for reference only — do not use in new code.
export const pricingTiersQuery = groq`
  *[_type == "pricingTiers"] | order(bagSize asc) {
    _id,
    bagSize,
    tier_10_24,
    tier_25_49,
    tier_50_99,
    tier_100_150,
    shippingCost
  }
`;

// DEPRECATED: Order quantity settings now served from Supabase builder_settings table.
// Step headings/subheadings remain hardcoded in build/page.tsx defaults.
// Kept for reference only — do not use in new code.
export const builderSettingsQuery = groq`
  *[_type == "builderSettings"][0] {
    minOrderQuantity,
    maxOrderQuantity,
    wholesaleThreshold,
    turnaroundDays,
    labelMakerUrl,
    step1Heading,
    step1Subheading,
    step2Heading,
    step2Subheading,
    step3Heading,
    step3Subheading,
    step4Heading,
    step4Subheading,
    step5Heading,
    step5Subheading,
    step6Heading,
    step6Subheading,
    step7Heading,
    step7Subheading
  }
`;
