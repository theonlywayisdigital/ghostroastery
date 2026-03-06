import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { roasterFaqsQuery, roasterPricingPageQuery } from "@/sanity/lib/queries";
import { PricingContent } from "./PricingContent";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing for coffee roasters. Start free, upgrade as you grow. No transaction fees on any paid plan.",
};

interface FAQ {
  _id: string;
  question: string;
  answer: string;
}

export default async function PricingPage() {
  const [faqs, cms] = await Promise.all([
    client.fetch<FAQ[]>(roasterFaqsQuery).catch(() => []),
    client.fetch(roasterPricingPageQuery).catch(() => null),
  ]);

  return <PricingContent faqs={faqs} cms={cms} />;
}
