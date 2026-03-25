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
    seoDescription,
    funnelStage,
    campaign,
    targetKeyword,
    ctaType,
    ctaUrl
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

// ── Customer Site Singletons ────────────────────────────────────

export const customerHomePageQuery = groq`
  *[_id == "customerHomePage"][0] {
    heroHeadline,
    heroSubheadline,
    heroPrimaryCta,
    heroPrimaryCtaHref,
    heroSecondaryCta,
    heroSecondaryCtaHref,
    howItWorksTitle,
    howItWorksSteps,
    trustSignals,
    productPathsTitle,
    productPaths,
    pricingSectionTitle,
    pricingSectionSubtitle,
    pricingSectionFootnote,
    pricingSectionCta,
    caseStudySectionTitle,
    finalCtaHeadline,
    finalCtaPrimaryCta,
    finalCtaPrimaryHref,
    finalCtaSecondaryCta,
    finalCtaSecondaryHref
  }
`;

export const customerAboutPageQuery = groq`
  *[_id == "customerAboutPage"][0] {
    heroHeadline,
    heroSubheadline,
    storyTitle,
    storyBody,
    valuesTitle,
    values,
    proofCtaTitle,
    proofCtaDescription,
    proofCtaButtonText,
    proofCtaButtonHref
  }
`;

export const customerHowItWorksPageQuery = groq`
  *[_id == "customerHowItWorksPage"][0] {
    heroHeadline,
    heroSubheadline,
    stepsTitle,
    steps,
    ctaTitle,
    ctaDescription,
    ctaButtonText,
    ctaButtonHref
  }
`;

export const customerOurCoffeePageQuery = groq`
  *[_id == "customerOurCoffeePage"][0] {
    heroHeadline,
    heroSubheadline,
    highlightsTitle,
    highlights,
    ctaTitle,
    ctaDescription,
    ctaButtonText,
    ctaButtonHref
  }
`;

export const customerRoastingProcessPageQuery = groq`
  *[_id == "customerRoastingProcessPage"][0] {
    heroHeadline,
    heroSubheadline,
    stagesTitle,
    stages,
    ctaTitle,
    ctaDescription,
    ctaButtonText,
    ctaButtonHref
  }
`;

export const customerBrandsPageQuery = groq`
  *[_id == "customerBrandsPage"][0] {
    heroHeadline,
    heroSubheadline,
    placeholderTitle,
    placeholderCopy,
    ctaButtonText,
    ctaButtonHref
  }
`;

export const customerPartnersPageQuery = groq`
  *[_id == "customerPartnersPage"][0] {
    heroHeadline,
    heroSubheadline,
    sectionTitle,
    description,
    placeholderNote,
    ctaButtonText,
    ctaButtonHref
  }
`;

export const customerSupportPageQuery = groq`
  *[_id == "customerSupportPage"][0] {
    heroHeadline,
    heroSubheadline,
    optionsTitle,
    supportOptions
  }
`;

export const customerWholesalePageQuery = groq`
  *[_id == "customerWholesalePage"][0] {
    heroHeadline,
    heroSubheadline,
    businessTypesTitle,
    businessTypes,
    featuresTitle,
    features,
    formTitle,
    formSubtitle,
    faqTitle
  }
`;

export const customerContactPageQuery = groq`
  *[_id == "customerContactPage"][0] {
    heroHeadline,
    heroSubheadline,
    pathCards,
    pathCardsFootnote,
    formTitle,
    formSubtitle
  }
`;

export const customerBlogSettingsQuery = groq`
  *[_id == "customerBlogSettings"][0] {
    heroHeadline,
    heroSubheadline,
    latestPostsTitle,
    emptyStateMessage
  }
`;

// Customer legal pages
export const customerLegalPageBySlugQuery = groq`
  *[_type == "customerLegalPage" && slug.current == $slug][0] {
    title,
    slug,
    heroHeadline,
    heroSubheadline,
    body,
    lastUpdated
  }
`;

// Consumer blog posts (filtered by audience)
export const consumerBlogPostsQuery = groq`
  *[_type == "blogPost" && audience in ["consumer", "both"]] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    category,
    author,
    publishedAt,
    featuredImage,
    funnelStage,
    campaign
  }
`;

// All consumer blog slugs (for generateStaticParams)
export const consumerBlogSlugsQuery = groq`
  *[_type == "blogPost" && audience in ["consumer", "both"]] {
    "slug": slug.current
  }
`;

// Consumer case studies (filtered by audience)
export const consumerCaseStudiesQuery = groq`
  *[_type == "caseStudy" && audience in ["consumer", "both"]] | order(isPlaceholder asc) {
    _id,
    brandName,
    slug,
    summary,
    logo,
    liveURL,
    isPlaceholder
  }
`;

