import { Metadata } from "next";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { faqsByCategoryQuery } from "@/sanity/lib/queries";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";
import { TileCard } from "@/components/ui/Card";
import { Accordion } from "@/components/ui/Accordion";
import { WholesaleForm } from "@/components/wholesale";
import {
  Storefront,
  Building,
  Barbell,
  Desktop,
  CalendarBlank,
  Coffee,
  Package,
  Palette,
  Truck,
  ArrowsClockwise,
  ChatCircle,
  ShieldCheck,
  MapPin,
  Clock,
  CheckCircle,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";

export const revalidate = 3600;

export const metadata: Metadata = {
  title:
    "Wholesale Branded Coffee — White Label Coffee Supplier UK | Ghost Roastery",
  description:
    "Wholesale branded coffee for cafes, hotels, gyms, offices, and events. Specialty grade, custom roast profiles, flexible delivery across the UK. From 150 bags.",
  openGraph: {
    title:
      "Wholesale Branded Coffee — White Label Coffee Supplier UK | Ghost Roastery",
    description:
      "Wholesale branded coffee for cafes, hotels, gyms, offices, and events. Specialty grade, flexible delivery across the UK.",
    url: "https://ghostroastery.com/wholesale",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Ghost Roastery",
  description:
    "UK-based wholesale branded coffee supplier. Specialty grade, custom roast profiles, branded or unbranded packaging for businesses.",
  url: "https://ghostroastery.com/wholesale",
  address: {
    "@type": "PostalAddress",
    addressCountry: "GB",
  },
  areaServed: {
    "@type": "Country",
    name: "United Kingdom",
  },
  priceRange: "££",
};

const sectors = [
  {
    icon: Storefront,
    title: "Cafes & Coffee Shops",
    description: "Your own house blend, your own brand on the shelf",
    href: "/wholesale/for-cafes",
  },
  {
    icon: Building,
    title: "Hotels & Hospitality",
    description: "Branded in-room coffee that elevates the guest experience",
    href: "/wholesale/for-hotels",
  },
  {
    icon: Barbell,
    title: "Gyms & Fitness Brands",
    description: "A high-margin revenue stream your members will love",
    href: "/wholesale/for-gyms",
  },
  {
    icon: Desktop,
    title: "Offices & Corporates",
    description: "Quality coffee under your company name",
    href: "/wholesale/for-offices",
  },
  {
    icon: CalendarBlank,
    title: "Weddings & Events",
    description: "Personalised coffee favours your guests will keep",
    href: "/wholesale/for-events",
  },
];

const features = [
  {
    icon: Coffee,
    title: "Custom Roast Profile",
    description: "Matched to your brief — light, medium, or dark",
  },
  {
    icon: Package,
    title: "Choice of Bag Sizes",
    description: "250g, 500g, and 1kg options available",
  },
  {
    icon: Palette,
    title: "Branded or Unbranded",
    description: "Your label, our label, or plain packaging",
  },
  {
    icon: ArrowsClockwise,
    title: "Flexible Delivery",
    description: "Recurring schedules or one-off orders across the UK",
  },
  {
    icon: ChatCircle,
    title: "Dedicated Account Manager",
    description: "A single point of contact for your account",
  },
  {
    icon: ShieldCheck,
    title: "Quality Guaranteed",
    description: "Every batch cupped and checked before dispatch",
  },
];

const howItWorksSteps = [
  {
    step: "01",
    title: "Get in Touch",
    description:
      "Fill in our enquiry form or contact us directly. Tell us about your business, volume needs, and whether you want branded or unbranded coffee.",
  },
  {
    step: "02",
    title: "We Build Your Profile",
    description:
      "We'll recommend a roast profile, bean origin, and packaging format based on your brief. Sample roasts available on request.",
  },
  {
    step: "03",
    title: "Approve Your Sample",
    description:
      "We send you a sample batch to taste and approve. Adjustments are made until you're 100% happy.",
  },
  {
    step: "04",
    title: "Production & Packing",
    description:
      "Your coffee is roasted in small batches, packed in your chosen format, and quality checked before dispatch.",
  },
  {
    step: "05",
    title: "Delivery & Repeat",
    description:
      "Tracked delivery across the UK. Set up recurring orders or reorder when you need to. Flexible terms, no lock-in.",
  },
];

const trustSignals = [
  { icon: MapPin, label: "UK Based Roastery" },
  { icon: Coffee, label: "Specialty Grade Coffee" },
  { icon: ShieldCheck, label: "Food-Safe Packaging" },
  { icon: Clock, label: "Small Batch Weekly Roasts" },
  { icon: Truck, label: "Ships Across the UK" },
  { icon: CheckCircle, label: "Quality Checked Every Batch" },
];

const placeholderFaqs = [
  {
    question: "What is the minimum order for wholesale?",
    answer:
      "Our wholesale service starts at 150 bags per order. For smaller quantities (25–99 bags), check out our branded coffee service.",
  },
  {
    question: "Can I have my own brand name on the bags?",
    answer:
      "Yes — we offer fully branded packaging as part of our wholesale service. You can also order unbranded or with our own label.",
  },
  {
    question: "How long does a wholesale order take?",
    answer:
      "Typical turnaround is 7–10 working days from order confirmation. Recurring orders can be scheduled for faster fulfilment.",
  },
  {
    question: "Do you offer recurring delivery schedules?",
    answer:
      "Yes — we can set up weekly, fortnightly, or monthly roasting and delivery schedules to suit your needs.",
  },
  {
    question: "Can I get a sample before committing?",
    answer:
      "Absolutely. We offer sample roasts so you can taste and approve your blend before placing a full order.",
  },
  {
    question: "What roast profiles are available?",
    answer:
      "We offer light, medium, and dark roast profiles. We can also develop a custom profile tailored to your preferences.",
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

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq: { question: string; answer: string }) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <Section className="pt-24 md:pt-32 pb-16 md:pb-20">
        <FadeIn>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">
              Coffee at scale.{" "}
              <span className="text-accent">Your way.</span>
            </h1>
            <p className="text-xl md:text-2xl text-neutral-300 mb-8">
              Specialty grade wholesale coffee for businesses that need volume,
              consistency, and flexibility. Branded or unbranded. From 150 bags.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#enquiry">
                <Button variant="primary" size="lg">
                  Get a Wholesale Quote
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="outline" size="lg">
                  See How It Works
                </Button>
              </Link>
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* Who We Supply */}
      <Section dark>
        <FadeIn>
          <SectionHeader
            title="Who we supply"
            subtitle="We work with businesses across every sector. Pick yours to see how wholesale coffee works for you."
          />
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {sectors.map((sector, index) => {
            const Icon = sector.icon;
            return (
              <FadeIn key={sector.title} delay={index * 0.1}>
                <Link href={sector.href} className="block group">
                  <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-6 text-center transition-all duration-300 hover:border-accent/50 hover:bg-neutral-800">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                      <Icon size={28} weight="duotone" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 group-hover:text-accent transition-colors">
                      {sector.title}
                    </h3>
                    <p className="text-sm text-neutral-400 mb-3">
                      {sector.description}
                    </p>
                    <span className="inline-flex items-center text-sm text-accent font-medium">
                      Learn more
                      <ArrowRight weight="bold" size={14} className="ml-1" />
                    </span>
                  </div>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </Section>

      {/* What's Included */}
      <Section>
        <FadeIn>
          <SectionHeader title="What you get" />
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <FadeIn key={feature.title} delay={index * 0.1}>
                <TileCard
                  icon={<Icon size={28} weight="duotone" />}
                  title={feature.title}
                  description={feature.description}
                />
              </FadeIn>
            );
          })}
        </div>
      </Section>

      {/* How It Works */}
      <Section dark id="how-it-works">
        <FadeIn>
          <SectionHeader
            title="How wholesale works"
            subtitle="From first enquiry to recurring delivery in five simple steps."
          />
        </FadeIn>
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {howItWorksSteps.map((step, index) => (
              <FadeIn key={step.title} delay={index * 0.1}>
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-accent">
                      {step.step}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-neutral-400">{step.description}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </Section>

      {/* Design Services */}
      <Section>
        <FadeIn>
          <div className="max-w-3xl mx-auto text-center">
            <SectionHeader
              title="Need help with your label?"
              subtitle="Our free label maker lets you design your bag online. Or upload your own artwork — we'll print and apply it for you."
            />
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/label-maker">
                <Button variant="primary">Open Label Maker</Button>
              </Link>
              <Link href="/branded-coffee">
                <Button variant="outline">
                  Learn About Branded Coffee
                  <ArrowRight weight="bold" size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* FAQ */}
      <Section dark>
        <FadeIn>
          <SectionHeader title="Frequently asked questions" />
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="max-w-3xl mx-auto">
            <Accordion items={faqs} />
          </div>
        </FadeIn>
      </Section>

      {/* Enquiry Form */}
      <Section id="enquiry">
        <FadeIn>
          <SectionHeader
            title="Get a wholesale quote"
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

      {/* Trust Signals */}
      <Section className="py-12 md:py-16 border-t border-neutral-800">
        <FadeIn>
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            {trustSignals.map((signal, index) => {
              const Icon = signal.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 text-neutral-200"
                >
                  <Icon
                    weight="duotone"
                    size={24}
                    className="text-accent flex-shrink-0"
                  />
                  <span className="text-sm font-medium whitespace-nowrap">
                    {signal.label}
                  </span>
                </div>
              );
            })}
          </div>
        </FadeIn>
      </Section>
    </>
  );
}
