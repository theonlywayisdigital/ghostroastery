import { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";
import { TileCard } from "@/components/ui/Card";
import { ProductPathCard } from "@/components/ui/Card";
import { Accordion } from "@/components/ui/Accordion";
import {
  PaintBrush,
  Coffee,
  Package,
  Truck,
  Tag,
  CheckCircle,
  Palette,
  ShieldCheck,
  Storefront,
  Building,
  Barbell,
  Desktop,
  CalendarBlank,
  Heart,
  ForkKnife,
  Handshake,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "White Label Coffee UK — Your Brand, Our Roasters | Ghost Roastery",
  description:
    "White label coffee service for businesses and entrepreneurs. Design your label, choose your roast, we roast and deliver. From 25 bags. No minimums for branded coffee.",
  openGraph: {
    title: "White Label Coffee UK — Your Brand, Our Roasters | Ghost Roastery",
    description:
      "White label coffee service for UK businesses. Design your label, pick your roast, and launch your own coffee brand. From 25 bags.",
    url: "https://ghostroastery.com/white-label-coffee",
  },
};

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "White Label Coffee",
  description:
    "White label coffee service — specialty grade, small batch roasted in the UK. Design your label, pick your roast, and receive your own branded coffee bags in 7–10 working days.",
  brand: {
    "@type": "Organization",
    name: "Ghost Roastery",
    url: "https://ghostroastery.com",
  },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "GBP",
    lowPrice: "6.50",
    highPrice: "13.00",
    offerCount: "6",
    availability: "https://schema.org/InStock",
  },
};

