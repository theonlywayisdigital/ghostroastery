import { createClient } from "@sanity/client";
import { config } from "dotenv";

config({ path: ".env.local" });

const client = createClient({
  projectId: "z97yvgto",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

console.log("Token loaded:", process.env.SANITY_API_TOKEN ? "Yes" : "No");

// ── Types ─────────────────────────────────────────────────────

interface RoasterFeatureSeed {
  _type: "roasterFeature";
  _id: string;
  title: string;
  slug: { _type: "slug"; current: string };
  description: string;
  category: string;
  icon?: string;
  order: number;
  isActive: boolean;
}

interface RoasterFeatureDetailSeed {
  _type: "roasterFeatureDetail";
  _id: string;
  feature: { _type: "reference"; _ref: string };
  slug: { _type: "slug"; current: string };
  suite: string;
  heroDescription: string;
  includedNote: string;
  benefits: string[];
  benefitsTitle: string;
  ctaHeadline: string;
  ctaDescription: string;
  ctaButtonText: string;
  comingSoon?: boolean;
}

// ── Feature data extracted from old hardcoded pages ───────────

interface FeatureData {
  slug: string;
  title: string;
  suite: "sales" | "marketing" | "marketplace";
  /** Short description for the feature card on the index page */
  indexDescription: string;
  /** Long description for the hero on the detail page */
  heroDescription: string;
  benefits: string[];
  benefitsTitle: string;
  ctaHeadline: string;
  ctaDescription: string;
  ctaButtonText: string;
  comingSoon?: boolean;
  /** roasterFeature category value */
  category: string;
  icon?: string;
  order: number;
}

const features: FeatureData[] = [
  // ── Sales Suite ─────────────────────────────────────────────

  {
    slug: "product-management",
    title: "Product Management",
    suite: "sales",
    category: "sales",
    icon: "boxes",
    order: 1,
    indexDescription:
      "Manage your coffee catalogue, blends, sizes, and pricing in one place.",
    heroDescription:
      "Manage your entire coffee catalogue from one dashboard. Add products, set sizes and variants, upload imagery, and organise your inventory — so your storefront and wholesale channels always have the right products on display.",
    benefits: [
      "Add unlimited coffee products, blends, and merchandise",
      "Set multiple sizes, grind options, and variants per product",
      "Upload high-quality product imagery and tasting notes",
      "Organise products by category, origin, or roast level",
      "Set pricing per channel — storefront, wholesale, and subscription",
      "Track stock levels and get low-inventory alerts",
    ],
    benefitsTitle: "What you get",
    ctaHeadline: "Start selling coffee online today",
    ctaDescription:
      "Create your account and explore the platform. No credit card required.",
    ctaButtonText: "Get Started Free",
  },
  {
    slug: "order-tracking",
    title: "Order Tracking",
    suite: "sales",
    category: "sales",
    icon: "clipboard-list",
    order: 2,
    indexDescription:
      "Track every order from placement to delivery with real-time status updates.",
    heroDescription:
      "Track every order from the moment it's placed to the moment it arrives. Real-time status updates, dispatch tracking, and automated customer notifications — so you always know where every bag of coffee is.",
    benefits: [
      "Real-time order lifecycle from placement to delivery",
      "Automated status updates sent to customers at every step",
      "Integrated dispatch tracking with major UK carriers",
      "Filter and search orders by status, date, or customer",
      "Batch process orders for faster fulfilment",
      "Export order data for reporting and accounting",
    ],
    benefitsTitle: "What you get",
    ctaHeadline: "Start selling coffee online today",
    ctaDescription:
      "Create your account and explore the platform. No credit card required.",
    ctaButtonText: "Get Started Free",
  },
  {
    slug: "storefront",
    title: "Storefront",
    suite: "sales",
    category: "sales",
    icon: "store",
    order: 3,
    indexDescription:
      "Launch a branded online store with your own domain. Sell bags, subscriptions, and merchandise.",
    heroDescription:
      "Launch a fully branded online coffee shop — your products, your domain, your brand. Everything you need to sell direct-to-consumer, with subscriptions, discount codes, and a checkout that converts.",
    benefits: [
      "Your logo, colours, and domain — customers see your brand, not ours",
      "Showcase your coffees with rich descriptions, tasting notes, and imagery",
      "Offer recurring subscriptions with flexible frequencies and discounts",
      "Beautiful, mobile-optimised shopping experience out of the box",
      "Secure checkout with Stripe — cards, Apple Pay, and Google Pay",
      "SEO-friendly product pages to help customers find you online",
    ],
    benefitsTitle: "What you get",
    ctaHeadline: "Launch your online coffee shop",
    ctaDescription:
      "Create your account and start selling directly to customers. No credit card required.",
    ctaButtonText: "Get Started Free",
  },
  {
    slug: "wholesale",
    title: "Wholesale",
    suite: "sales",
    category: "sales",
    icon: "shopping-cart",
    order: 4,
    indexDescription:
      "Manage wholesale accounts, custom pricing tiers, minimum order quantities, and repeat orders.",
    heroDescription:
      "Manage wholesale accounts, custom pricing, and B2B orders — all from one platform. Set pricing tiers, minimum order quantities, and let your trade customers reorder with a single click.",
    benefits: [
      "Set different prices for different wholesale customers based on volume or relationship",
      "Configure minimum order quantities per product to protect margins",
      "Customers can reorder their usual wholesale order in one click",
      "Manage wholesale accounts, view order history, and track outstanding balances",
      "Invite wholesale customers to a private ordering portal",
      "Generate invoices and track payments automatically",
    ],
    benefitsTitle: "What you get",
    ctaHeadline: "Start selling wholesale today",
    ctaDescription:
      "Create your account and explore the platform. No credit card required.",
    ctaButtonText: "Get Started Free",
  },
  {
    slug: "crm",
    title: "CRM",
    suite: "sales",
    category: "sales",
    icon: "users",
    order: 5,
    indexDescription:
      "Customer profiles, purchase history, segments, and lifetime value tracking.",
    heroDescription:
      "Build deeper relationships with your customers. See their full purchase history, track lifetime value, create segments for targeted marketing, and turn one-time buyers into loyal regulars.",
    benefits: [
      "Unified customer profiles with full purchase history",
      "Track customer lifetime value and purchase frequency",
      "Create segments based on behaviour, location, or spend",
      "Sync customer data with email campaigns and automations",
      "See which products each customer buys most",
      "Export customer lists for external tools",
    ],
    benefitsTitle: "What you get",
    ctaHeadline: "Start selling coffee online today",
    ctaDescription:
      "Create your account and explore the platform. No credit card required.",
    ctaButtonText: "Get Started Free",
  },
  {
    slug: "invoices",
    title: "Invoices",
    suite: "sales",
    category: "sales",
    icon: "receipt",
    order: 6,
    indexDescription:
      "Generate and send professional invoices. Track payments and export for your accountant.",
    heroDescription:
      "Generate and send professional invoices automatically for every wholesale order. Track payments, chase overdue balances, and export everything your accountant needs — without the spreadsheet juggling.",
    benefits: [
      "Auto-generate invoices for wholesale and storefront orders",
      "Send invoices directly via email with payment links",
      "Track paid, unpaid, and overdue invoices at a glance",
      "Set payment terms and automatic reminders",
      "Download PDF invoices for your records",
      "Export invoice data for accounting software",
    ],
    benefitsTitle: "What you get",
    ctaHeadline: "Start selling coffee online today",
    ctaDescription:
      "Create your account and explore the platform. No credit card required.",
    ctaButtonText: "Get Started Free",
  },
  {
    slug: "sales-analytics",
    title: "Sales Analytics",
    suite: "sales",
    category: "sales",
    icon: "bar-chart-3",
    order: 7,
    indexDescription:
      "Sales dashboards, revenue tracking, best sellers, and customer acquisition metrics.",
    heroDescription:
      "See exactly how your roastery is performing. Revenue dashboards, best-selling products, customer acquisition trends, and seasonal insights — all the data you need to make smarter decisions.",
    benefits: [
      "Revenue dashboards with daily, weekly, and monthly views",
      "Track best-selling products, blends, and sizes",
      "Customer acquisition and retention metrics",
      "Compare performance across channels — storefront vs wholesale",
      "Seasonal trend analysis to plan your roasting schedule",
      "Export reports as CSV or PDF",
    ],
    benefitsTitle: "What you get",
    ctaHeadline: "Start selling coffee online today",
    ctaDescription:
      "Create your account and explore the platform. No credit card required.",
    ctaButtonText: "Get Started Free",
  },

  // ── Marketing Suite ─────────────────────────────────────────

  {
    slug: "content-calendar",
    title: "Content Calendar",
    suite: "marketing",
    category: "marketing",
    icon: "calendar-days",
    order: 1,
    indexDescription:
      "Plan, create, and schedule all your content from a single calendar view.",
    heroDescription:
      "Plan, create, and schedule all your marketing content from one calendar. See everything at a glance — email campaigns, social posts, promotions, and product launches — so nothing slips through the cracks.",
    benefits: [
      "Visual calendar showing all scheduled content across channels",
      "Drag and drop to reschedule posts and campaigns",
      "Plan email campaigns, social posts, and promotions in one view",
      "Set reminders for upcoming launches and seasonal events",
      "Collaborate with your team on content planning",
      "Filter by channel, status, or content type",
    ],
    benefitsTitle: "What you get",
    ctaHeadline: "Grow your coffee brand today",
    ctaDescription:
      "Create your free account and start reaching more customers with powerful marketing tools.",
    ctaButtonText: "Get Started Free",
  },
  {
    slug: "email-campaigns",
    title: "Email Campaigns",
    suite: "marketing",
    category: "marketing",
    icon: "mail",
    order: 2,
    indexDescription:
      "Design and send beautiful email campaigns. Segmentation and analytics built in.",
    heroDescription:
      "Design beautiful emails that drive repeat orders and keep your brand top of mind.",
    benefits: [
      "Drag & drop email builder — create stunning emails with a visual editor, no design skills needed",
      "Audience segmentation — target customers by purchase history, location, or engagement level",
      "Campaign analytics — track opens, clicks, and conversions to know exactly what's working",
      "Template library — pre-built templates for new launches, seasonal promos, and newsletters",
    ],
    benefitsTitle: "What you get",
    ctaHeadline: "Start sending campaigns today",
    ctaDescription:
      "Create your free account and start reaching customers with beautiful, high-converting email campaigns.",
    ctaButtonText: "Get Started Free",
  },
  {
    slug: "social-scheduling",
    title: "Social Scheduling",
    suite: "marketing",
    category: "marketing",
    icon: "share2",
    order: 3,
    indexDescription:
      "Plan, create, and schedule social media posts across Instagram, Facebook, and LinkedIn.",
    heroDescription:
      "Plan, create, and schedule social media posts across Instagram, Facebook, and LinkedIn — all from one dashboard. Stay consistent without the daily scramble.",
    benefits: [
      "Schedule posts across Instagram, Facebook, and LinkedIn from one place",
      "Visual content calendar with drag-and-drop scheduling",
      "Preview posts exactly as they'll appear on each platform",
      "Best-time-to-post suggestions based on audience engagement",
      "Media library for organising and reusing images and videos",
      "Track post performance with engagement analytics",
    ],
    benefitsTitle: "What you get",
    ctaHeadline: "Grow your coffee brand today",
    ctaDescription:
      "Create your free account and start reaching more customers with powerful marketing tools.",
    ctaButtonText: "Get Started Free",
  },
  {
    slug: "automations",
    title: "Automations",
    suite: "marketing",
    category: "marketing",
    icon: "zap",
    order: 4,
    indexDescription:
      "Build automated workflows — welcome sequences, abandoned carts, and re-engagement.",
    heroDescription:
      "Set it and forget it. Build workflows that nurture customers and drive revenue on autopilot.",
    benefits: [
      "Welcome sequences — automatically onboard new customers with a series of welcome emails",
      "Abandoned cart recovery — win back lost sales with timely reminders and incentives",
      "Re-engagement campaigns — automatically reach out to customers who haven't ordered recently",
      "Trigger-based workflows — build custom automations triggered by any customer action or event",
    ],
    benefitsTitle: "What you get",
    ctaHeadline: "Automate your marketing",
    ctaDescription:
      "Create your account and let smart workflows do the heavy lifting.",
    ctaButtonText: "Get Started Free",
  },
  {
    slug: "discount-codes",
    title: "Discount Codes",
    suite: "marketing",
    category: "marketing",
    icon: "tags",
    order: 5,
    indexDescription:
      "Create percentage or fixed-amount codes for promotions, loyalty, and first-time buyers.",
    heroDescription:
      "Create and manage discount codes for every occasion. Percentage off, fixed amount, free shipping, or buy-one-get-one — set usage limits, expiry dates, and target specific products or customer groups.",
    benefits: [
      "Create percentage, fixed-amount, or free shipping codes",
      "Set usage limits per code or per customer",
      "Target specific products, categories, or order minimums",
      "Set start and end dates for time-limited promotions",
      "Track redemption rates and revenue impact",
      "Share codes via email campaigns, social, or your storefront",
    ],
    benefitsTitle: "What you get",
    ctaHeadline: "Grow your coffee brand today",
    ctaDescription:
      "Create your free account and start reaching more customers with powerful marketing tools.",
    ctaButtonText: "Get Started Free",
  },
  {
    slug: "embedded-forms",
    title: "Embedded Forms",
    suite: "marketing",
    category: "marketing",
    icon: "code2",
    order: 6,
    indexDescription:
      "Capture leads and grow your audience with embeddable signup and contact forms.",
    heroDescription:
      "Grow your email list and capture leads with embeddable forms. Add signup forms, contact forms, and lead magnets to your website or storefront — and automatically sync new contacts with your CRM and email campaigns.",
    benefits: [
      "Drag and drop form builder — no coding required",
      "Embed forms on any website with a simple code snippet",
      "Auto-sync new signups with your CRM and email lists",
      "Customise form fields, colours, and styling to match your brand",
      "Track form submissions and conversion rates",
      "Trigger automated welcome sequences on signup",
    ],
    benefitsTitle: "What you get",
    ctaHeadline: "Grow your coffee brand today",
    ctaDescription:
      "Create your free account and start reaching more customers with powerful marketing tools.",
    ctaButtonText: "Get Started Free",
  },
  {
    slug: "ai-studio",
    title: "AI Studio",
    suite: "marketing",
    category: "marketing",
    icon: "sparkles",
    order: 7,
    indexDescription:
      "Generate product descriptions, social captions, email copy, and marketing images with AI.",
    heroDescription:
      "Let AI handle the heavy lifting. Generate product descriptions, social media captions, email copy, blog posts, and marketing images — all trained on specialty coffee language and your brand voice.",
    benefits: [
      "Generate product descriptions from tasting notes and origin details",
      "Create social media captions tailored to each platform",
      "Write email subject lines and campaign copy in seconds",
      "Generate marketing images and visual content with AI",
      "Train AI on your brand voice for consistent messaging",
      "Edit and refine AI-generated content before publishing",
    ],
    benefitsTitle: "What you get",
    ctaHeadline: "Grow your coffee brand today",
    ctaDescription:
      "Create your free account and start reaching more customers with powerful marketing tools.",
    ctaButtonText: "Get Started Free",
  },
  {
    slug: "marketing-analytics",
    title: "Marketing Analytics",
    suite: "marketing",
    category: "marketing",
    icon: "bar-chart-3",
    order: 8,
    indexDescription:
      "Campaign performance, audience metrics, and engagement tracking in one place.",
    heroDescription:
      "Understand exactly what's working and what isn't. Track email open rates, click-throughs, form conversions, automation performance, and audience growth — all from one analytics dashboard.",
    benefits: [
      "Email campaign performance — opens, clicks, and conversions",
      "Audience growth and subscriber trends over time",
      "Automation performance — triggers, completions, and revenue",
      "Form submission and conversion rate tracking",
      "Compare campaign performance side by side",
      "Export analytics data as CSV or PDF",
    ],
    benefitsTitle: "What you get",
    ctaHeadline: "Grow your coffee brand today",
    ctaDescription:
      "Create your free account and start reaching more customers with powerful marketing tools.",
    ctaButtonText: "Get Started Free",
  },
  {
    slug: "marketing-websites",
    title: "Marketing Websites",
    suite: "marketing",
    category: "marketing",
    icon: "globe",
    order: 9,
    indexDescription:
      "Build full marketing sites for your brand — landing pages, about pages, and more.",
    heroDescription:
      "Build full marketing sites for your brand. Landing pages, about pages, and more — with a drag and drop builder, custom domains, and SEO built in.",
    benefits: [
      "Build landing pages, about pages, and brand stories",
      "Drag and drop page builder — no coding required",
      "Connect your custom domain",
      "SEO-optimised pages with meta tags and structured data",
      "Integrated with your storefront and email campaigns",
      "Mobile-responsive design out of the box",
    ],
    benefitsTitle: "What's coming",
    ctaHeadline: "Get notified when Marketing Websites launches",
    ctaDescription:
      "Create your free account and be the first to know when Marketing Websites is available.",
    ctaButtonText: "Get Started Free",
    comingSoon: true,
  },

  // ── Marketplace ─────────────────────────────────────────────

  {
    slug: "marketplace",
    title: "Marketplace",
    suite: "marketplace",
    category: "marketplace",
    icon: "package",
    order: 1,
    indexDescription:
      "List your coffees on the Ghost Roastery marketplace and reach thousands of new customers.",
    heroDescription:
      "Source supplies for your roastery — from green beans and packaging to equipment and accessories — all in one place.",
    benefits: [
      "Source green beans, packaging, equipment, and supplies for your roastery",
      "Browse and compare suppliers in one marketplace",
      "The Marketplace is currently in development",
    ],
    benefitsTitle: "What's coming",
    ctaHeadline: "Join the platform today",
    ctaDescription:
      "Get started with Ghost Roastery and be the first to know when the Marketplace launches.",
    ctaButtonText: "Get Started Free",
    comingSoon: true,
  },
];

// ── Seed function ─────────────────────────────────────────────

async function seed() {
  console.log("Seeding roasterFeature + roasterFeatureDetail documents...\n");

  for (const f of features) {
    const featureId = `roasterFeature-${f.slug}`;
    const detailId = `roasterFeatureDetail-${f.slug}`;

    // 1. Create the roasterFeature document (used by features index page)
    const featureDoc: RoasterFeatureSeed = {
      _type: "roasterFeature",
      _id: featureId,
      title: f.title,
      slug: { _type: "slug", current: f.slug },
      description: f.indexDescription,
      category: f.category,
      icon: f.icon,
      order: f.order,
      isActive: true,
    };

    try {
      await client.createOrReplace(featureDoc);
      console.log(`  [feature]  ${f.title} (${featureId})`);
    } catch (err) {
      console.error(`  [feature]  FAILED ${f.title}: ${err}`);
    }

    // 2. Create the roasterFeatureDetail document (used by detail page)
    const detailDoc: RoasterFeatureDetailSeed = {
      _type: "roasterFeatureDetail",
      _id: detailId,
      feature: { _type: "reference", _ref: featureId },
      slug: { _type: "slug", current: f.slug },
      suite: f.suite,
      heroDescription: f.heroDescription,
      includedNote: f.comingSoon ? "" : "Included free on every plan",
      benefits: f.benefits,
      benefitsTitle: f.benefitsTitle,
      ctaHeadline: f.ctaHeadline,
      ctaDescription: f.ctaDescription,
      ctaButtonText: f.ctaButtonText,
      ...(f.comingSoon ? { comingSoon: true } : {}),
    };

    try {
      await client.createOrReplace(detailDoc);
      console.log(`  [detail]   ${f.title} (${detailId})`);
    } catch (err) {
      console.error(`  [detail]   FAILED ${f.title}: ${err}`);
    }
  }

  console.log(`\nDone! Created ${features.length} features + ${features.length} detail pages.`);
}

seed().catch(console.error);
