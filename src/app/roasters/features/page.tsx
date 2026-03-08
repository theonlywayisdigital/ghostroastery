import { Metadata } from "next";
import Link from "next/link";
import {
  Package,
  ClipboardText,
  Storefront,
  ShoppingCart,
  Users,
  Receipt,
  ChartBar,
  Calendar,
  Envelope,
  ShareNetwork,
  Lightning,
  Tag,
  Code,
  Sparkle,
  Globe,
  ArrowRight,
  CaretRight,
  Rocket,
  Leaf,
  Fire,
  CalendarBlank,
  Star,
  Calculator,
  Certificate,
  Layout,
  PaintBrush,
  Compass,
  Eye,
  Wrench,
  Browser,
} from "@phosphor-icons/react/dist/ssr";
import { client } from "@/sanity/lib/client";
import {
  roasterFeaturesQuery,
  roasterFeaturesFaqsQuery,
  roasterFeaturesPageQuery,
} from "@/sanity/lib/queries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Features — Sales, Marketing, Roaster Tools & Website Builder",
  description:
    "Everything a coffee roaster needs in one platform. Sales suite, marketing suite, roaster tools (free), and website builder. Sell, market, and grow your roastery.",
};

const PLATFORM_URL = "https://platform.ghostroastery.com";

// ── Types ────────────────────────────────────────────────────

interface Feature {
  _id: string;
  title: string;
  slug?: { current: string };
  description: string;
  category: string;
  icon?: string;
  order?: number;
}

interface FAQ {
  _id: string;
  question: string;
  answer: string;
}

// ── Default Features (inline fallback) ───────────────────────

interface DefaultFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  comingSoon?: boolean;
}

const salesFeatures: DefaultFeature[] = [
  {
    icon: <Package size={28} weight="duotone" />,
    title: "Product Management",
    description:
      "Manage your coffee catalogue, blends, sizes, and pricing in one place.",
    href: "/features/product-management",
  },
  {
    icon: <ClipboardText size={28} weight="duotone" />,
    title: "Order Tracking",
    description:
      "Track every order from placement to delivery with real-time status updates.",
    href: "/features/order-tracking",
  },
  {
    icon: <Storefront size={28} weight="duotone" />,
    title: "Storefront",
    description:
      "Launch a branded online store with your own domain. Sell bags, subscriptions, and merchandise.",
    href: "/features/storefront",
  },
  {
    icon: <ShoppingCart size={28} weight="duotone" />,
    title: "Wholesale",
    description:
      "Manage wholesale accounts, custom pricing tiers, minimum order quantities, and repeat orders.",
    href: "/features/wholesale",
  },
  {
    icon: <Users size={28} weight="duotone" />,
    title: "CRM",
    description:
      "Customer profiles, purchase history, segments, and lifetime value tracking.",
    href: "/features/crm",
  },
  {
    icon: <Receipt size={28} weight="duotone" />,
    title: "Invoices",
    description:
      "Generate and send professional invoices. Track payments and export for your accountant.",
    href: "/features/invoices",
  },
  {
    icon: <ChartBar size={28} weight="duotone" />,
    title: "Analytics",
    description:
      "Sales dashboards, revenue tracking, best sellers, and customer acquisition metrics.",
    href: "/features/sales-analytics",
  },
];

