import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import {
  faqsByCategoryQuery,
  customerWholesalePageQuery,
} from "@/sanity/lib/queries";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { TileCard } from "@/components/ui/Card";
import { Accordion } from "@/components/ui/Accordion";
import { WholesaleForm } from "@/components/wholesale";
import {
  Coffee,
  Barbell,
  Buildings,
  ForkKnife,
  Heart,
  Lightbulb,
  Package,
  Palette,
  Truck,
  ArrowsClockwise,
} from "@phosphor-icons/react/dist/ssr";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Wholesale Coffee | Ghost Roastery",
  description:
    "Coffee at scale. Your way. For businesses that need volume, consistency and flexibility. 150+ bags per order. Branded or unbranded.",
  openGraph: {
    title: "Wholesale Coffee | Ghost Roastery",
    description:
      "Coffee at scale. Your way. For businesses that need volume, consistency and flexibility.",
    url: "https://ghostroastery.com/wholesale",
  },
};

// JSON-LD Service schema
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Ghost Roastery Wholesale",
  description:
    "Wholesale coffee roasting service for businesses needing 150+ bags per order",
  provider: {
    "@type": "Organization",
    name: "Ghost Roastery",
    url: "https://ghostroastery.com",
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
    icon: Barbell,
    title: "Gyms & Fitness Brands",
    description: "Add a revenue stream your members will love",
  },
  {
    icon: Buildings,
    title: "Offices & Corporates",
    description: "Quality coffee under your company name",
  },
  {
    icon: ForkKnife,
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
    icon: ArrowsClockwise,
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const businessTypeIconMap: Record<string, React.ComponentType<any>> = {
  Coffee,
  Barbell,
  Buildings,
  ForkKnife,
  Heart,
  Lightbulb,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const featureIconMap: Record<string, React.ComponentType<any>> = {
  Palette,
  Package,
  Coffee,
  ArrowsClockwise,
  Truck,
};

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getWholesalePageContent(): Promise<any> {
  try {
    return await client.fetch(customerWholesalePageQuery);
  } catch {
    return null;
  }
}

export default async function WholesalePage() {
  const [faqs, cms] = await Promise.all([getFaqs(), getWholesalePageContent()]);

  const resolvedBusinessTypes = cms?.businessTypes?.length
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cms.businessTypes.map((bt: any) => ({
        ...bt,
        icon: businessTypeIconMap[bt.icon || ""] || Coffee,
      }))
    : businessTypes;

  const resolvedFeatures = cms?.features?.length
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cms.features.map((f: any) => ({
        ...f,
        icon: featureIconMap[f.icon || ""] || Coffee,
      }))
    : features;

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
              {cms?.heroHeadline ?? (
                <>
                  Coffee at scale.{" "}
                  <span className="text-accent">Your way.</span>
                </>
              )}
            </h1>
            <p className="text-xl md:text-2xl text-neutral-300">
              {cms?.heroSubheadline ??
                "For businesses that need volume, consistency and flexibility. 150+ bags per order. Branded or unbranded."}
            </p>
          </div>
        </FadeIn>
      </Section>

      {/* Who It's For */}
      <Section dark>
        <FadeIn>
          <SectionHeader title={cms?.businessTypesTitle ?? "Who we work with"} />
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resolvedBusinessTypes.map((type: typeof businessTypes[number], index: number) => {
            const Icon = type.icon;
            return (
              <FadeIn key={type.title} delay={index * 0.1}>
                <TileCard
                  icon={<Icon size={28} weight="duotone" />}
                  title={type.title}
                  description={type.description}
                />
              </FadeIn>
            );
          })}
        </div>
      </Section>

      {/* What's Included */}
      <Section>
        <FadeIn>
          <SectionHeader title={cms?.featuresTitle ?? "What you get"} />
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {resolvedFeatures.map((feature: typeof features[number], index: number) => {
            const Icon = feature.icon;
            return (
              <FadeIn key={feature.title} delay={index * 0.1}>
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                    <Icon size={32} weight="duotone" />
                  </div>
                  <h3 className="text-lg font-bold mb-1">{feature.title}</h3>
                  <p className="text-neutral-400 text-sm">{feature.description}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </Section>

      {/* Enquiry Form */}
      <Section dark>
        <FadeIn>
          <SectionHeader
            title={cms?.formTitle ?? "Tell us about your order"}
            subtitle={cms?.formSubtitle ?? "Fill in the form below and we'll get back to you within 2 business days."}
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
          <SectionHeader title={cms?.faqTitle ?? "Frequently asked questions"} />
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
