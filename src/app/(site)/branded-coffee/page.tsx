import { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";
import { TileCard } from "@/components/ui/Card";
import { Accordion } from "@/components/ui/Accordion";
import { PricingPreview } from "@/components/home/PricingPreview";
import { createServerClient } from "@/lib/supabase";
import type { PricingData } from "@/lib/pricing";
import {
  PaintBrush,
  Coffee,
  Package,
  Truck,
  Palette,
  CheckCircle,
  Tag,
  Storefront,
  Building,
  Barbell,
  Desktop,
  CalendarBlank,
  Heart,
  Lightbulb,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Branded Coffee Bags — Create Your Own Coffee Brand | Ghost Roastery",
  description:
    "Launch your own branded coffee in 7–10 days. Design your label, choose your roast, and we handle everything else. Specialty grade, small batch, from 25 bags.",
  openGraph: {
    title:
      "Branded Coffee Bags — Create Your Own Coffee Brand | Ghost Roastery",
    description:
      "Launch your own branded coffee in 7–10 days. Design your label, choose your roast, and we handle everything else.",
    url: "https://ghostroastery.com/branded-coffee",
  },
};

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Branded Coffee Bags",
  description:
    "Custom branded coffee bags — specialty grade, small batch roasted in the UK. Design your label, pick your roast, and receive your branded coffee in 7–10 working days.",
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

const steps = [
  {
    icon: PaintBrush,
    step: "01",
    title: "Design Your Label",
    description:
      "Use our label maker to design your bag or upload your own artwork. Your brand, your look — we just make it happen.",
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
      "Your coffee is roasted in small batches, packed in food-safe bags with your label, and quality checked before dispatch.",
  },
  {
    icon: Truck,
    step: "04",
    title: "Delivered to Your Door",
    description:
      "Shipped directly to you or your customers. From order to delivery in 7–10 working days. Tracked throughout.",
  },
];

const whatYouGet = [
  {
    icon: Tag,
    title: "Your Brand on Every Bag",
    description: "Custom labels — designed by you or with our label maker",
  },
  {
    icon: Coffee,
    title: "Specialty Grade Coffee",
    description: "SCA 80+ beans, ethically sourced and freshly roasted",
  },
  {
    icon: Package,
    title: "Food-Safe Packaging",
    description: "Resealable, valve-fitted bags in 250g, 500g, or 1kg",
  },
  {
    icon: Palette,
    title: "Free Label Design Tool",
    description: "Design your bag label online — no design skills needed",
  },
  {
    icon: CheckCircle,
    title: "Quality Guaranteed",
    description: "Every batch cupped and checked before dispatch",
  },
  {
    icon: Truck,
    title: "UK-Wide Delivery",
    description: "Tracked shipping across the UK, from 25 bags",
  },
];

const whoItsFor = [
  {
    icon: Storefront,
    title: "Cafes & Coffee Shops",
    description: "Your own house blend, your own brand on the shelf",
  },
  {
    icon: Building,
    title: "Hotels & Hospitality",
    description: "Branded in-room coffee that elevates the guest experience",
  },
  {
    icon: Barbell,
    title: "Gyms & Fitness Brands",
    description: "Add a high-margin revenue stream your members will love",
  },
  {
    icon: Desktop,
    title: "Offices & Corporates",
    description: "Quality coffee under your company name for staff and clients",
  },
  {
    icon: CalendarBlank,
    title: "Weddings & Events",
    description: "Personalised coffee favours your guests will actually keep",
  },
  {
    icon: Heart,
    title: "Wellness Brands",
    description: "Ethically sourced, specialty grade — aligned with your values",
  },
  {
    icon: Lightbulb,
    title: "Entrepreneurs",
    description: "The lowest-barrier product business you can start today",
  },
];

const faqs = [
  {
    question: "What's the minimum order?",
    answer:
      "25 bags. No contracts, no subscriptions — just order when you need to.",
  },
  {
    question: "Can I use my own label design?",
    answer:
      "Yes. Upload your own artwork or use our free label maker to design one from scratch. We'll print and apply it for you.",
  },
  {
    question: "What coffee do you use?",
    answer:
      "Specialty-grade beans scoring 80+ on the SCA scale. Ethically sourced from farms and cooperatives around the world, roasted weekly in small batches in the UK.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "7–10 working days from order confirmation. Your coffee is roasted fresh, packed, and shipped with tracked delivery across the UK.",
  },
  {
    question: "What bag sizes are available?",
    answer:
      "250g, 500g, and 1kg bags. All food-safe, resealable, and fitted with a freshness valve.",
  },
  {
    question: "Do I need to buy in bulk?",
    answer:
      "No. Our branded coffee service starts at just 25 bags. For orders of 100+ bags, check out our wholesale pricing for better rates.",
  },
  {
    question: "Will anyone know you roasted it?",
    answer:
      "No. That's the whole point. Your brand, our roastery — nobody needs to know. There's no Ghost Roastery branding on your bags.",
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
        .select(
          "id, bracket_id, bag_size, price_per_bag, shipping_cost, currency"
        )
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

export default async function BrandedCoffeePage() {
  const pricingData = await getPricingData();

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
              Your brand on the bag.{" "}
              <span className="text-accent">Our roastery behind it.</span>
            </h1>
            <p className="text-xl md:text-2xl text-neutral-300 mb-8">
              Design your label, choose your roast, and receive your own branded
              coffee in 7–10 working days. From 25 bags. No contracts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/build">
                <Button variant="primary" size="lg">
                  Build Your Brand
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

      {/* How It Works */}
      <Section dark id="how-it-works">
        <FadeIn>
          <SectionHeader
            title="Four steps to your own coffee brand"
            subtitle="No roastery needed. No minimum experience. Just your brand on a bag of specialty coffee."
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

      {/* What You Get */}
      <Section>
        <FadeIn>
          <SectionHeader title="Everything you need to launch" />
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {whatYouGet.map((feature, index) => {
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

      {/* Pricing */}
      <PricingPreview
        pricingData={pricingData}
        sectionTitle="Transparent pricing. No surprises."
        sectionSubtitle="Prices include roasting, packing and labelling. Shipping calculated at checkout."
        footnote="Need 100+ bags? Check out our wholesale pricing."
        ctaText="Start Your Order"
      />

      {/* Label Maker Preview */}
      <Section dark>
        <FadeIn>
          <div className="max-w-3xl mx-auto text-center">
            <SectionHeader
              title="Design your label in minutes"
              subtitle="Use our free online label maker to create your bag design — or upload your own artwork. No design experience needed."
            />
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/label-maker">
                <Button variant="primary" size="lg">
                  Open Label Maker
                </Button>
              </Link>
              <Link href="/brands">
                <Button variant="outline" size="lg">
                  See Example Brands
                </Button>
              </Link>
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* Who It's For */}
      <Section>
        <FadeIn>
          <SectionHeader title="Built for businesses like yours" />
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {whoItsFor.map((item, index) => {
            const Icon = item.icon;
            return (
              <FadeIn key={item.title} delay={index * 0.1}>
                <TileCard
                  icon={<Icon size={28} weight="duotone" />}
                  title={item.title}
                  description={item.description}
                />
              </FadeIn>
            );
          })}
        </div>
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

      {/* Final CTA */}
      <Section className="py-20 md:py-32">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4">
              Your coffee brand starts here
            </h2>
            <p className="text-lg text-neutral-300 mb-8 max-w-xl mx-auto">
              25 bags. 7–10 days. Specialty grade. Your label.
              No contracts, no commitments — just great coffee with your name on it.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/build">
                <Button variant="primary" size="lg">
                  Build Your Brand
                </Button>
              </Link>
              <Link href="/wholesale">
                <Button variant="outline" size="lg">
                  Wholesale Enquiry
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
