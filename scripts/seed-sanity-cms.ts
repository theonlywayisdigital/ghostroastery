/**
 * Seed Script — Sanity CMS Content Migration
 *
 * Populates all new singletons and documents with current hardcoded marketing copy.
 * Safe to re-run: uses createOrReplace for singletons, createIfNotExists for documents.
 *
 * Usage:
 *   npx tsx scripts/seed-sanity-cms.ts
 *
 * Requires SANITY_API_TOKEN in .env.local (with write access).
 */

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

async function seed() {
  console.log("\n🌱 Seeding Sanity CMS content...\n");

  // ── Customer Singletons ─────────────────────────────────────

  console.log("── Customer Site Singletons ──");

  await client.createOrReplace({
    _id: "customerHomePage",
    _type: "customerHomePage",
    heroHeadline: "Your brand.\nOur roastery.\nNobody needs to know.",
    heroSubheadline:
      "Ghost roasted, packed and shipped across the UK. Your name on every bag.",
    heroPrimaryCta: "Build Your Brand",
    heroPrimaryCtaHref: "/build",
    heroSecondaryCta: "Wholesale Enquiry",
    heroSecondaryCtaHref: "/wholesale",
    howItWorksTitle: "From idea to shelf in four steps",
    howItWorksSteps: [
      {
        _key: "step1",
        number: "01",
        icon: "Palette",
        title: "Design",
        description: "Choose your bag, colour and size",
      },
      {
        _key: "step2",
        number: "02",
        icon: "Tag",
        title: "Brand",
        description: "Upload your label or use our Label Maker",
      },
      {
        _key: "step3",
        number: "03",
        icon: "Fire",
        title: "Roast",
        description: "We roast fresh to your flavour profile",
      },
      {
        _key: "step4",
        number: "04",
        icon: "Truck",
        title: "Deliver",
        description: "Packed and shipped to your door",
      },
    ],
    trustSignals: [
      { _key: "ts1", icon: "MapPin", label: "UK Based Roastery" },
      { _key: "ts2", icon: "Coffee", label: "Specialty Grade Coffee" },
      { _key: "ts3", icon: "ShieldCheck", label: "Food-Safe Packaging" },
      { _key: "ts4", icon: "Clock", label: "Small Batch Weekly Roasts" },
      { _key: "ts5", icon: "Truck", label: "Ships Across the UK" },
    ],
    productPathsTitle: "Two ways to work with us",
    productPaths: [
      {
        _key: "pp1",
        title: "Bespoke Branded Bags",
        description:
          "For businesses and entrepreneurs who want their own branded coffee",
        features: [
          "Minimum order: 25 bags",
          "Sizes: 250g, 500g, 1kg",
          "Your label, your brand",
          "Fresh roasted weekly",
        ],
        ctaText: "Build Your Brand",
        ctaHref: "/build",
        variant: "primary",
      },
      {
        _key: "pp2",
        title: "Wholesale",
        description:
          "For cafes, offices, restaurants wanting bulk supply",
        features: [
          "Orders: 150+ bags",
          "Custom roast profiles",
          "Flexible delivery schedules",
          "Branded or unbranded options",
        ],
        ctaText: "Wholesale Enquiry",
        ctaHref: "/wholesale",
        variant: "secondary",
      },
    ],
    pricingSectionTitle: "Transparent pricing. No surprises.",
    pricingSectionSubtitle:
      "Prices include roasting, packing and labelling. Shipping calculated at checkout.",
    pricingSectionFootnote:
      "Need 100+ bags? Check out our wholesale pricing.",
    pricingSectionCta: "Start Your Order",
    caseStudySectionTitle: "Built with Ghost Roastery",
    finalCtaHeadline: "Ready to launch your coffee brand?",
    finalCtaPrimaryCta: "Build Your Brand",
    finalCtaPrimaryHref: "/build",
    finalCtaSecondaryCta: "Get in Touch",
    finalCtaSecondaryHref: "/contact",
  });
  console.log("  ✓ customerHomePage");

  await client.createOrReplace({
    _id: "customerAboutPage",
    _type: "customerAboutPage",
    heroHeadline: "Specialty coffee. Ghost roasted.",
    heroSubheadline:
      "We're a UK-based ghost roasting service helping businesses launch and grow their own coffee brands.",
    storyTitle: "Why we built this",
    storyBody: [
      {
        _type: "block",
        _key: "b1",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "Coffee is one of the most consumed products in the world. But launching a coffee brand has always meant either owning a roastery or compromising on quality. We built Ghost Roastery to change that.",
            marks: [],
          },
        ],
      },
      {
        _type: "block",
        _key: "b2",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "s2",
            text: "Our partner roastery has been roasting specialty coffee for years. Small batches, ethically sourced beans, proper craft. We opened up that capability so that any business — a gym, a café, a wellness brand — can put their name on a bag of genuinely great coffee.",
            marks: [],
          },
        ],
      },
      {
        _type: "block",
        _key: "b3",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "s3",
            text: "We proved the model worked by building our own brand first. Off Your Bean is a real, live, shoppable coffee brand built entirely through Ghost Roastery. If we can do it for ourselves, we can do it for you.",
            marks: [],
          },
        ],
      },
    ],
    valuesTitle: "What we stand for",
    values: [
      {
        _key: "v1",
        icon: "Coffee",
        title: "Specialty Grade Only",
        description:
          "We only roast beans that meet specialty grade standards. No compromises.",
      },
      {
        _key: "v2",
        icon: "Leaf",
        title: "Ethically Sourced",
        description:
          "Every bean is sourced from farms that share our values. Quality starts at origin.",
      },
      {
        _key: "v3",
        icon: "Clock",
        title: "Small Batch Always",
        description:
          "We roast in small batches every week. Fresher coffee, better flavour.",
      },
    ],
    proofCtaTitle: "Want to see the proof?",
    proofCtaDescription:
      "Off Your Bean is our own coffee brand, built using the exact same service we offer you. From concept to live store in under two weeks.",
    proofCtaButtonText: "See the case study",
    proofCtaButtonHref: "/brands/off-your-bean",
  });
  console.log("  ✓ customerAboutPage");

  await client.createOrReplace({
    _id: "customerHowItWorksPage",
    _type: "customerHowItWorksPage",
    heroHeadline: "Three steps to your own coffee brand.",
    heroSubheadline:
      "No roastery needed. No minimum experience. Just your brand on a bag of specialty coffee.",
    stepsTitle: "The process",
    steps: [
      {
        _key: "s1",
        icon: "PaintBrush",
        step: "01",
        title: "Design Your Brand",
        description:
          "Choose your coffee blend, create your label using our design tool, and tell us about your brand. We'll guide you through every decision.",
      },
      {
        _key: "s2",
        icon: "Package",
        step: "02",
        title: "We Roast & Pack",
        description:
          "Our partner roastery roasts your chosen blend in small batches, packs it in your branded bags, and quality checks every order.",
      },
      {
        _key: "s3",
        icon: "Truck",
        step: "03",
        title: "Delivered to You",
        description:
          "Your branded coffee is dispatched directly to you or your customers. From order to delivery in 7-10 working days.",
      },
    ],
    ctaTitle: "Ready to get started?",
    ctaDescription:
      "Build your brand in minutes and receive your first order in 7-10 working days.",
    ctaButtonText: "Build Your Brand",
    ctaButtonHref: "/build",
  });
  console.log("  ✓ customerHowItWorksPage");

  await client.createOrReplace({
    _id: "customerOurCoffeePage",
    _type: "customerOurCoffeePage",
    heroHeadline: "Specialty coffee, every time.",
    heroSubheadline:
      "We only work with specialty-grade beans. Ethically sourced, small batch roasted, and packed fresh for your brand.",
    highlightsTitle: "What makes our coffee different",
    highlights: [
      {
        _key: "h1",
        icon: "Trophy",
        title: "Specialty Grade",
        description:
          "Every bean scores 80+ on the SCA scale. No commodity coffee, no compromises.",
      },
      {
        _key: "h2",
        icon: "Leaf",
        title: "Ethically Sourced",
        description:
          "Sourced from farms and cooperatives that prioritise fair wages and sustainable practices.",
      },
      {
        _key: "h3",
        icon: "Coffee",
        title: "Small Batch Roasted",
        description:
          "Roasted weekly in small batches for maximum freshness and flavour consistency.",
      },
    ],
    ctaTitle: "Put your name on it",
    ctaDescription:
      "Our coffee is ready for your brand. Design your label and we handle the rest.",
    ctaButtonText: "Build Your Brand",
    ctaButtonHref: "/build",
  });
  console.log("  ✓ customerOurCoffeePage");

  await client.createOrReplace({
    _id: "customerRoastingProcessPage",
    _type: "customerRoastingProcessPage",
    heroHeadline: "From green bean to perfect roast.",
    heroSubheadline:
      "Specialty coffee is a craft. Here's how our partner roasters turn raw beans into something exceptional.",
    stagesTitle: "The journey",
    stages: [
      {
        _key: "st1",
        icon: "Thermometer",
        title: "Green Bean Selection",
        description:
          "We source specialty-grade green beans from ethical farms and cooperatives. Every lot is cupped and graded before it enters our supply chain.",
      },
      {
        _key: "st2",
        icon: "Timer",
        title: "Small Batch Roasting",
        description:
          "Our roasters profile each bean to bring out its best characteristics. Roasted in small batches weekly to ensure peak freshness.",
      },
      {
        _key: "st3",
        icon: "CheckCircle",
        title: "Quality Control & Packing",
        description:
          "Every batch is quality checked before packing. Your branded bags are filled, sealed, and prepared for dispatch with care.",
      },
    ],
    ctaTitle: "Ready to start?",
    ctaDescription:
      "Your brand, our roasting expertise. Build your coffee brand in minutes.",
    ctaButtonText: "Build Your Brand",
    ctaButtonHref: "/build",
  });
  console.log("  ✓ customerRoastingProcessPage");

  await client.createOrReplace({
    _id: "customerBrandsPage",
    _type: "customerBrandsPage",
    heroHeadline: "Brands built with Ghost Roastery.",
    heroSubheadline:
      "Real brands, real customers — all powered by our ghost roasting service. See what's possible.",
    placeholderTitle: "Our brand partners",
    placeholderCopy:
      "We're currently onboarding our first wave of brand partners. Check back soon to see their stories, or start building your own brand today.",
    ctaButtonText: "Build Your Brand",
    ctaButtonHref: "/build",
  });
  console.log("  ✓ customerBrandsPage");

  await client.createOrReplace({
    _id: "customerPartnersPage",
    _type: "customerPartnersPage",
    heroHeadline: "The roasters behind the scenes.",
    heroSubheadline:
      "Every bag of Ghost Roastery coffee is roasted by experienced specialty roasters. Here's who makes it happen.",
    sectionTitle: "Our roasting partners",
    description:
      "Our partner roasters are handpicked for their commitment to quality, consistency, and specialty-grade standards. They roast in small batches, source ethically, and treat every order with care.",
    placeholderNote:
      "Partner profiles coming soon. In the meantime, learn more about our roasting standards.",
    ctaButtonText: "The Roasting Process",
    ctaButtonHref: "/the-roasting-process",
  });
  console.log("  ✓ customerPartnersPage");

  await client.createOrReplace({
    _id: "customerSupportPage",
    _type: "customerSupportPage",
    heroHeadline: "How can we help?",
    heroSubheadline:
      "Whether it's about your order, your brand, or just a question — we're here for you.",
    optionsTitle: "Get in touch",
    supportOptions: [
      {
        _key: "so1",
        icon: "Envelope",
        title: "Email Us",
        description:
          "Drop us an email and we'll get back to you within 24 hours.",
        cta: "Contact Us",
        href: "/contact",
        disabled: false,
      },
      {
        _key: "so2",
        icon: "ChatCircle",
        title: "Live Chat",
        description:
          "Chat with our team during business hours for quick answers.",
        cta: "Coming Soon",
        href: "#",
        disabled: true,
      },
      {
        _key: "so3",
        icon: "BookOpen",
        title: "Knowledge Base",
        description:
          "Browse guides, FAQs, and tutorials to find answers fast.",
        cta: "Coming Soon",
        href: "#",
        disabled: true,
      },
    ],
  });
  console.log("  ✓ customerSupportPage");

  await client.createOrReplace({
    _id: "customerWholesalePage",
    _type: "customerWholesalePage",
    heroHeadline: "Coffee at scale. Your way.",
    heroSubheadline:
      "For businesses that need volume, consistency and flexibility. 150+ bags per order. Branded or unbranded.",
    businessTypesTitle: "Who we work with",
    businessTypes: [
      { _key: "bt1", icon: "Coffee", title: "Cafes & Coffee Shops", description: "Your own blend, your own brand" },
      { _key: "bt2", icon: "Barbell", title: "Gyms & Fitness Brands", description: "Add a revenue stream your members will love" },
      { _key: "bt3", icon: "Buildings", title: "Offices & Corporates", description: "Quality coffee under your company name" },
      { _key: "bt4", icon: "ForkKnife", title: "Restaurants & Hospitality", description: "The last thing your guests taste should be yours" },
      { _key: "bt5", icon: "Heart", title: "Wellness Brands", description: "Ethically sourced, specialty grade, your label" },
      { _key: "bt6", icon: "Lightbulb", title: "Entrepreneurs", description: "The lowest barrier product business you can start" },
    ],
    featuresTitle: "What you get",
    features: [
      { _key: "f1", icon: "Palette", title: "Custom roast profile", description: "Matched to your brief" },
      { _key: "f2", icon: "Package", title: "Choice of bag styles", description: "250g, 500g, 1kg options" },
      { _key: "f3", icon: "Coffee", title: "Branded or unbranded", description: "Your choice of packaging" },
      { _key: "f4", icon: "ArrowsClockwise", title: "Flexible delivery", description: "Schedules across the UK" },
    ],
    formTitle: "Tell us about your order",
    formSubtitle:
      "Fill in the form below and we'll get back to you within 2 business days.",
    faqTitle: "Frequently asked questions",
  });
  console.log("  ✓ customerWholesalePage");

  await client.createOrReplace({
    _id: "customerContactPage",
    _type: "customerContactPage",
    heroHeadline: "Get in touch",
    heroSubheadline:
      "Not sure which service is right for you? Drop us a message and we'll point you in the right direction.",
    pathCards: [
      {
        _key: "pc1",
        icon: "Palette",
        title: "Ready to build your brand?",
        description: "From 25 bags. Design, roast, deliver.",
        ctaText: "Start the builder",
        ctaHref: "/build",
        variant: "primary",
      },
      {
        _key: "pc2",
        icon: "Package",
        title: "Need 150+ bags?",
        description: "Custom pricing for volume orders.",
        ctaText: "Wholesale enquiry",
        ctaHref: "/wholesale",
        variant: "outline",
      },
    ],
    pathCardsFootnote: "Or fill in the form below for anything else",
    formTitle: "Send us a message",
    formSubtitle: "We typically respond within 1-2 business days.",
  });
  console.log("  ✓ customerContactPage");

  await client.createOrReplace({
    _id: "customerBlogSettings",
    _type: "customerBlogSettings",
    heroHeadline: "The Ghost Roastery Blog.",
    heroSubheadline:
      "Tips, guides, and insights on building a coffee brand, white labelling, and the specialty coffee industry.",
    latestPostsTitle: "Latest posts",
    emptyStateMessage:
      "We're working on our first articles. Check back soon for guides on launching your coffee brand, marketing tips, and industry news.",
  });
  console.log("  ✓ customerBlogSettings");

  // ── Customer Legal Pages ────────────────────────────────────

  console.log("\n── Customer Legal Pages ──");

  await client.createIfNotExists({
    _id: "legalPrivacy",
    _type: "customerLegalPage",
    title: "Privacy Policy",
    slug: { _type: "slug", current: "privacy" },
    heroHeadline: "Privacy Policy.",
    heroSubheadline:
      "How we collect, use, and protect your personal data.",
    body: [
      {
        _type: "block",
        _key: "pb1",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "ps1",
            text: "This privacy policy is being prepared and will be published shortly. If you have any questions about how we handle your data in the meantime, please contact us.",
            marks: [],
          },
        ],
      },
    ],
    lastUpdated: "2026-03-06",
  });
  console.log("  ✓ Privacy Policy");

  await client.createIfNotExists({
    _id: "legalTerms",
    _type: "customerLegalPage",
    title: "Terms & Conditions",
    slug: { _type: "slug", current: "terms" },
    heroHeadline: "Terms & Conditions.",
    heroSubheadline:
      "The terms of service for using the Ghost Roastery website and services.",
    body: [
      {
        _type: "block",
        _key: "tb1",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "ts1",
            text: "Our terms and conditions are being prepared and will be published shortly. If you have any questions about our terms of service in the meantime, please contact us.",
            marks: [],
          },
        ],
      },
    ],
    lastUpdated: "2026-03-06",
  });
  console.log("  ✓ Terms & Conditions");

  // ── Roaster Singletons ──────────────────────────────────────

  console.log("\n── Roaster Site Singletons ──");

  await client.createOrReplace({
    _id: "roasterFeaturesPage",
    _type: "roasterFeaturesPage",
    heroHeadline: "Powerful tools for modern roasters",
    heroSubheadline:
      "Everything you need to sell, market, and grow your coffee brand online — all included on every plan.",
    heroCtaText: "Get Started Free",
    salesSuiteTitle: "Sales Suite",
    salesSuiteSubtitle: "Included free on every plan",
    marketingSuiteTitle: "Marketing Suite",
    marketingSuiteSubtitle: "Included free on every plan",
    marketplaceTitle: "Marketplace",
    marketplaceCopy:
      "List your coffees on the Ghost Roastery marketplace and reach thousands of new customers. We handle the storefront, checkout, and marketing — you handle the roasting.",
    faqTitle: "Frequently Asked Questions",
    ctaHeadline: "Start selling coffee online today",
    ctaDescription:
      "Create your account and explore the platform. No credit card required.",
    ctaButtonText: "Get Started Free",
  });
  console.log("  ✓ roasterFeaturesPage");

  await client.createOrReplace({
    _id: "roasterPricingPage",
    _type: "roasterPricingPage",
    heroHeadline: "Simple, transparent pricing",
    heroSubheadline:
      "Start free with both suites. Upgrade as you grow — no transaction fees on any paid plan.",
    faqTitle: "Frequently asked questions",
    ctaHeadline: "Start selling with zero upfront cost",
    ctaDescription:
      "Both suites included free. No credit card required. Upgrade only when you need more.",
    ctaButtonText: "Get Started Free",
  });
  console.log("  ✓ roasterPricingPage");

  await client.createOrReplace({
    _id: "roasterPartnerProgramPage",
    _type: "roasterPartnerProgramPage",
    heroHeadline: "Ghost Roaster Partner Programme",
    heroSubheadline:
      "We bring the orders. You bring the craft. A partnership that fills your roaster and grows your business.",
    heroCtaText: "Apply Now",
    stepsTitle: "How it works",
    steps: [
      { _key: "ps1", step: "01", title: "Apply to join", description: "Tell us about your roastery, capacity, and specialities. We review applications within 48 hours." },
      { _key: "ps2", step: "02", title: "Get verified", description: "We verify your roastery meets our quality standards with a sample evaluation and facility check." },
      { _key: "ps3", step: "03", title: "Receive orders", description: "Ghost Roastery customers place orders through our platform. You receive them in your dashboard." },
      { _key: "ps4", step: "04", title: "Roast & ship", description: "Roast the order, print the label, and dispatch. We handle payments and customer communication." },
    ],
    benefitsTitle: "Why partner with us",
    benefits: [
      { _key: "pb1", icon: "TrendUp", title: "Guaranteed Volume", description: "Receive a steady stream of orders from Ghost Roastery's growing customer base. Fill your roaster's spare capacity." },
      { _key: "pb2", icon: "ShieldCheck", title: "We Handle Marketing", description: "Our team manages all marketing, customer acquisition, and brand building. You focus on what you do best — roasting." },
      { _key: "pb3", icon: "Package", title: "Simple Fulfilment", description: "Receive orders, print labels, and mark as dispatched. Our dashboard makes fulfilment effortless." },
      { _key: "pb4", icon: "Lightning", title: "Fast Payouts", description: "Transparent payout system with regular payment batches. See exactly what you've earned and when it'll arrive." },
    ],
    requirementsTitle: "Requirements",
    requirements: [
      "UK-based speciality coffee roastery",
      "SCA-grade equipment and quality standards",
      "Capacity to fulfil orders within 3-5 business days",
      "Food safety certification (HACCP or equivalent)",
      "Ability to roast a range of profiles (light to dark)",
      "Commitment to consistent quality",
    ],
    ctaHeadline: "Ready to become a Ghost Roaster?",
    ctaDescription:
      "Apply today and start receiving orders within the week. No upfront costs, no risk.",
    ctaButtonText: "Apply Now",
  });
  console.log("  ✓ roasterPartnerProgramPage");

  await client.createOrReplace({
    _id: "roasterProductsCarousel",
    _type: "roasterProductsCarousel",
    suites: [
      {
        _key: "cs1",
        key: "sales",
        label: "Sales Suite",
        tagline: "Sell wholesale and direct — from one dashboard",
        description:
          "Manage your products, launch a branded storefront, track every order, handle wholesale accounts, and get paid automatically. Included free on every plan.",
        features: [
          { _key: "csf1", icon: "ClipboardText", title: "Order Tracking", description: "Track every order from placement to delivery with real-time status updates.", href: "/features/order-tracking" },
          { _key: "csf2", icon: "ShoppingCart", title: "Wholesale", description: "Manage wholesale accounts, custom pricing tiers, and repeat orders.", href: "/features/wholesale" },
          { _key: "csf3", icon: "Storefront", title: "Storefront", description: "Launch a branded online store with your own domain. Sell bags, subscriptions, and merch.", href: "/features/storefront" },
          { _key: "csf4", icon: "Receipt", title: "Invoices", description: "Generate and send professional invoices. Track payments and export for your accountant.", href: "/features/invoices" },
        ],
      },
      {
        _key: "cs2",
        key: "marketing",
        label: "Marketing Suite",
        tagline: "Grow your brand on autopilot",
        description:
          "Email campaigns, social scheduling, automations, and AI-powered content — all included free on every plan.",
        features: [
          { _key: "cmf1", icon: "Envelope", title: "Email Campaigns", description: "Design beautiful emails that drive repeat orders. Segmentation and analytics built in.", href: "/features/email-campaigns" },
          { _key: "cmf2", icon: "ShareNetwork", title: "Social Scheduling", description: "Plan, create, and schedule social media posts across Instagram, Facebook, and LinkedIn.", href: "/features/social-scheduling" },
          { _key: "cmf3", icon: "Lightning", title: "Automations", description: "Build automated workflows — welcome sequences, abandoned carts, and re-engagement.", href: "/features/automations" },
          { _key: "cmf4", icon: "Sparkle", title: "AI Studio", description: "Generate product descriptions, social captions, email copy, and marketing images with AI.", href: "/features/ai-studio" },
        ],
      },
    ],
  });
  console.log("  ✓ roasterProductsCarousel");

  // ── Patch roastersPageSettings with new homepage fields ──────

  console.log("\n── Patching roastersPageSettings ──");

  await client
    .patch("roastersPageSettings")
    .set({
      videoSectionTitle: "See the platform in action",
      videoSectionSubtitle: "2 minute overview",
      ctaStrip1Headline: "Everything you need to sell coffee online",
      ctaStrip1Subtitle:
        "No monthly fees. No commission on storefront sales. Free forever.",
      toolsSectionTitle: "Powerful tools for modern roasters",
      toolsSectionSubtitle:
        "Everything you need to sell coffee and grow your brand — in one platform.",
      ctaStrip2Headline: "Ready to grow your roastery?",
      ctaStrip2Subtitle:
        "Join hundreds of roasters already selling more coffee with less effort.",
      caseStudiesSectionTitle: "Roaster success stories",
      caseStudiesSectionSubtitle:
        "See how roasters are growing their businesses with Ghost Roastery Platform.",
      blogSectionTitle: "Latest from the blog",
      blogSectionSubtitle:
        "Tips, guides, and industry insights to help you sell more coffee.",
      partnerSectionLabel: "Partner Program",
      partnerSectionTitle: "Earn more by roasting for other brands",
      partnerSectionSubtitle:
        "Join our ghost roasting network. We send you the orders — you roast and ship. Guaranteed volume, zero marketing overhead.",
      partnerSteps: [
        { _key: "hps1", icon: "SealCheck", step: "01", title: "Apply & Get Verified", description: "Tell us about your roastery. We verify your capacity, equipment, and quality standards." },
        { _key: "hps2", icon: "Package", step: "02", title: "Receive Orders", description: "Orders from brands in your territory land directly in your dashboard." },
        { _key: "hps3", icon: "Truck", step: "03", title: "Roast & Ship", description: "Roast to spec, print shipping labels, and dispatch within the deadline." },
        { _key: "hps4", icon: "HandCoins", step: "04", title: "Get Paid", description: "Payouts processed automatically. Transparent rates with no hidden fees." },
      ],
    })
    .commit();
  console.log("  ✓ roastersPageSettings patched");

  // ── Roaster Feature Details ─────────────────────────────────

  console.log("\n── Roaster Feature Details ──");

  const featureDetails = [
    // Sales Suite
    {
      _id: "fd-product-management",
      slug: "product-management",
      suite: "sales",
      heroDescription:
        "Manage your coffee catalogue, blends, sizes, and pricing. Upload images, set variants, and keep your inventory organised.",
      benefits: [
        "Add unlimited coffee products, blends, and merchandise",
        "Set multiple sizes, grind options, and variants per product",
        "Upload high-quality product imagery and tasting notes",
        "Organise products by category, origin, or roast level",
        "Set pricing per channel — storefront, wholesale, and subscription",
        "Track stock levels and get low-inventory alerts",
      ],
      ctaHeadline: "Start selling coffee online today",
      ctaDescription: "Create your account and explore the platform. No credit card required.",
    },
    {
      _id: "fd-order-tracking",
      slug: "order-tracking",
      suite: "sales",
      heroDescription:
        "Track every order from placement to delivery. Real-time status updates, dispatch tracking, and automated customer notifications.",
      benefits: [
        "Real-time order lifecycle from placement to delivery",
        "Automated status updates sent to customers at every step",
        "Integrated dispatch tracking with major UK carriers",
        "Filter and search orders by status, date, or customer",
        "Batch process orders for faster fulfilment",
        "Export order data for reporting and accounting",
      ],
      ctaHeadline: "Start selling coffee online today",
      ctaDescription: "Create your account and explore the platform. No credit card required.",
    },
    {
      _id: "fd-storefront",
      slug: "storefront",
      suite: "sales",
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
      ctaHeadline: "Launch your online coffee shop",
      ctaDescription: "Create your account and start selling directly to customers. No credit card required.",
    },
    {
      _id: "fd-wholesale",
      slug: "wholesale",
      suite: "sales",
      heroDescription:
        "Manage wholesale accounts, custom pricing, and B2B orders — all from one platform.",
      benefits: [
        "Set different prices for different wholesale customers based on volume or relationship",
        "Configure minimum order quantities per product to protect margins",
        "Customers can reorder their usual wholesale order in one click",
        "Manage wholesale accounts, view order history, and track outstanding balances",
        "Invite wholesale customers to a private ordering portal",
        "Generate invoices and track payments automatically",
      ],
      ctaHeadline: "Start selling wholesale today",
      ctaDescription: "Create your account and explore the platform. No credit card required.",
    },
    {
      _id: "fd-crm",
      slug: "crm",
      suite: "sales",
      heroDescription:
        "Customer profiles, purchase history, segments, and lifetime value tracking. Know your customers and grow your relationships.",
      benefits: [
        "Unified customer profiles with full purchase history",
        "Track customer lifetime value and purchase frequency",
        "Create segments based on behaviour, location, or spend",
        "Sync customer data with email campaigns and automations",
        "See which products each customer buys most",
        "Export customer lists for external tools",
      ],
      ctaHeadline: "Start selling coffee online today",
      ctaDescription: "Create your account and explore the platform. No credit card required.",
    },
    {
      _id: "fd-invoices",
      slug: "invoices",
      suite: "sales",
      heroDescription:
        "Generate and send professional invoices automatically. Track payments, overdue balances, and export for your accountant.",
      benefits: [
        "Auto-generate invoices for wholesale and storefront orders",
        "Send invoices directly via email with payment links",
        "Track paid, unpaid, and overdue invoices at a glance",
        "Set payment terms and automatic reminders",
        "Download PDF invoices for your records",
        "Export invoice data for accounting software",
      ],
      ctaHeadline: "Start selling coffee online today",
      ctaDescription: "Create your account and explore the platform. No credit card required.",
    },
    {
      _id: "fd-sales-analytics",
      slug: "sales-analytics",
      suite: "sales",
      heroDescription:
        "Sales dashboards, revenue tracking, best sellers, and customer acquisition metrics. Data-driven decisions for your roastery.",
      benefits: [
        "Revenue dashboards with daily, weekly, and monthly views",
        "Track best-selling products, blends, and sizes",
        "Customer acquisition and retention metrics",
        "Compare performance across channels — storefront vs wholesale",
        "Seasonal trend analysis to plan your roasting schedule",
        "Export reports as CSV or PDF",
      ],
      ctaHeadline: "Start selling coffee online today",
      ctaDescription: "Create your account and explore the platform. No credit card required.",
    },
    // Marketing Suite
    {
      _id: "fd-content-calendar",
      slug: "content-calendar",
      suite: "marketing",
      heroDescription:
        "Plan, create, and schedule all your content from a single calendar view. Stay organised and consistent.",
      benefits: [
        "Visual calendar showing all scheduled content across channels",
        "Drag and drop to reschedule posts and campaigns",
        "Plan email campaigns, social posts, and promotions in one view",
        "Set reminders for upcoming launches and seasonal events",
        "Collaborate with your team on content planning",
        "Filter by channel, status, or content type",
      ],
      ctaHeadline: "Grow your coffee brand today",
      ctaDescription: "Create your free account and start reaching more customers with powerful marketing tools.",
    },
    {
      _id: "fd-email-campaigns",
      slug: "email-campaigns",
      suite: "marketing",
      heroDescription:
        "Design beautiful emails that drive repeat orders and keep your brand top of mind. Drag & drop builder, audience segmentation, analytics, and templates.",
      benefits: [
        "Create stunning emails with a visual drag & drop editor",
        "Target customers by purchase history, location, or engagement level",
        "Track opens, clicks, and conversions with campaign analytics",
        "Pre-built templates for new launches, seasonal promos, and newsletters",
      ],
      ctaHeadline: "Start sending campaigns today",
      ctaDescription: "Create your free account and start reaching customers with beautiful, high-converting email campaigns.",
    },
    {
      _id: "fd-social-scheduling",
      slug: "social-scheduling",
      suite: "marketing",
      heroDescription:
        "Plan, create, and schedule social media posts across Instagram, Facebook, and LinkedIn from one dashboard.",
      benefits: [
        "Schedule posts across Instagram, Facebook, and LinkedIn from one place",
        "Visual content calendar with drag-and-drop scheduling",
        "Preview posts exactly as they'll appear on each platform",
        "Best-time-to-post suggestions based on audience engagement",
        "Media library for organising and reusing images and videos",
        "Track post performance with engagement analytics",
      ],
      ctaHeadline: "Grow your coffee brand today",
      ctaDescription: "Create your free account and start reaching more customers with powerful marketing tools.",
    },
    {
      _id: "fd-automations",
      slug: "automations",
      suite: "marketing",
      heroDescription:
        "Set it and forget it. Build workflows that nurture customers and drive revenue on autopilot.",
      benefits: [
        "Automatically onboard new customers with welcome email sequences",
        "Win back lost sales with abandoned cart recovery reminders",
        "Reach out to customers who haven't ordered recently",
        "Build custom automations triggered by any customer action or event",
      ],
      ctaHeadline: "Automate your marketing",
      ctaDescription: "Create your account and let smart workflows do the heavy lifting.",
    },
    {
      _id: "fd-discount-codes",
      slug: "discount-codes",
      suite: "marketing",
      heroDescription:
        "Create percentage or fixed-amount discount codes for promotions, loyalty rewards, and first-time buyers.",
      benefits: [
        "Create percentage, fixed-amount, or free shipping codes",
        "Set usage limits per code or per customer",
        "Target specific products, categories, or order minimums",
        "Set start and end dates for time-limited promotions",
        "Track redemption rates and revenue impact",
        "Share codes via email campaigns, social, or your storefront",
      ],
      ctaHeadline: "Grow your coffee brand today",
      ctaDescription: "Create your free account and start reaching more customers with powerful marketing tools.",
    },
    {
      _id: "fd-embedded-forms",
      slug: "embedded-forms",
      suite: "marketing",
      heroDescription:
        "Capture leads and grow your audience with embeddable signup and contact forms on any website.",
      benefits: [
        "Drag and drop form builder — no coding required",
        "Embed forms on any website with a simple code snippet",
        "Auto-sync new signups with your CRM and email lists",
        "Customise form fields, colours, and styling to match your brand",
        "Track form submissions and conversion rates",
        "Trigger automated welcome sequences on signup",
      ],
      ctaHeadline: "Grow your coffee brand today",
      ctaDescription: "Create your free account and start reaching more customers with powerful marketing tools.",
    },
    {
      _id: "fd-ai-studio",
      slug: "ai-studio",
      suite: "marketing",
      heroDescription:
        "Generate product descriptions, social captions, email copy, and marketing images with AI trained on specialty coffee.",
      benefits: [
        "Generate product descriptions from tasting notes and origin details",
        "Create social media captions tailored to each platform",
        "Write email subject lines and campaign copy in seconds",
        "Generate marketing images and visual content with AI",
        "Train AI on your brand voice for consistent messaging",
        "Edit and refine AI-generated content before publishing",
      ],
      ctaHeadline: "Grow your coffee brand today",
      ctaDescription: "Create your free account and start reaching more customers with powerful marketing tools.",
    },
    {
      _id: "fd-marketing-analytics",
      slug: "marketing-analytics",
      suite: "marketing",
      heroDescription:
        "Campaign performance, audience metrics, and engagement tracking. Understand what's working and double down.",
      benefits: [
        "Email campaign performance — opens, clicks, and conversions",
        "Audience growth and subscriber trends over time",
        "Automation performance — triggers, completions, and revenue",
        "Form submission and conversion rate tracking",
        "Compare campaign performance side by side",
        "Export analytics data as CSV or PDF",
      ],
      ctaHeadline: "Grow your coffee brand today",
      ctaDescription: "Create your free account and start reaching more customers with powerful marketing tools.",
    },
    {
      _id: "fd-marketing-websites",
      slug: "marketing-websites",
      suite: "marketing",
      heroDescription:
        "Build full marketing sites for your brand. Landing pages, about pages, and more. Coming soon.",
      benefits: [
        "Build landing pages, about pages, and brand stories",
        "Drag and drop page builder — no coding required",
        "Connect your custom domain",
        "SEO-optimised pages with meta tags and structured data",
        "Integrated with your storefront and email campaigns",
        "Mobile-responsive design out of the box",
      ],
      ctaHeadline: "Get notified when Marketing Websites launches",
      ctaDescription: "Create your free account and be the first to know when Marketing Websites is available.",
      comingSoon: true,
    },
    {
      _id: "fd-marketplace",
      slug: "marketplace",
      suite: "sales",
      heroDescription:
        "Source green beans, packaging, equipment, and supplies for your roastery through the Ghost Roastery Marketplace.",
      benefits: [],
      ctaHeadline: "Join the platform today",
      ctaDescription: "Get started with Ghost Roastery and be the first to know when the Marketplace launches.",
      comingSoon: true,
    },
  ];

  for (const fd of featureDetails) {
    await client.createIfNotExists({
      _id: fd._id,
      _type: "roasterFeatureDetail",
      slug: { _type: "slug", current: fd.slug },
      suite: fd.suite,
      heroDescription: fd.heroDescription,
      includedNote: "Included free on every plan",
      benefits: fd.benefits,
      benefitsTitle: "What you get",
      ctaHeadline: fd.ctaHeadline,
      ctaDescription: fd.ctaDescription,
      ctaButtonText: "Get Started Free",
      comingSoon: fd.comingSoon || false,
    });
    console.log(`  ✓ ${fd.slug}`);
  }

  console.log("\n✅ Sanity CMS seeding complete!\n");
}

seed().catch(console.error);
