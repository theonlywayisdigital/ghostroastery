import { groq } from "next-sanity";

// Site Settings
export const siteSettingsQuery = groq`
  *[_id == "siteSettings"][0] {
    logo,
    tagline,
    defaultSeoTitle,
    defaultSeoDescription,
    instagramUrl,
    linkedinUrl,
    tiktokUrl,
    contactEmail,
    adminEmail,
    roasteryEmail,
    accentColour
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

// Bag Options
export const bagOptionsQuery = groq`
  *[_type == "bagOptions"] | order(name asc) {
    _id,
    name,
    slug,
    image,
    availableSizes,
    colours,
    labelWidth,
    labelHeight,
    labelBleed,
    labelOrientation
  }
`;

export const bagOptionBySlugQuery = groq`
  *[_type == "bagOptions" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    image,
    availableSizes,
    colours,
    labelWidth,
    labelHeight,
    labelBleed,
    labelOrientation
  }
`;

// DEPRECATED: Roast profiles now served from Supabase roast_profiles table.
// Kept for reference only — do not use in new code.
export const roastProfilesQuery = groq`
  *[_type == "roastProfiles"] | order(roastLevel asc) {
    _id,
    name,
    slug,
    roastLevel,
    descriptor,
    tastingNotes,
    image
  }
`;

// Blog Posts
export const blogPostsQuery = groq`
  *[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    category,
    author,
    publishedAt,
    featuredImage
  }
`;

export const blogPostBySlugQuery = groq`
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    body,
    category,
    author,
    publishedAt,
    featuredImage,
    seoTitle,
    seoDescription
  }
`;

export const featuredBlogPostQuery = groq`
  *[_type == "blogPost"] | order(publishedAt desc)[0] {
    _id,
    title,
    slug,
    excerpt,
    category,
    author,
    publishedAt,
    featuredImage
  }
`;

export const relatedBlogPostsQuery = groq`
  *[_type == "blogPost" && slug.current != $slug && category == $category] | order(publishedAt desc)[0...3] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    featuredImage
  }
`;

// Case Studies
export const caseStudiesQuery = groq`
  *[_type == "caseStudy"] | order(isPlaceholder asc) {
    _id,
    brandName,
    slug,
    summary,
    logo,
    liveURL,
    isPlaceholder
  }
`;

export const caseStudyBySlugQuery = groq`
  *[_type == "caseStudy" && slug.current == $slug][0] {
    _id,
    brandName,
    slug,
    summary,
    fullStory,
    logo,
    images,
    liveURL,
    isPlaceholder,
    seoTitle,
    seoDescription
  }
`;

// FAQs
export const faqsQuery = groq`
  *[_type == "faq"] | order(order asc) {
    _id,
    question,
    answer,
    category
  }
`;

export const faqsByCategoryQuery = groq`
  *[_type == "faq" && category == $category] | order(order asc) {
    _id,
    question,
    answer
  }
`;

// Label Templates
export const labelTemplatesQuery = groq`
  *[_type == "labelTemplate" && isActive == true] | order(sortOrder asc) {
    _id,
    name,
    category,
    "thumbnailUrl": thumbnail.asset->url,
    canvasJSON,
    "bagTypeSlug": bagType->slug.current,
    sortOrder
  }
`;

// SVG Elements
export const svgElementsQuery = groq`
  *[_type == "svgElement" && isActive == true] | order(category asc, sortOrder asc) {
    _id,
    name,
    category,
    svgMarkup,
    "thumbnailUrl": thumbnail.asset->url,
    sortOrder
  }
`;

// ── Roasters Site ────────────────────────────────────────────

// Roaster Features
export const roasterFeaturesQuery = groq`
  *[_type == "roasterFeature" && isActive == true] | order(category asc, order asc) {
    _id,
    title,
    slug,
    description,
    category,
    icon,
    screenshot,
    order
  }
`;

// Roasters Page Settings (singleton)
export const roastersPageSettingsQuery = groq`
  *[_id == "roastersPageSettings"][0] {
    heroHeadline,
    heroSubheadline,
    heroCta,
    platformHighlights,
    partnerProgramContent,
    pricingIntro
  }
`;

// Blog posts for roasters site
export const roasterBlogPostsQuery = groq`
  *[_type == "blogPost" && audience in ["roaster", "both"]] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    category,
    author,
    publishedAt,
    featuredImage
  }
`;

// Case studies for roasters site
export const roasterCaseStudiesQuery = groq`
  *[_type == "caseStudy" && audience in ["roaster", "both"]] | order(isPlaceholder asc) {
    _id,
    brandName,
    slug,
    summary,
    logo,
    liveURL,
    isPlaceholder
  }
`;

// FAQs for roaster pricing
export const roasterFaqsQuery = groq`
  *[_type == "faq" && category == "roaster-pricing"] | order(order asc) {
    _id,
    question,
    answer
  }
`;

// FAQs for roaster features page
export const roasterFeaturesFaqsQuery = groq`
  *[_type == "faq" && category == "roaster-features"] | order(order asc) {
    _id,
    question,
    answer
  }
`;

// Wholesale Enquiries (admin only)
export const wholesaleEnquiriesQuery = groq`
  *[_type == "wholesaleEnquiry"] | order(submittedAt desc) {
    _id,
    name,
    businessName,
    businessType,
    email,
    phone,
    estimatedVolume,
    bagSizePreference,
    branded,
    message,
    status,
    submittedAt
  }
`;
