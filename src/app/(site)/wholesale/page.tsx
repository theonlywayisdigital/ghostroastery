import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { faqsByCategoryQuery } from "@/sanity/lib/queries";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { TileCard } from "@/components/ui/Card";
import { Accordion } from "@/components/ui/Accordion";
import { WholesaleForm } from "@/components/wholesale";
import {
  Coffee,
  Dumbbell,
  Building2,
  UtensilsCrossed,
  Heart,
  Lightbulb,
  Package,
  Palette,
  Truck,
  RefreshCw,
} from "lucide-react";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Wholesale Coffee | Ghost Roasting UK",
  description:
    "Coffee at scale. Your way. For businesses that need volume, consistency and flexibility. 150+ bags per order. Branded or unbranded.",
  openGraph: {
    title: "Wholesale Coffee | Ghost Roasting UK",
    description:
      "Coffee at scale. Your way. For businesses that need volume, consistency and flexibility.",
    url: "https://ghostroasting.co.uk/wholesale",
  },
};

// JSON-LD Service schema
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Ghost Roasting UK Wholesale",
  description:
    "Wholesale coffee roasting service for businesses needing 150+ bags per order",
  provider: {
    "@type": "Organization",
    name: "Ghost Roasting UK",
    url: "https://ghostroasting.co.uk",
  },
  areaServed: {
    "@type": "Country",
    name: "United Kingdom",
  },
  serviceType: "White Label Coffee Roasting",
};

const businessTypes = [
  {
    icon: Coffee,
    title: "Cafes & Coffee Shops",
    description: "Your own blend, your own brand",
  },
  {
    icon: Dumbbell,
    title: "Gyms & Fitness Brands",
    description: "Add a revenue stream your members will love",
  },
  {
    icon: Building2,
    title: "Offices & Corporates",
    description: "Quality coffee under your company name",
  },
  {
    icon: UtensilsCrossed,
    title: "Restaurants & Hospitality",
    description: "The last thing your guests taste should be yours",
  },
  {
    icon: Heart,
    title: "Wellness Brands",
    description: "Ethically sourced, specialty grade, your label",
  },
  {
    icon: Lightbulb,
    title: "Entrepreneurs",
    description: "The lowest barrier product business you can start",
  },
];

const features = [
  {
    icon: Palette,
    title: "Custom roast profile",
    description: "Matched to your brief",
  },
  {
    icon: Package,
    title: "Choice of bag styles",
    description: "250g, 500g, 1kg options",
  },
  {
    icon: Coffee,
    title: "Branded or unbranded",
    description: "Your choice of packaging",
  },
  {
    icon: RefreshCw,
    title: "Flexible delivery",
    description: "Schedules across the UK",
  },
];

// Placeholder FAQs in case Sanity has none
const placeholderFaqs = [
  {
    question: "What is the minimum order for wholesale?",
    answer: "Our wholesale service starts at 150 bags per order.",
  },
  {
    question: "Can I have my own brand name on the bags?",
    answer:
      "Yes — we offer fully branded packaging as part of our wholesale service.",
  },
  {
    question: "How long does a wholesale order take?",
    answer:
      "Typical turnaround is 7–10 working days from order confirmation.",
  },
  {
    question: "Do you offer recurring delivery schedules?",
    answer:
      "Yes — we can set up regular roasting and delivery schedules to suit your needs.",
  },
];

async function getFaqs() {
  try {
    const faqs = await client.fetch(faqsByCategoryQuery, {
      category: "wholesale",
    });
    return faqs && faqs.length > 0 ? faqs : placeholderFaqs;
  } catch {
    return placeholderFaqs;
  }
}

export default async function WholesalePage() {
  const faqs = await getFaqs();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <Section className="pt-24 md:pt-32 pb-16 md:pb-20">
        <FadeIn>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">
              Coffee at scale.{" "}
              <span className="text-accent">Your way.</span>
            </h1>
            <p className="text-xl md:text-2xl text-neutral-300">
              For businesses that need volume, consistency and flexibility.
              150+ bags per order. Branded or unbranded.
            </p>
          </div>
        </FadeIn>
      </Section>

      {/* Who It's For */}
      <Section dark>
        <FadeIn>
          <SectionHeader title="Who we work with" />
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {businessTypes.map((type, index) => (
            <FadeIn key={type.title} delay={index * 0.1}>
              <TileCard
                icon={<type.icon className="w-6 h-6" />}
                title={type.title}
                description={type.description}
              />
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* What's Included */}
      <Section>
        <FadeIn>
          <SectionHeader title="What you get" />
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FadeIn key={feature.title} delay={index * 0.1}>
              <div className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold mb-1">{feature.title}</h3>
                <p className="text-neutral-400 text-sm">{feature.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* Enquiry Form */}
      <Section dark>
        <FadeIn>
          <SectionHeader
            title="Tell us about your order"
            subtitle="Fill in the form below and we'll get back to you within 2 business days."
          />
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="max-w-2xl mx-auto">
            <div className="bg-neutral-800/50 border border-neutral-700 rounded-2xl p-6 md:p-8">
              <WholesaleForm />
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* FAQ */}
      <Section>
        <FadeIn>
          <SectionHeader title="Frequently asked questions" />
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="max-w-3xl mx-auto">
            <Accordion items={faqs} />
          </div>
        </FadeIn>
      </Section>
    </>
  );
}