const marketingFeatures: DefaultFeature[] = [
  {
    icon: <Calendar size={28} weight="duotone" />,
    title: "Content Calendar",
    description:
      "Plan, create, and schedule all your content from a single calendar view.",
    href: "/features/content-calendar",
  },
  {
    icon: <Envelope size={28} weight="duotone" />,
    title: "Email Campaigns",
    description:
      "Design and send beautiful email campaigns. Segmentation and analytics built in.",
    href: "/features/email-campaigns",
  },
  {
    icon: <ShareNetwork size={28} weight="duotone" />,
    title: "Social Scheduling",
    description:
      "Plan, create, and schedule social media posts across Instagram, Facebook, and LinkedIn.",
    href: "/features/social-scheduling",
  },
  {
    icon: <Lightning size={28} weight="duotone" />,
    title: "Automations",
    description:
      "Build automated workflows — welcome sequences, abandoned carts, and re-engagement.",
    href: "/features/automations",
  },
  {
    icon: <Tag size={28} weight="duotone" />,
    title: "Discount Codes",
    description:
      "Create percentage or fixed-amount codes for promotions, loyalty, and first-time buyers.",
    href: "/features/discount-codes",
  },
  {
    icon: <Code size={28} weight="duotone" />,
    title: "Embedded Forms",
    description:
      "Capture leads and grow your audience with embeddable signup and contact forms.",
    href: "/features/embedded-forms",
  },
  {
    icon: <Sparkle size={28} weight="duotone" />,
    title: "AI Studio",
    description:
      "Generate product descriptions, social captions, email copy, and marketing images with AI.",
    href: "/features/ai-studio",
  },
  {
    icon: <ChartBar size={28} weight="duotone" />,
    title: "Analytics",
    description:
      "Campaign performance, audience metrics, and engagement tracking in one place.",
    href: "/features/marketing-analytics",
  },
  {
    icon: <Globe size={28} weight="duotone" />,
    title: "Marketing Websites",
    description:
      "Build full marketing sites for your brand — landing pages, about pages, and more.",
    href: "/features/marketing-websites",
    comingSoon: true,
  },
];

const roasterToolsFeatures: DefaultFeature[] = [
  {
    icon: <Leaf size={28} weight="duotone" />,
    title: "Green Bean Inventory",
    description:
      "Track green coffee from arrival to roast. Origins, suppliers, lot numbers, and remaining stock.",
    href: "/features/green-bean-inventory",
  },
  {
    icon: <Fire size={28} weight="duotone" />,
    title: "Roast Log",
    description:
      "Record profiles, charge temps, development times, and batch notes. Searchable library of every roast.",
    href: "/features/roast-log",
  },
  {
    icon: <CalendarBlank size={28} weight="duotone" />,
    title: "Production Planner",
    description:
      "Schedule roasts against orders and capacity. See what needs roasting and allocate batches.",
    href: "/features/production-planner",
  },
  {
    icon: <Star size={28} weight="duotone" />,
    title: "Cupping Scorecards",
    description:
      "SCA-aligned cupping forms. Compare scores across origins, profiles, and roast dates.",
    href: "/features/cupping-scorecards",
  },
  {
    icon: <Calculator size={28} weight="duotone" />,
    title: "Calculators",
    description:
      "Roast loss, brew ratio, and cost-per-cup calculators. The maths without the spreadsheet.",
    href: "/features/calculators",
  },
  {
    icon: <Certificate size={28} weight="duotone" />,
    title: "Certifications",
    description:
      "Manage organic, Fairtrade, and Rainforest Alliance certifications. Track expiry dates and documents.",
    href: "/features/certifications",
  },
];

const websiteBuilderFeatures: DefaultFeature[] = [
  {
    icon: <Layout size={28} weight="duotone" />,
    title: "Page Builder",
    description:
      "Drag-and-drop blocks to build pages in minutes. Hero sections, galleries, contact forms — all pre-built.",
    href: "/features/website",
  },
  {
    icon: <PaintBrush size={28} weight="duotone" />,
    title: "Design & Theming",
    description:
      "Set brand colours, typography, and logo once. Every page inherits your design automatically.",
    href: "/features/website",
  },
  {
    icon: <Compass size={28} weight="duotone" />,
    title: "Navigation & Menus",
    description:
      "Build your site structure with a visual menu editor. Add pages, dropdowns, and external links.",
    href: "/features/website",
  },
  {
    icon: <Globe size={28} weight="duotone" />,
    title: "Custom Domains",
    description:
      "Use your own domain — yourroastery.com. SSL certificate included. One-click setup.",
    href: "/features/website",
  },
  {
    icon: <Eye size={28} weight="duotone" />,
    title: "Live Preview",
    description:
      "See exactly what your page looks like before publishing. Desktop and mobile preview.",
    href: "/features/website",
  },
];

// ── Icon Map (for Sanity-sourced features) ───────────────────

