import { createClient } from "@sanity/client";
import { config } from "dotenv";

// Load .env.local
config({ path: ".env.local" });

const client = createClient({
  projectId: "z97yvgto",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

console.log("Using project:", "z97yvgto");
console.log("Token loaded:", process.env.SANITY_API_TOKEN ? "Yes" : "No");

async function seed() {
  console.log("Seeding Sanity...");

  // Seed pricing tiers
  console.log("Creating pricing tiers...");
  const pricingTiers = [
    {
      _type: "pricingTiers",
      bagSize: "250g",
      tier_10_24: 9.5,
      tier_25_49: 8.5,
      tier_50_99: 7.5,
      tier_100_150: 6.5,
      shippingCost: 0,
    },
    {
      _type: "pricingTiers",
      bagSize: "500g",
      tier_10_24: 14.5,
      tier_25_49: 13,
      tier_50_99: 11.5,
      tier_100_150: 10,
      shippingCost: 0,
    },
  ];

  for (const tier of pricingTiers) {
    await client.create(tier);
    console.log(`  Created ${tier.bagSize} pricing tier`);
  }

  // Seed wholesale FAQs
  console.log("Creating FAQs...");
  const faqs = [
    {
      _type: "faq",
      question: "What is the minimum order for wholesale?",
      answer: "Our wholesale service starts at 100+ bags per order.",
      category: "wholesale",
      order: 1,
    },
    {
      _type: "faq",
      question: "Can I have my own brand name on the bags?",
      answer:
        "Yes — we offer fully branded packaging as part of our wholesale service.",
      category: "wholesale",
      order: 2,
    },
    {
      _type: "faq",
      question: "How long does a wholesale order take?",
      answer:
        "Typical turnaround is 7–10 working days from order confirmation.",
      category: "wholesale",
      order: 3,
    },
    {
      _type: "faq",
      question: "Do you offer recurring delivery schedules?",
      answer:
        "Yes — we can set up regular roasting and delivery schedules to suit your needs.",
      category: "wholesale",
      order: 4,
    },
  ];

  for (const faq of faqs) {
    await client.create(faq);
    console.log(`  Created FAQ: "${faq.question.substring(0, 30)}..."`);
  }

  // Seed Off Your Bean case study
  console.log("Creating Off Your Bean case study...");
  await client.create({
    _type: "caseStudy",
    brandName: "Off Your Bean",
    slug: { _type: "slug", current: "off-your-bean" },
    summary:
      "Our proof-of-concept brand, built entirely using our ghost roasting service. From concept to live store in under two weeks.",
    isPlaceholder: false,
    seoTitle: "Off Your Bean Case Study | Ghost Roastery",
    seoDescription:
      "See how we built Off Your Bean using our own ghost roasting service - from concept to live store in under two weeks.",
  });
  console.log("  Created Off Your Bean case study");

  // Seed placeholder case studies
  console.log("Creating placeholder case studies...");
  await client.create({
    _type: "caseStudy",
    brandName: "Your Brand Here",
    slug: { _type: "slug", current: "placeholder-1" },
    summary: "Your coffee brand could be next. Start building today.",
    isPlaceholder: true,
  });
  await client.create({
    _type: "caseStudy",
    brandName: "Coming Soon",
    slug: { _type: "slug", current: "placeholder-2" },
    summary: "Another success story in the making.",
    isPlaceholder: true,
  });
  console.log("  Created placeholder case studies");

  // Seed site settings
  console.log("Creating site settings...");
  await client.create({
    _type: "siteSettings",
    tagline: "Your brand. Our roastery. Nobody needs to know.",
    defaultSeoTitle: "Ghost Roastery | White Label Coffee Roasting",
    defaultSeoDescription:
      "UK-based ghost roasting and white label coffee service. Launch your coffee brand with zero barriers.",
    contactEmail: "hello@ghostroastery.com",
    adminEmail: "admin@ghostroastery.com",
    roasteryEmail: "roastery@ghostroastery.com",
    accentColour: "amber",
  });
  console.log("  Created site settings");

  console.log("\nSanity seeding complete!");
}

seed().catch(console.error);
