import { Metadata } from "next";
import Link from "next/link";
import {
  Boxes,
  ClipboardList,
  Store,
  ShoppingCart,
  Users,
  Receipt,
  BarChart3,
  CalendarDays,
  Mail,
  Share2,
  Zap,
  Tags,
  Code2,
  Sparkles,
  Globe,
  ArrowRight,
  ChevronRight,
  Rocket,
  Package,
} from "lucide-react";
import { client } from "@/sanity/lib/client";
import {
  roasterFeaturesQuery,
  roasterFeaturesFaqsQuery,
} from "@/sanity/lib/queries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Features",
  description:
    "Explore the full suite of tools Ghost Roastery Platform offers coffee roasters — storefronts, wholesale, marketing, analytics, and more.",
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
    icon: <Boxes className="w-6 h-6" />,
    title: "Product Management",
    description:
      "Manage your coffee catalogue, blends, sizes, and pricing in one place.",
    href: "/features/product-management",
  },
  {
    icon: <ClipboardList className="w-6 h-6" />,
    title: "Order Tracking",
    description:
      "Track every order from placement to delivery with real-time status updates.",
    href: "/features/order-tracking",
  },
  {
    icon: <Store className="w-6 h-6" />,
    title: "Storefront",
    description:
      "Launch a branded online store with your own domain. Sell bags, subscriptions, and merchandise.",
    href: "/features/storefront",
  },
  {
    icon: <ShoppingCart className="w-6 h-6" />,
    title: "Wholesale",
    description:
      "Manage wholesale accounts, custom pricing tiers, minimum order quantities, and repeat orders.",
    href: "/features/wholesale",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "CRM",
    description:
      "Customer profiles, purchase history, segments, and lifetime value tracking.",
    href: "/features/crm",
  },
  {
    icon: <Receipt className="w-6 h-6" />,
    title: "Invoices",
    description:
      "Generate and send professional invoices. Track payments and export for your accountant.",
    href: "/features/invoices",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Analytics",
    description:
      "Sales dashboards, revenue tracking, best sellers, and customer acquisition metrics.",
    href: "/features/sales-analytics",
  },
];

const marketingFeatures: DefaultFeature[] = [
  {
    icon: <CalendarDays className="w-6 h-6" />,
    title: "Content Calendar",
    description:
      "Plan, create, and schedule all your content from a single calendar view.",
    href: "/features/content-calendar",
  },
  {
    icon: <Mail className="w-6 h-6" />,
    title: "Email Campaigns",
    description:
      "Design and send beautiful email campaigns. Segmentation and analytics built in.",
    href: "/features/email-campaigns",
  },
  {
    icon: <Share2 className="w-6 h-6" />,
    title: "Social Scheduling",
    description:
      "Plan, create, and schedule social media posts across Instagram, Facebook, and LinkedIn.",
    href: "/features/social-scheduling",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Automations",
    description:
      "Build automated workflows — welcome sequences, abandoned carts, and re-engagement.",
    href: "/features/automations",
  },
  {
    icon: <Tags className="w-6 h-6" />,
    title: "Discount Codes",
    description:
      "Create percentage or fixed-amount codes for promotions, loyalty, and first-time buyers.",
    href: "/features/discount-codes",
  },
  {
    icon: <Code2 className="w-6 h-6" />,
    title: "Embedded Forms",
    description:
      "Capture leads and grow your audience with embeddable signup and contact forms.",
    href: "/features/embedded-forms",
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "AI Studio",
    description:
      "Generate product descriptions, social captions, email copy, and marketing images with AI.",
    href: "/features/ai-studio",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Analytics",
    description:
      "Campaign performance, audience metrics, and engagement tracking in one place.",
    href: "/features/marketing-analytics",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Marketing Websites",
    description:
      "Build full marketing sites for your brand — landing pages, about pages, and more.",
    href: "/features/marketing-websites",
    comingSoon: true,
  },
];

// ── Icon Map (for Sanity-sourced features) ───────────────────