const iconMap: Record<string, React.ReactNode> = {
  boxes: <Package size={28} weight="duotone" />,
  "clipboard-list": <ClipboardText size={28} weight="duotone" />,
  store: <Storefront size={28} weight="duotone" />,
  "shopping-cart": <ShoppingCart size={28} weight="duotone" />,
  users: <Users size={28} weight="duotone" />,
  receipt: <Receipt size={28} weight="duotone" />,
  "bar-chart-3": <ChartBar size={28} weight="duotone" />,
  "calendar-days": <Calendar size={28} weight="duotone" />,
  mail: <Envelope size={28} weight="duotone" />,
  share2: <ShareNetwork size={28} weight="duotone" />,
  zap: <Lightning size={28} weight="duotone" />,
  tags: <Tag size={28} weight="duotone" />,
  code2: <Code size={28} weight="duotone" />,
  sparkles: <Sparkle size={28} weight="duotone" />,
  globe: <Globe size={28} weight="duotone" />,
  package: <Package size={28} weight="duotone" />,
};

// ── Feature Card Component ───────────────────────────────────

function FeatureCard({ feature }: { feature: DefaultFeature }) {
  const card = (
    <div className="group relative p-6 rounded-xl border border-neutral-200 hover:border-accent/30 hover:shadow-lg transition-all duration-300 bg-white">
      {feature.comingSoon && (
        <span className="absolute top-4 right-4 text-xs font-semibold uppercase tracking-wider text-accent bg-accent/10 px-2.5 py-1 rounded-full">
          Coming Soon
        </span>
      )}
      <div className="w-12 h-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-white transition-colors">
        {feature.icon}
      </div>
      <h3 className="text-xl font-bold text-neutral-900 mb-2">
        {feature.title}
      </h3>
      <p className="text-neutral-600">{feature.description}</p>
      {!feature.comingSoon && (
        <div className="mt-4 flex items-center text-sm font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity">
          Learn more
          <CaretRight size={20} weight="duotone" className="ml-1" />
        </div>
      )}
    </div>
  );

  if (feature.comingSoon) {
    return card;
  }

  return (
    <Link href={feature.href} className="block">
      {card}
    </Link>
  );
}

// ── Page Component ───────────────────────────────────────────

