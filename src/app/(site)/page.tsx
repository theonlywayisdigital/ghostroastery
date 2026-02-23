import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { pricingTiersQuery } from "@/sanity/lib/queries";
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
  title: "Ghost Roasting UK | White Label Coffee Roasting",
  description:
    "Your brand. Our roastery. Nobody needs to know. UK-based ghost roasting and white label coffee service. Launch your coffee brand from 25 bags.",
  openGraph: {
    title: "Ghost Roasting UK | White Label Coffee Roasting",
    description:
      "Your brand. Our roastery. Nobody needs to know. UK-based ghost roasting and white label coffee service.",
    url: "https://ghostroasting.co.uk",
    type: "website",
  },
};

// JSON-LD Organization schema
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Ghost Roasting UK",
  url: "https://ghostroasting.co.uk",
  logo: "https://ghostroasting.co.uk/logo.png",
  description:
    "UK-based ghost roasting and white label coffee service. Launch your coffee brand with zero barriers.",
  address: {
    "@type": "PostalAddress",
    addressCountry: "GB",
  },
  sameAs: [],
};

async function getPricingTiers() {
  try {
    const tiers = await client.fetch(pricingTiersQuery);
    return tiers;
  } catch {
    // Return placeholder data if Sanity fetch fails
    return [
      { bagSize: "250g", tier_25_49: 8.5, tier_50_99: 7.5, tier_100_150: 6.5 },
      { bagSize: "500g", tier_25_49: 13.0, tier_50_99: 11.5, tier_100_150: 10.0 },
      { bagSize: "1kg", tier_25_49: 20.0, tier_50_99: 18.0, tier_100_150: 16.0 },
    ];
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

export default async function HomePage() {
  const [pricingTiers, caseStudy] = await Promise.all([
    getPricingTiers(),
    getCaseStudy(),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <HowItWorks />
      <ProductPaths />
      <PricingPreview tiers={pricingTiers} />
      <CaseStudySnippet caseStudy={caseStudy} />
      <TrustSignals />
      <FinalCTA />
    </>
  );
}
