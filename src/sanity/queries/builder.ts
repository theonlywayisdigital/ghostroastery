import { groq } from "next-sanity";

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
    sortOrder,
    isActive
  }
`;

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

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    minOrderQuantity,
    maxOrderQuantity,
    wholesaleThreshold,
    turnaroundDays,
    labelMakerUrl,
    builderCopy
  }
`;
