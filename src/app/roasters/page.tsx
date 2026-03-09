import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Package,
  Play,
  CalendarCheck,
  Truck,
  SealCheck,
  HandCoins,
} from "@phosphor-icons/react/dist/ssr";
import { client, urlFor } from "@/sanity/lib/client";
import {
  roastersPageSettingsQuery,
  roasterCaseStudiesQuery,
  roasterBlogPostsQuery,
  roasterProductsCarouselQuery,
} from "@/sanity/lib/queries";
import { ProductsCarousel } from "@/components/roasters/ProductsCarousel";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Ghost Roastery Platform — Sell, Market & Grow Your Roastery",
  description:
    "Everything you need to sell more coffee. Storefront, wholesale, marketing, roaster tools, and website builder — one platform, one login.",
};

const PLATFORM_URL = "https://platform.ghostroastery.com";

/* ── Types ─────────────────────────────────────────────── */

interface CaseStudy {
  _id: string;
  brandName: string;
  slug: { current: string };
  summary: string;
  logo?: { asset: { _ref: string } };
  isPlaceholder?: boolean;
}

interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  category?: string;
  publishedAt: string;
  featuredImage?: { asset: { _ref: string }; alt?: string };
}

const categoryLabels: Record<string, string> = {
  industry: "Industry Insights",
  guides: "How-To Guides",
  business: "Business Tips",
  coffee: "Coffee Knowledge",
};

/* ── Page ──────────────────────────────────────────────── */