const iconMap: Record<string, React.ReactNode> = {
  boxes: <Boxes className="w-6 h-6" />,
  "clipboard-list": <ClipboardList className="w-6 h-6" />,
  store: <Store className="w-6 h-6" />,
  "shopping-cart": <ShoppingCart className="w-6 h-6" />,
  users: <Users className="w-6 h-6" />,
  receipt: <Receipt className="w-6 h-6" />,
  "bar-chart-3": <BarChart3 className="w-6 h-6" />,
  "calendar-days": <CalendarDays className="w-6 h-6" />,
  mail: <Mail className="w-6 h-6" />,
  share2: <Share2 className="w-6 h-6" />,
  zap: <Zap className="w-6 h-6" />,
  tags: <Tags className="w-6 h-6" />,
  code2: <Code2 className="w-6 h-6" />,
  sparkles: <Sparkles className="w-6 h-6" />,
  globe: <Globe className="w-6 h-6" />,
  package: <Package className="w-6 h-6" />,
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
          <ChevronRight className="w-4 h-4 ml-1" />
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
  // Fetch Sanity features (used as override if content exists)
  const sanityFeatures = await client
    .fetch<Feature[]>(roasterFeaturesQuery)
    .catch(() => []);

  // Fetch FAQs
  const faqs = await client
    .fetch<FAQ[]>(roasterFeaturesFaqsQuery)
    .catch(() => []);

  // If Sanity has features, build cards from them; otherwise use defaults
  const hasSanityFeatures = sanityFeatures && sanityFeatures.length > 0;

  const resolvedSalesFeatures = hasSanityFeatures
    ? sanityFeatures
        .filter((f) => f.category === "sales")
        .map((f) => ({
          icon: iconMap[f.icon || "package"] || <Package className="w-6 h-6" />,
          title: f.title,
          description: f.description,
          href: `/roasters/features/${f.slug?.current || f.title.toLowerCase().replace(/\s+/g, "-")}`,
        }))
    : salesFeatures;

  const resolvedMarketingFeatures = hasSanityFeatures
    ? sanityFeatures
        .filter((f) => f.category === "marketing")
        .map((f) => ({
          icon: iconMap[f.icon || "package"] || <Package className="w-6 h-6" />,
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
            Powerful tools for{" "}
            <span className="text-accent">modern roasters</span>
          </h1>
          <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto mb-10">
            Everything you need to sell, market, and grow your coffee brand
            online — all included on every plan.
          </p>
          <a
            href={PLATFORM_URL}
            className="inline-flex items-center px-8 py-4 bg-accent text-white font-semibold text-lg rounded-lg hover:bg-accent-hover transition-colors"
          >
            Get Started Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </a>
        </div>
      </section>

      {/* ── Sales Suite ──────────────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 mb-3">
              Sales Suite
            </h2>
            <p className="text-neutral-500 text-lg">
              Included free on every plan
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
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Marketing Suite ──────────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-white border-t border-neutral-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 mb-3">
              Marketing Suite
            </h2>
            <p className="text-neutral-500 text-lg">
              Included free on every plan
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
              <ArrowRight className="ml-2 w-4 h-4" />
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
                <Rocket className="w-7 h-7" />
              </div>
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-accent bg-accent/10 px-3 py-1 rounded-full mb-4">
                Coming Soon
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 mb-4">
                Marketplace
              </h2>
              <p className="text-neutral-600 text-lg max-w-xl mx-auto">
                List your coffees on the Ghost Roastery marketplace and reach
                thousands of new customers. We handle the storefront, checkout,
                and marketing — you handle the roasting.
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
                Frequently Asked Questions
              </h2>
              <div className="divide-y divide-neutral-200 border-t border-b border-neutral-200">
                {faqs.map((faq) => (
                  <details key={faq._id} className="group">
                    <summary className="flex items-center justify-between cursor-pointer py-5 text-left text-lg font-semibold text-neutral-900 hover:text-accent transition-colors">
                      {faq.question}
                      <ChevronRight className="w-5 h-5 text-neutral-400 group-open:rotate-90 transition-transform flex-shrink-0 ml-4" />
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
            Start selling coffee online today
          </h2>
          <p className="text-lg text-neutral-300 max-w-xl mx-auto mb-10">
            Create your account and explore the platform. No credit card
            required.
          </p>
          <a
            href={PLATFORM_URL}
            className="inline-flex items-center px-8 py-4 bg-accent text-white font-semibold text-lg rounded-lg hover:bg-accent-hover transition-colors"
          >
            Get Started Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </a>
        </div>
      </section>
    </>
  );
}
