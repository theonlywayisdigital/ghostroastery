// ═══════════════════════════════════════════════════════════════
// Tier Configuration — feature gates, AI credit costs, allocations
// ═══════════════════════════════════════════════════════════════

// ── Tier Definitions ──────────────────────────────────────────

export type TierLevel = "free" | "starter" | "growth" | "pro" | "scale";

export const TIER_ORDER: TierLevel[] = [
  "free",
  "starter",
  "growth",
  "pro",
  "scale",
];

/** Monthly AI credit allocation per tier */
export const AI_CREDITS_PER_MONTH: Record<TierLevel, number> = {
  free: 0,
  starter: 50,
  growth: 150,
  pro: 500,
  scale: 1500,
};

// ── AI Action Types & Costs ───────────────────────────────────

/**
 * Every AI-powered action that consumes credits.
 * Grouped by cost tier: light (1), special (2), medium (3), heavy (5).
 */
export type AiActionType =
  // Light (1 credit) — quick suggestions via AiGenerateButton
  | "email_subject"
  | "email_preview"
  | "email_body"
  | "social_caption"
  | "product_name"
  | "product_description"
  | "product_meta_description"
  | "discount_description"
  | "form_description"
  | "form_success_message"
  | "website_heading"
  | "website_body"
  | "website_meta_title"
  | "website_meta_description"
  // Light (1 credit) — label studio
  | "label_copy"
  | "label_palette"
  | "label_review"
  | "label_print_check"
  // Special (2 credits)
  | "extract_order"
  // Medium (3 credits)
  | "generate_email"
  | "generate_blog_post"
  | "compose_contact_email"
  | "label_background"
  // Heavy (5 credits)
  | "generate_automation"
  | "refine_automation"
  | "plan_campaign"
  | "plan_social"
  | "plan_automation"
  | "plan_ideas";

/** Credit cost per action type */
export const AI_CREDIT_COSTS: Record<AiActionType, number> = {
  // Light — 1 credit
  email_subject: 1,
  email_preview: 1,
  email_body: 1,
  social_caption: 1,
  product_name: 1,
  product_description: 1,
  product_meta_description: 1,
  discount_description: 1,
  form_description: 1,
  form_success_message: 1,
  website_heading: 1,
  website_body: 1,
  website_meta_title: 1,
  website_meta_description: 1,
  label_copy: 1,
  label_palette: 1,
  label_review: 1,
  label_print_check: 1,
  // Special — 2 credits
  extract_order: 2,
  // Medium — 3 credits
  generate_email: 3,
  generate_blog_post: 3,
  compose_contact_email: 3,
  label_background: 3,
  // Heavy — 5 credits
  generate_automation: 5,
  refine_automation: 5,
  plan_campaign: 5,
  plan_social: 5,
  plan_automation: 5,
  plan_ideas: 5,
};

/** Look up the credit cost for an action type */
export function getAiCreditCost(actionType: AiActionType): number {
  return AI_CREDIT_COSTS[actionType];
}

/** Human-readable labels for AI action types (used in ledger displays) */
export const AI_ACTION_LABELS: Record<AiActionType, string> = {
  email_subject: "Email Subject",
  email_preview: "Email Preview",
  email_body: "Email Body",
  social_caption: "Social Caption",
  product_name: "Product Name",
  product_description: "Product Description",
  product_meta_description: "Product Meta Description",
  discount_description: "Discount Description",
  form_description: "Form Description",
  form_success_message: "Form Success Message",
  website_heading: "Website Heading",
  website_body: "Website Body",
  website_meta_title: "Website Meta Title",
  website_meta_description: "Website Meta Description",
  label_copy: "Label Copy",
  label_palette: "Palette Suggestion",
  label_review: "Layout Review",
  label_print_check: "Print Readiness Check",
  extract_order: "Order Extraction",
  generate_email: "Email Generation",
  generate_blog_post: "Blog Post",
  compose_contact_email: "Contact Email",
  label_background: "Background Generation",
  generate_automation: "Automation Generation",
  refine_automation: "Automation Refinement",
  plan_campaign: "Campaign Plan",
  plan_social: "Social Plan",
  plan_automation: "Automation Plan",
  plan_ideas: "Ideas Plan",
};

// ── Sales Feature Keys & Gates ────────────────────────────────

export type SalesFeatureKey =
  | "products"
  | "orders"
  | "storefront"
  | "wholesale"
  | "crm"
  | "invoices"
  | "analytics"
  | "aiCreditsPerMonth"
  | "wholesaleOrdersPerMonth"
  | "orderExtraction";

/** Feature limits by tier. `true` = enabled, `number` = monthly limit. */
export const SALES_FEATURES: Record<
  TierLevel,
  Record<SalesFeatureKey, boolean | number>
> = {
  free: {
    products: true,
    orders: true,
    storefront: false,
    wholesale: false,
    crm: false,
    invoices: false,
    analytics: false,
    aiCreditsPerMonth: 0,
    wholesaleOrdersPerMonth: 0,
    orderExtraction: false,
  },
  starter: {
    products: true,
    orders: true,
    storefront: true,
    wholesale: false,
    crm: true,
    invoices: false,
    analytics: false,
    aiCreditsPerMonth: 50,
    wholesaleOrdersPerMonth: 10,
    orderExtraction: true,
  },
  growth: {
    products: true,
    orders: true,
    storefront: true,
    wholesale: true,
    crm: true,
    invoices: true,
    analytics: false,
    aiCreditsPerMonth: 150,
    wholesaleOrdersPerMonth: 50,
    orderExtraction: true,
  },
  pro: {
    products: true,
    orders: true,
    storefront: true,
    wholesale: true,
    crm: true,
    invoices: true,
    analytics: true,
    aiCreditsPerMonth: 500,
    wholesaleOrdersPerMonth: 200,
    orderExtraction: true,
  },
  scale: {
    products: true,
    orders: true,
    storefront: true,
    wholesale: true,
    crm: true,
    invoices: true,
    analytics: true,
    aiCreditsPerMonth: 1500,
    wholesaleOrdersPerMonth: 9999,
    orderExtraction: true,
  },
};

export const FEATURE_LABELS: Record<SalesFeatureKey, string> = {
  products: "Product Management",
  orders: "Order Tracking",
  storefront: "Storefront",
  wholesale: "Wholesale",
  crm: "CRM & Contacts",
  invoices: "Invoicing",
  analytics: "Sales Analytics",
  aiCreditsPerMonth: "AI Credits / Month",
  wholesaleOrdersPerMonth: "Wholesale Orders / Month",
  orderExtraction: "AI Order Extraction",
};

/**
 * Get the effective feature set for a roaster based on their sales tier.
 * Future: could layer in tier overrides or add-ons.
 */
export function getEffectiveFeatures(
  salesTier: TierLevel
): Record<SalesFeatureKey, boolean | number> {
  return SALES_FEATURES[salesTier] ?? SALES_FEATURES.free;
}

/**
 * Check whether a specific feature is enabled for a given sales tier.
 * For boolean features, returns the boolean. For numeric limits, returns true if > 0.
 */
export function checkFeature(
  salesTier: TierLevel,
  feature: SalesFeatureKey
): boolean {
  const value = getEffectiveFeatures(salesTier)[feature];
  if (typeof value === "boolean") return value;
  return value > 0;
}
