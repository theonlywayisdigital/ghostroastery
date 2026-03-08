import { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";
import {
  Coffee,
  Leaf,
  Trophy,
  Thermometer,
  Timer,
  CheckCircle,
  Fire,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Our Coffee — Specialty Grade, Ethically Sourced | Ghost Roastery",
  description:
    "Every bag of Ghost Roastery coffee is specialty grade, ethically sourced, and small batch roasted in the UK. Learn about our beans, sourcing, and roasting process.",
  openGraph: {
    title: "Our Coffee — Specialty Grade, Ethically Sourced | Ghost Roastery",
    description:
      "Specialty grade, ethically sourced, small batch roasted in the UK.",
    url: "https://ghostroastery.com/our-coffee",
  },
};

const highlights = [
  {
    icon: Trophy,
    title: "Specialty Grade",
    description:
      "Every bean scores 80+ on the SCA scale. No commodity coffee, no compromises. Only the top 3% of the world's coffee makes the cut.",
  },
  {
    icon: Leaf,
    title: "Ethically Sourced",
    description:
      "Sourced from farms and cooperatives that prioritise fair wages, sustainable farming, and long-term relationships with growers.",
  },
  {
    icon: Coffee,
    title: "Small Batch Roasted",
    description:
      "Roasted weekly in small batches for maximum freshness and flavour consistency. Never mass-produced, never sitting in a warehouse.",
  },
];

const roastingStages = [
  {
    icon: Thermometer,
    step: "01",
    title: "Green Bean Selection",
    description:
      "We source specialty-grade green beans from ethical farms and cooperatives. Every lot is cupped and graded before it enters our supply chain — only beans scoring 80+ on the SCA scale are accepted.",
  },
  {
    icon: Fire,
    step: "02",
    title: "Roast Profiling",
    description:
      "Our roasters profile each bean to bring out its best characteristics. Light, medium, or dark — each profile is developed to match the origin and intended flavour notes.",
  },
  {
    icon: Timer,
    step: "03",
    title: "Small Batch Roasting",
    description:
      "Coffee is roasted in small batches weekly to ensure peak freshness. No bulk roasting, no months-old stock. Every bag is roasted to order.",
  },
  {
    icon: CheckCircle,
    step: "04",
    title: "Quality Control & Packing",
    description:
      "Every batch is cupped, checked, and graded before packing. Your branded bags are filled, sealed with a freshness valve, and prepared for dispatch.",
  },
];

export default async function OurCoffeePage() {
  return (
    <>
      {/* Hero */}
      <Section className="pt-24 md:pt-32 pb-16 md:pb-20">
        <FadeIn>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">
              Specialty coffee,{" "}
              <span className="text-accent">every time.</span>
            </h1>
            <p className="text-xl md:text-2xl text-neutral-300">
              We only work with specialty-grade beans. Ethically sourced, small
              batch roasted, and packed fresh — whether it&apos;s for your brand
              or ours.
            </p>
          </div>
        </FadeIn>
      </Section>

      {/* What Specialty Grade Means */}
      <Section dark>
        <FadeIn>
          <SectionHeader title="What makes our coffee different" />
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <FadeIn key={item.title} delay={index * 0.1}>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                    <Icon weight="duotone" size={40} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-neutral-400">{item.description}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </Section>

      {/* Sourcing */}
      <Section>
        <FadeIn>
          <div className="max-w-3xl mx-auto">
            <SectionHeader
              title="Where our beans come from"
              align="left"
            />
            <div className="space-y-6 text-lg text-neutral-300">
              <p>
                We work with trusted importers and cooperatives across Central
                and South America, East Africa, and Southeast Asia. Every lot is
                selected for quality, traceability, and ethical production.
              </p>
              <p>
                Our beans are specialty grade — scoring 80 or above on the
                Specialty Coffee Association scale. That puts them in the top 3%
                of all coffee produced worldwide. We don&apos;t touch commodity
                coffee.
              </p>
              <p>
                Traceability matters. We know where every bean comes from, how
                it was grown, and who grew it. That transparency is part of what
                makes Ghost Roastery different.
              </p>
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* The Roasting Process */}
      <Section dark>
        <FadeIn>
          <SectionHeader
            title="From green bean to perfect roast"
            subtitle="Specialty coffee is a craft. Here's how we turn raw beans into something exceptional."
          />
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {roastingStages.map((stage, index) => {
            const Icon = stage.icon;
            return (
              <FadeIn key={stage.title} delay={index * 0.1}>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                    <Icon weight="duotone" size={40} />
                  </div>
                  <p className="text-xs font-bold text-accent uppercase tracking-wider mb-2">
                    Stage {stage.step}
                  </p>
                  <h3 className="text-xl font-bold mb-3">{stage.title}</h3>
                  <p className="text-neutral-400">{stage.description}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </Section>

      {/* Small Batch */}
      <Section>
        <FadeIn>
          <div className="max-w-3xl mx-auto">
            <SectionHeader title="Why small batch matters" align="left" />
            <div className="space-y-6 text-lg text-neutral-300">
              <p>
                Mass-produced coffee sits in warehouses for months. Flavour
                fades, oils go stale, and what reaches the customer is a shadow
                of what it could be. We do the opposite.
              </p>
              <p>
                Every batch is roasted to order, packed within days, and
                dispatched while it&apos;s still at peak freshness. That means
                the coffee your customers open is as close to the roast date as
                possible.
              </p>
              <p>
                Small batch also means better quality control. Every roast is
                cupped and checked. If it doesn&apos;t meet our standards, it
                doesn&apos;t leave the roastery.
              </p>
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* Dual CTA */}
      <Section dark className="py-20 md:py-32">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4">
              Put your name on it
            </h2>
            <p className="text-lg text-neutral-300 mb-8 max-w-xl mx-auto">
              Our coffee is ready for your brand. Design your label and we
              handle the rest — or get in touch about wholesale supply.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/how-it-works">
                <Button variant="primary" size="lg">
                  Branded Coffee
                  <ArrowRight weight="bold" size={16} className="ml-2" />
                </Button>
              </Link>
              <Link href="/wholesale">
                <Button variant="outline" size="lg">
                  Request Wholesale Access
                </Button>
              </Link>
            </div>
          </div>
        </FadeIn>
      </Section>
    </>
  );
}