export default async function FeaturesPage() {
  // Fetch Sanity content in parallel
  const [sanityFeatures, faqs, cms] = await Promise.all([
    client.fetch<Feature[]>(roasterFeaturesQuery).catch(() => []),
    client.fetch<FAQ[]>(roasterFeaturesFaqsQuery).catch(() => []),
    client.fetch(roasterFeaturesPageQuery).catch(() => null),
  ]);

  // If Sanity has features, build cards from them; otherwise use defaults
  const hasSanityFeatures = sanityFeatures && sanityFeatures.length > 0;

  const resolvedSalesFeatures = hasSanityFeatures
    ? sanityFeatures
        .filter((f) => f.category === "sales")
        .map((f) => ({
          icon: iconMap[f.icon || "package"] || <Package size={28} weight="duotone" />,
          title: f.title,
          description: f.description,
          href: `/roasters/features/${f.slug?.current || f.title.toLowerCase().replace(/\s+/g, "-")}`,
        }))
    : salesFeatures;

  const resolvedMarketingFeatures = hasSanityFeatures
    ? sanityFeatures
        .filter((f) => f.category === "marketing")
        .map((f) => ({
          icon: iconMap[f.icon || "package"] || <Package size={28} weight="duotone" />,
          title: f.title,
          description: f.description,
          href: `/roasters/features/${f.slug?.current || f.title.toLowerCase().replace(/\s+/g, "-")}`,
          comingSoon: f.title === "Marketing Websites",
        }))
    : marketingFeatures;

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-neutral-900 mb-6">
            {cms?.heroHeadline ?? "Powerful tools for"}{" "}
            <span className="text-accent">{cms?.heroAccentText ?? "modern roasters"}</span>
          </h1>
          <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto mb-10">
            {cms?.heroSubheadline ?? "Everything you need to sell, market, and grow your coffee brand online — all included on every plan."}
          </p>
          <a
            href={PLATFORM_URL}
            className="inline-flex items-center px-8 py-4 bg-accent text-white font-semibold text-lg rounded-lg hover:bg-accent-hover transition-colors"
          >
            {cms?.heroCtaText ?? "Get Started Free"}
            <ArrowRight size={24} weight="duotone" className="ml-2" />
          </a>
        </div>
      </section>

      {/* ── Sales Suite ──────────────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 mb-3">
              {cms?.salesSuiteTitle ?? "Sales Suite"}
            </h2>
            <p className="text-neutral-500 text-lg">
              {cms?.salesSuiteSubtitle ?? "Included free on every plan"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resolvedSalesFeatures.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/features/sales"
              className="inline-flex items-center text-accent font-semibold hover:underline"
            >
              View all Sales Suite features
              <ArrowRight size={20} weight="duotone" className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Marketing Suite ──────────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-white border-t border-neutral-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 mb-3">
              {cms?.marketingSuiteTitle ?? "Marketing Suite"}
            </h2>
            <p className="text-neutral-500 text-lg">
              {cms?.marketingSuiteSubtitle ?? "Included free on every plan"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resolvedMarketingFeatures.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/features/marketing"
              className="inline-flex items-center text-accent font-semibold hover:underline"
            >
              View all Marketing Suite features
              <ArrowRight size={20} weight="duotone" className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Roaster Tools ─────────────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 mb-3">
              Roaster Tools
            </h2>
            <p className="text-neutral-500 text-lg">
              Free on every plan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {roasterToolsFeatures.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/features/roaster-tools"
              className="inline-flex items-center text-accent font-semibold hover:underline"
            >
              View all Roaster Tools
              <ArrowRight size={20} weight="duotone" className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Website Builder ────────────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-white border-t border-neutral-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 mb-3">
              Website Builder
            </h2>
            <p className="text-neutral-500 text-lg">
              From £14/month
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {websiteBuilderFeatures.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/features/website"
              className="inline-flex items-center text-accent font-semibold hover:underline"
            >
              Learn more about Website Builder
              <ArrowRight size={20} weight="duotone" className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Marketplace ──────────────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="p-10 rounded-2xl border border-dashed border-neutral-300 bg-white">
              <div className="w-14 h-14 rounded-xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-6">
                <Rocket size={32} weight="duotone" />
              </div>
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-accent bg-accent/10 px-3 py-1 rounded-full mb-4">
                Coming Soon
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 mb-4">
                {cms?.marketplaceTitle ?? "Marketplace"}
              </h2>
              <p className="text-neutral-600 text-lg max-w-xl mx-auto">
                {cms?.marketplaceCopy ?? "List your coffees on the Ghost Roastery marketplace and reach thousands of new customers. We handle the storefront, checkout, and marketing — you handle the roasting."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      {faqs.length > 0 && (
        <section className="py-16 lg:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 text-center mb-12">
                {cms?.faqTitle ?? "Frequently Asked Questions"}
              </h2>
              <div className="divide-y divide-neutral-200 border-t border-b border-neutral-200">
                {faqs.map((faq) => (
                  <details key={faq._id} className="group">
                    <summary className="flex items-center justify-between cursor-pointer py-5 text-left text-lg font-semibold text-neutral-900 hover:text-accent transition-colors">
                      {faq.question}
                      <CaretRight size={24} weight="duotone" className="text-neutral-400 group-open:rotate-90 transition-transform flex-shrink-0 ml-4" />
                    </summary>
                    <div className="pb-5 text-neutral-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Final CTA ────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-neutral-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-6">
            {cms?.ctaHeadline ?? "Start selling coffee online today"}
          </h2>
          <p className="text-lg text-neutral-300 max-w-xl mx-auto mb-10">
            {cms?.ctaDescription ?? "Create your account and explore the platform. No credit card required."}
          </p>
          <a
            href={PLATFORM_URL}
            className="inline-flex items-center px-8 py-4 bg-accent text-white font-semibold text-lg rounded-lg hover:bg-accent-hover transition-colors"
          >
            {cms?.ctaButtonText ?? "Get Started Free"}
            <ArrowRight size={24} weight="duotone" className="ml-2" />
          </a>
        </div>
      </section>
    </>
  );
}
