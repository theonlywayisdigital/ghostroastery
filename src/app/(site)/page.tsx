import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { customerHomePageQuery } from "@/sanity/lib/queries";
import { createServerClient } from "@/lib/supabase";
import type { PricingData } from "@/lib/pricing";
import {
  Hero,
  HowItWorks,
  ProductPaths,
  PricingPreview,
  CaseStudySnippet,
  TrustSignals,
  FinalCTA,
} from "@/components/home";

export const revalidate = 3600; // ISR: revalidate every hour

export const metadata: Metadata = {
  title: "Ghost Roastery | Branded Coffee Roasting Service UK",
  description:
    "Your brand. Our roasters. Nobody needs to know. UK-based ghost roasting and branded coffee service. Launch your coffee brand from 25 bags.",
  openGraph: {
    title: "Ghost Roastery | Branded Coffee Roasting Service UK",
    description:
      "Your brand. Our roasters. Nobody needs to know. UK-based ghost roasting and branded coffee service.",
    url: "https://ghostroastery.com",
    type: "website",
  },
};

// JSON-LD Organization schema
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Ghost Roastery",
  url: "https://ghostroastery.com",
  logo: "https://ghostroastery.com/logo.png",
  description:
    "UK-based ghost roasting and branded coffee service. Launch your coffee brand from 25 bags with specialty grade coffee.",
  address: {
    "@type": "PostalAddress",
    addressCountry: "GB",
  },
  sameAs: [],
};

async function getPricingData(): Promise<PricingData> {
  try {
    const supabase = createServerClient();
    const [bracketsResult, pricesResult, settingsResult] = await Promise.all([
      supabase
        .from("pricing_tier_brackets")
        .select("id, min_quantity, max_quantity, sort_order")
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("pricing_tier_prices")
        .select("id, bracket_id, bag_size, price_per_bag, shipping_cost, currency")
        .eq("is_active", true),
      supabase
        .from("builder_settings")
        .select("max_order_quantity")
        .limit(1)
        .single(),
    ]);

    if (bracketsResult.error || !bracketsResult.data?.length) {
      throw new Error(bracketsResult.error?.message || "No brackets found");
    }

    const brackets = bracketsResult.data.map((b) => ({
      id: b.id,
      min: b.min_quantity,
      max: b.max_quantity,
      sortOrder: b.sort_order,
    }));

    const prices = (pricesResult.data || []).map((p) => ({
      id: p.id,
      bracketId: p.bracket_id,
      bagSize: p.bag_size,
      pricePerBag: Number(p.price_per_bag),
      shippingCost: Number(p.shipping_cost),
      currency: p.currency,
    }));

    const minOrder = Math.min(...brackets.map((b) => b.min));
    const maxOrder = settingsResult.data?.max_order_quantity ?? 99;

    return { brackets, prices, minOrder, maxOrder };
  } catch {
    // Return fallback data if Supabase unreachable
    const fallbackBrackets = [
      { id: "fb-1", min: 25, max: 49, sortOrder: 1 },
      { id: "fb-2", min: 50, max: 74, sortOrder: 2 },
      { id: "fb-3", min: 75, max: 99, sortOrder: 3 },
    ];
    const fallbackPrices = [
      { id: "fp-1", bracketId: "fb-1", bagSize: "250g", pricePerBag: 8.5, shippingCost: 0, currency: "GBP" },
      { id: "fp-2", bracketId: "fb-2", bagSize: "250g", pricePerBag: 7.5, shippingCost: 0, currency: "GBP" },
      { id: "fp-3", bracketId: "fb-3", bagSize: "250g", pricePerBag: 6.5, shippingCost: 0, currency: "GBP" },
      { id: "fp-4", bracketId: "fb-1", bagSize: "500g", pricePerBag: 13.0, shippingCost: 0, currency: "GBP" },
      { id: "fp-5", bracketId: "fb-2", bagSize: "500g", pricePerBag: 11.5, shippingCost: 0, currency: "GBP" },
      { id: "fp-6", bracketId: "fb-3", bagSize: "500g", pricePerBag: 10.0, shippingCost: 0, currency: "GBP" },
    ];
    return { brackets: fallbackBrackets, prices: fallbackPrices, minOrder: 25, maxOrder: 99 };
  }
}

async function getCaseStudy() {
  try {
    const caseStudy = await client.fetch(
      `*[_type == "caseStudy" && brandName == "Off Your Bean" && !isPlaceholder][0] {
        brandName,
        slug,
        summary,
        logo,
        images
      }`
    );
    return caseStudy;
  } catch {
    return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getHomePageContent(): Promise<any> {
  try {
    return await client.fetch(customerHomePageQuery);
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const [pricingData, caseStudy, cms] = await Promise.all([
    getPricingData(),
    getCaseStudy(),
    getHomePageContent(),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero
        headline={cms?.heroHeadline}
        subheadline={cms?.heroSubheadline}
        primaryCta={cms?.heroPrimaryCta}
        primaryCtaHref={cms?.heroPrimaryCtaHref}
        secondaryCta={cms?.heroSecondaryCta}
        secondaryCtaHref={cms?.heroSecondaryCtaHref}
      />
      <HowItWorks
        title={cms?.howItWorksTitle}
        steps={cms?.howItWorksSteps}
      />
      <ProductPaths
        title={cms?.productPathsTitle}
        paths={cms?.productPaths}
      />
      <PricingPreview
        pricingData={pricingData}
        sectionTitle={cms?.pricingSectionTitle}
        sectionSubtitle={cms?.pricingSectionSubtitle}
        footnote={cms?.pricingSectionFootnote}
        ctaText={cms?.pricingSectionCta}
      />
      <CaseStudySnippet
        caseStudy={caseStudy}
        sectionTitle={cms?.caseStudySectionTitle}
      />
      <TrustSignals signals={cms?.trustSignals} />
      <FinalCTA
        headline={cms?.finalCtaHeadline}
        primaryCta={cms?.finalCtaPrimaryCta}
        primaryHref={cms?.finalCtaPrimaryHref}
        secondaryCta={cms?.finalCtaSecondaryCta}
        secondaryHref={cms?.finalCtaSecondaryHref}
      />
    </>
  );
}