const faqs = [
  {
    question: "What is white label coffee?",
    answer:
      "White label coffee is coffee that's roasted and packed by one company, then sold under another company's brand. You design the label, choose the roast, and sell it as your own — the roaster stays invisible. It's the fastest way to launch a coffee brand without owning a roastery.",
  },
  {
    question: "What's the difference between white label and private label coffee?",
    answer:
      "They're often used interchangeably, but there's a subtle difference. White label coffee uses a standard product (same beans, same roast) with your label on it. Private label coffee is fully customised — you choose the origin, roast profile, and blend. Ghost Roastery offers both: our self-service builder uses curated roast profiles (white label), while our wholesale service offers full customisation (private label).",
  },
  {
    question: "Do I need to order in bulk?",
    answer:
      "No. Our self-service branded coffee starts at just 25 bags — no contracts, no subscriptions. For larger volumes (150+ bags), our wholesale service offers better per-bag pricing and dedicated account management.",
  },
  {
    question: "Will anyone know you made it?",
    answer:
      "No — that's the whole point. Your brand, our roasters. There's no Ghost Roastery branding anywhere on your bags. As far as your customers are concerned, it's your coffee.",
  },
  {
    question: "How do I design my label?",
    answer:
      "Use our free online label maker to design your bag in minutes — add your logo, pick your colours, write your brand story. No design experience needed. You can also upload your own artwork if you already have a design.",
  },
  {
    question: "What's the minimum order?",
    answer:
      "25 bags for our self-service branded coffee, or 150 bags for wholesale. No ongoing commitments either way — order when you need to.",
  },
  {
    question: "What coffee quality do you use?",
    answer:
      "All our coffee is specialty grade, scoring 80+ on the SCA scale. Ethically sourced from farms and cooperatives around the world, roasted weekly in small batches by our UK-based roasting partners.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "7–10 working days from order confirmation. Your coffee is roasted fresh, packed with your label, and shipped with tracked delivery across the UK.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

const steps = [
  {
    icon: PaintBrush,
    step: "01",
    title: "Design Your Label",
    description:
      "Use our free label maker to design your bag — or upload your own artwork. Your brand, your look.",
  },
  {
    icon: Coffee,
    step: "02",
    title: "Pick Your Roast",
    description:
      "Choose from our specialty-grade single origins and blends. Every bean scores 80+ on the SCA scale.",
  },
  {
    icon: Package,
    step: "03",
    title: "We Roast & Pack",
    description:
      "Your coffee is roasted in small batches, packed with your label, and quality checked before dispatch.",
  },
  {
    icon: Truck,
    step: "04",
    title: "Delivered to Your Door",
    description:
      "Shipped directly to you or your customers. From order to delivery in 7–10 working days.",
  },
];

const differentiators = [
  {
    icon: Coffee,
    title: "Specialty Grade Beans",
    description: "SCA 80+ scored, ethically sourced from farms worldwide",
  },
  {
    icon: ShieldCheck,
    title: "UK-Based Roasters",
    description: "Small batch roasted by our network of trusted UK roasting partners",
  },
  {
    icon: Package,
    title: "From 25 Bags",
    description: "No bulk minimums for self-service — start small, scale when ready",
  },
  {
    icon: Tag,
    title: "No Contracts",
    description: "Order when you need to. No subscriptions, no lock-ins",
  },
  {
    icon: Palette,
    title: "Free Label Maker",
    description: "Design your bag label online in minutes — no design skills needed",
  },
  {
    icon: Truck,
    title: "7–10 Day Delivery",
    description: "Roasted fresh, tracked shipping across the UK",
  },
];

const segments = [
  {
    icon: Barbell,
    title: "Gyms & Fitness",
    href: "/branded-coffee/for-gyms",
  },
  {
    icon: CalendarBlank,
    title: "Events",
    href: "/branded-coffee/for-events",
  },
  {
    icon: Heart,
    title: "Weddings",
    href: "/branded-coffee/for-weddings",
  },
  {
    icon: Handshake,
    title: "Client Gifting",
    href: "/branded-coffee/for-client-gifting",
  },
  {
    icon: Storefront,
    title: "Cafes",
    href: "/wholesale/for-cafes",
  },
  {
    icon: Building,
    title: "Hotels",
    href: "/wholesale/for-hotels",
  },
  {
    icon: ForkKnife,
    title: "Restaurants",
    href: "/wholesale/for-restaurants",
  },
  {
    icon: Desktop,
    title: "Offices",
    href: "/wholesale/for-offices",
  },
];

export default function WhiteLabelCoffeePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
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
              White label coffee,{" "}
              <span className="text-accent">done differently.</span>
            </h1>
            <p className="text-xl md:text-2xl text-neutral-300 mb-4">
              Your brand. Our roasters.
            </p>
            <p className="text-lg text-neutral-400 mb-8 max-w-2xl">
              Launch your own white label coffee brand without the roastery.
              Design your label online, pick your roast, and we handle the rest
              — roasting, packing, and delivery across the UK. From just 25
              bags.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/build">
                <Button variant="primary" size="lg">
                  Build Your Brand
                </Button>
              </Link>
              <Link href="/wholesale/sign-up">
                <Button variant="outline" size="lg">
                  Wholesale (150+ bags)
                  <ArrowRight weight="bold" size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* What is white label coffee? */}
      <Section dark>
        <FadeIn>
          <SectionHeader title="What is white label coffee?" />
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="max-w-3xl mx-auto space-y-6">
            <p className="text-lg text-neutral-300 leading-relaxed">
              White label coffee is coffee that&apos;s roasted and packed by a
              specialist roaster, then sold under your brand name. You control
              the branding — the label, the story, the customer experience — while
              a roasting partner handles production behind the scenes.
            </p>
            <p className="text-lg text-neutral-300 leading-relaxed">
              It&apos;s how gyms, cafes, event planners, hospitality brands, and
              entrepreneurs launch their own coffee lines without investing in
              equipment, sourcing beans, or learning to roast. You get specialty
              grade coffee with your name on the bag, delivered to your door.
            </p>
            <p className="text-lg text-neutral-300 leading-relaxed">
              Ghost Roastery connects you with trusted UK roasting partners.
              We handle the coordination — from label printing to quality control
              to fulfilment — so you can focus on selling. No minimum experience
              needed. No long-term contracts. Just your brand on a bag of
              exceptional coffee.
            </p>
          </div>
        </FadeIn>
      </Section>

      {/* How it works */}
      <Section id="how-it-works">
        <FadeIn>
          <SectionHeader
            title="How white label coffee works"
            subtitle="Four simple steps from idea to branded coffee bags at your door."
          />
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <FadeIn key={item.title} delay={index * 0.1}>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                    <Icon weight="duotone" size={40} />
                  </div>
                  <p className="text-xs font-bold text-accent uppercase tracking-wider mb-2">
                    Step {item.step}
                  </p>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-neutral-400">{item.description}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </Section>

      {/* Two paths */}
      <Section dark>
        <FadeIn>
          <SectionHeader
            title="Two ways to white label"
            subtitle="Whether you need 25 bags or 2,500 — there's a path that fits."
          />
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <FadeIn delay={0.1}>
            <ProductPathCard
              title="Branded Coffee"
              description="Self-service. Design your label online, pick your roast, and order from 25 bags. Perfect for entrepreneurs, small businesses, and events."
              features={[
                "From 25 bags — no bulk minimums",
                "Free online label maker",
                "Order and pay online",
                "7–10 day turnaround",
                "No contracts or commitments",
                "250g, 500g, and 1kg bags",
              ]}
              ctaText="Start Building"
              ctaHref="/build"
              variant="primary"
            />
          </FadeIn>
          <FadeIn delay={0.2}>
            <ProductPathCard
              title="Wholesale"
              description="Managed service. Custom roast profiles, dedicated account management, and flexible delivery schedules. For businesses ordering 150+ bags."
              features={[
                "From 150 bags per order",
                "Custom roast profiles",
                "Dedicated account manager",
                "Recurring delivery schedules",
                "Volume pricing",
                "Sample roasts before committing",
              ]}
              ctaText="Request Access"
              ctaHref="/wholesale/sign-up"
              variant="secondary"
            />
          </FadeIn>
        </div>
      </Section>

      {/* Who it's for */}
      <Section>
        <FadeIn>
          <SectionHeader
            title="White label coffee for every sector"
            subtitle="From fitness studios to five-star hotels — businesses across the UK are launching their own coffee brands."
          />
        </FadeIn>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
          {segments.map((segment, index) => {
            const Icon = segment.icon;
            return (
              <FadeIn key={segment.title} delay={index * 0.05}>
                <Link href={segment.href} className="block group">
                  <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-5 md:p-6 text-center transition-all duration-300 hover:border-accent/50 hover:bg-neutral-800">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                      <Icon size={28} weight="duotone" />
                    </div>
                    <h3 className="text-base font-bold group-hover:text-accent transition-colors">
                      {segment.title}
                    </h3>
                  </div>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </Section>

      {/* Why Ghost Roastery */}
      <Section dark>
        <FadeIn>
          <SectionHeader title="Why Ghost Roastery for white label coffee" />
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {differentiators.map((feature, index) => {
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

      {/* FAQ */}
      <Section>
        <FadeIn>
          <SectionHeader title="White label coffee — frequently asked questions" />
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="max-w-3xl mx-auto">
            <Accordion items={faqs} />
          </div>
        </FadeIn>
      </Section>

      {/* Final CTA */}
      <Section dark className="py-20 md:py-32">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4">
              Ready to launch your coffee brand?
            </h2>
            <p className="text-lg text-neutral-300 mb-8 max-w-xl mx-auto">
              Your label. Our roasters. Specialty grade white label coffee,
              delivered in 7–10 days. No contracts, no commitments.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/build">
                <Button variant="primary" size="lg">
                  Build Your Brand
                </Button>
              </Link>
              <Link href="/wholesale/sign-up">
                <Button variant="outline" size="lg">
                  Request Wholesale Access
                  <ArrowRight weight="bold" size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </FadeIn>
      </Section>
    </>
  );
}