export default async function RoastersHomePage() {
  const [settings, caseStudies, blogPosts, carouselCms] = await Promise.all([
    client.fetch(roastersPageSettingsQuery).catch(() => null),
    client.fetch<CaseStudy[]>(roasterCaseStudiesQuery).catch(() => []),
    client.fetch<BlogPost[]>(roasterBlogPostsQuery).catch(() => []),
    client.fetch(roasterProductsCarouselQuery).catch(() => null),
  ]);

  const headline =
    settings?.heroHeadline || "The all-in-one platform built for coffee roasters. Market. Sell. Manage.";
  const subheadline =
    settings?.heroSubheadline ||
    "Storefront, wholesale, marketing, roaster tools, and website builder — one platform, one login. Free to start.";

  const liveCaseStudies = caseStudies.filter((cs) => !cs.isPlaceholder);
  const latestPosts = blogPosts.slice(0, 3);

  /* ── Partner Steps (CMS with fallback) ──────────────── */
  const iconMap: Record<string, typeof SealCheck> = {
    SealCheck,
    Package,
    Truck,
    HandCoins,
  };

  const defaultPartnerSteps = [
    {
      icon: SealCheck,
      step: "01",
      title: "Apply",
      description:
        "Tell us about your roastery — equipment, capacity, and the profiles you roast. We verify quality and approve within 48 hours.",
    },
    {
      icon: Package,
      step: "02",
      title: "Match",
      description:
        "We match you with brands in your region that need your capacity. Orders land in your dashboard automatically.",
    },
    {
      icon: Truck,
      step: "03",
      title: "Roast & ship",
      description:
        "Roast to spec, print labels, and dispatch. We handle customer service, returns, and reorders.",
    },
    {
      icon: HandCoins,
      step: "04",
      title: "Get paid",
      description:
        "Payouts processed weekly. Transparent rates, no hidden fees, no invoicing to chase.",
    },
  ];

  const resolvedPartnerSteps = settings?.partnerSteps?.length
    ? settings.partnerSteps.map(
        (s: { step: string; title: string; description: string; icon?: string }, i: number) => ({
          icon: (s.icon && iconMap[s.icon]) || defaultPartnerSteps[i]?.icon || SealCheck,
          step: s.step,
          title: s.title,
          description: s.description,
        })
      )
    : defaultPartnerSteps;

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ghost Roastery",
    url: "https://roasters.ghostroastery.com",
    description:
      "The all-in-one platform for coffee roasters. Sales, marketing, roaster tools, and website builder.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "GB",
    },
  };

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Ghost Roastery Platform",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "GBP",
      description: "Free plan available. Paid plans from £29/month.",
    },
    description:
      "Sell coffee wholesale and direct-to-consumer, manage marketing, track roasts, and build your website — one platform.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareJsonLd),
        }}
      />

      {/* ═══════════════════════════════════════════════════
          1. HERO
      ═══════════════════════════════════════════════════ */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-neutral-50">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-50 via-transparent to-white" />
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 lg:py-28">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6 text-neutral-900">
            {headline.split(".")[0]}.
            {headline.split(".").slice(1).join(".").trim() && (
              <>
                <br />
                <span className="text-accent">
                  {headline.split(".").slice(1).join(".").trim()}
                </span>
              </>
            )}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-neutral-600 max-w-2xl mx-auto mb-10">
            {subheadline}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`${PLATFORM_URL}/signup`}
              className="inline-flex items-center px-8 py-4 border-2 border-accent bg-accent text-white font-semibold text-lg rounded-lg hover:bg-transparent hover:text-accent transition-colors"
            >
              Start Free
              <ArrowRight className="ml-2" size={24} weight="duotone" />
            </a>
            <a
              href={`${PLATFORM_URL}/demo`}
              className="inline-flex items-center px-8 py-4 border-2 border-neutral-300 text-neutral-700 font-semibold text-lg rounded-lg hover:border-neutral-700 hover:bg-neutral-700 hover:text-white transition-colors"
            >
              <CalendarCheck className="mr-2" size={24} weight="duotone" />
              Book a Demo
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          2. VIDEO PLACEHOLDER
      ═══════════════════════════════════════════════════ */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-200 shadow-xl">
              {/* Placeholder — replace with real video embed */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <div className="w-20 h-20 rounded-full bg-accent/90 flex items-center justify-center mb-4 hover:bg-accent transition-colors cursor-pointer">
                  <Play className="ml-1" size={40} weight="duotone" />
                </div>
                <p className="text-lg font-semibold">{settings?.videoSectionTitle ?? "See the platform in action"}</p>
                <p className="text-sm text-neutral-400 mt-1">{settings?.videoSectionSubtitle ?? "2 minute overview"}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          3. CTA STRIP #1
      ═══════════════════════════════════════════════════ */}
      <section className="py-12 bg-accent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {settings?.ctaStrip1Headline ?? "Stop stitching together Shopify, Mailchimp, and spreadsheets"}
              </h2>
              <p className="text-white/80 mt-1">
                {settings?.ctaStrip1Subtitle ?? "One platform for sales, marketing, production, and your website. Free to start."}
              </p>
            </div>
            <a
              href={`${PLATFORM_URL}/signup`}
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white bg-white text-accent font-semibold text-lg rounded-lg hover:bg-transparent hover:text-white transition-colors w-full md:w-auto"
            >
              Start Free
              <ArrowRight className="ml-2" size={24} weight="duotone" />
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          4. PRODUCTS — SALES & MARKETING CAROUSEL
      ═══════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 tracking-tight">
              {settings?.toolsSectionTitle ?? "Four products."}{" "}
              <span className="text-accent">{settings?.toolsSectionSubtitle ?? "One platform."}</span>
            </h2>
            <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
              {settings?.toolsSectionDescription ?? "Sales, marketing, roaster tools, and website builder. Each works on its own. Together they replace the stack of apps you're paying for."}
            </p>
          </div>
          <ProductsCarousel cms={carouselCms} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          5. CTA STRIP #2
      ═══════════════════════════════════════════════════ */}
      <section className="py-12 bg-neutral-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {settings?.ctaStrip2Headline ?? "Free to start. Paid plans that grow with your business."}
              </h2>
              <p className="text-neutral-400 mt-1">
                {settings?.ctaStrip2Subtitle ?? "No transaction fees on paid plans. No lock-in. Cancel any time."}
              </p>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <a
                href={`${PLATFORM_URL}/signup`}
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-accent bg-accent text-white font-semibold text-lg rounded-lg hover:bg-transparent hover:text-white transition-colors w-full md:w-auto"
              >
                Start Free
                <ArrowRight className="ml-2" size={24} weight="duotone" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          6. CASE STUDIES
      ═══════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 tracking-tight">
              {settings?.caseStudiesSectionTitle ?? "Roasters using the"}{" "}
              <span className="text-accent">platform</span>
            </h2>
            <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
              {settings?.caseStudiesSectionSubtitle ?? "Real roasteries. Real results. See how they sell more coffee with less overhead."}
            </p>
          </div>

          {liveCaseStudies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {liveCaseStudies.slice(0, 3).map((cs) => (
                <Link
                  key={cs._id}
                  href={`/case-studies/${cs.slug.current}`}
                  className="group bg-white rounded-xl border border-neutral-200 p-8 hover:shadow-lg transition-shadow flex flex-col"
                >
                  {cs.logo && (
                    <div className="h-16 mb-6 flex items-center">
                      <Image
                        src={urlFor(cs.logo).height(64).url()}
                        alt={cs.brandName}
                        width={160}
                        height={64}
                        className="h-12 w-auto object-contain"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-neutral-900 group-hover:text-accent transition-colors">
                    {cs.brandName}
                  </h3>
                  <p className="mt-2 text-neutral-600 text-sm flex-1">
                    {cs.summary}
                  </p>
                  <div className="mt-4 flex items-center text-accent font-semibold text-sm">
                    Read story
                    <ArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" size={20} weight="duotone" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* Empty state — placeholder cards */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {["Your Roastery Here", "Coming Soon", "Coming Soon"].map(
                (label, i) => (
                  <div
                    key={i}
                    className="bg-neutral-50 rounded-xl border border-neutral-200 border-dashed p-8 flex flex-col items-center justify-center text-center min-h-[240px]"
                  >
                    <p className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">
                      {label}
                    </p>
                    <p className="mt-2 text-sm text-neutral-500">
                      {i === 0
                        ? "We're collecting success stories from our early roasters."
                        : "Case studies launching soon."}
                    </p>
                  </div>
                )
              )}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
            >
              View all case studies
              <ArrowRight size={20} weight="duotone" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          7. BLOG — LATEST 3 POSTS
      ═══════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 tracking-tight">
              {settings?.blogSectionTitle ?? "From the"}{" "}
              <span className="text-accent">roaster blog</span>
            </h2>
            <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
              {settings?.blogSectionSubtitle ?? "Practical guides, industry insights, and business tips for working roasters."}
            </p>
          </div>

          {latestPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestPosts.map((post) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug.current}`}
                  className="group bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {post.featuredImage ? (
                    <div className="aspect-[16/9] relative overflow-hidden">
                      <Image
                        src={urlFor(post.featuredImage).width(600).height(338).url()}
                        alt={post.featuredImage.alt || post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/9] bg-neutral-100 flex items-center justify-center">
                      <p className="text-sm text-neutral-400">No image</p>
                    </div>
                  )}
                  <div className="p-6">
                    {post.category && (
                      <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                        {categoryLabels[post.category] || post.category}
                      </span>
                    )}
                    <h3 className="mt-2 text-lg font-bold text-neutral-900 group-hover:text-accent transition-colors">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-neutral-600 text-sm line-clamp-2">
                      {post.excerpt}
                    </p>
                    {post.publishedAt && (
                      <time className="block mt-3 text-xs text-neutral-500">
                        {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </time>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* Empty state — placeholder cards */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                "Getting Started with Your Online Coffee Shop",
                "5 Ways to Grow Your Wholesale Business",
                "Email Marketing for Coffee Roasters",
              ].map((title, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-neutral-200 overflow-hidden"
                >
                  <div className="aspect-[16/9] bg-neutral-100 flex items-center justify-center">
                    <p className="text-sm text-neutral-400">Coming Soon</p>
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                      {["How-To Guides", "Business Tips", "Industry Insights"][i]}
                    </span>
                    <h3 className="mt-2 text-lg font-bold text-neutral-900">
                      {title}
                    </h3>
                    <p className="mt-2 text-neutral-500 text-sm">
                      Article coming soon. Stay tuned for insights and tips.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
            >
              View all posts
              <ArrowRight size={20} weight="duotone" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          8. PARTNER PROGRAM
      ═══════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-neutral-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">
              {settings?.partnerSectionLabel ?? "Partner Programme"}
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
              {settings?.partnerSectionTitle ?? "More orders."}{" "}
              <span className="text-accent">No marketing.</span>
            </h2>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              {settings?.partnerSectionSubtitle ?? "We bring the brands and the orders. You bring the craft. Fill your roaster without spending a penny on advertising."}
            </p>
          </div>

          {/* How it works */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto mb-16">
            {resolvedPartnerSteps.map((item: { icon: typeof SealCheck; step: string; title: string; description: string }) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-accent" size={32} weight="duotone" />
                  </div>
                  <p className="text-xs font-bold text-accent tracking-wider mb-2">
                    STEP {item.step}
                  </p>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-neutral-400">{item.description}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Link
              href="/partner-program"
              className="inline-flex items-center px-8 py-4 border-2 border-accent bg-accent text-white font-semibold text-lg rounded-lg hover:bg-transparent hover:text-accent transition-colors"
            >
              Learn About the Partner Program
              <ArrowRight className="ml-2" size={24} weight="duotone" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
