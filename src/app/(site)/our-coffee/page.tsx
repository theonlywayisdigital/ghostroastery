import { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";
import { Coffee, Leaf, Trophy } from "@phosphor-icons/react/dist/ssr";
import { client } from "@/sanity/lib/client";
import { customerOurCoffeePageQuery } from "@/sanity/lib/queries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Our Coffee | Ghost Roastery",
  description:
    "Specialty grade, ethically sourced, small batch roasted. Discover the coffee behind every Ghost Roastery brand.",
  openGraph: {
    title: "Our Coffee | Ghost Roastery",
    description:
      "Specialty grade, ethically sourced, small batch roasted.",
    url: "https://ghostroastery.com/our-coffee",
  },
};

const highlights = [
  {
    icon: Trophy,
    title: "Specialty Grade",
    description:
      "Every bean scores 80+ on the SCA scale. No commodity coffee, no compromises.",
  },
  {
    icon: Leaf,
    title: "Ethically Sourced",
    description:
      "Sourced from farms and cooperatives that prioritise fair wages and sustainable practices.",
  },
  {
    icon: Coffee,
    title: "Small Batch Roasted",
    description:
      "Roasted weekly in small batches for maximum freshness and flavour consistency.",
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, React.ComponentType<any>> = { Trophy, Leaf, Coffee };

export default async function OurCoffeePage() {
  const cms = await client.fetch(customerOurCoffeePageQuery).catch(() => null);

  const resolvedHighlights = cms?.highlights?.length ? cms.highlights : highlights;

  return (
    <>
      <Section className="pt-24 md:pt-32 pb-16 md:pb-20">
        <FadeIn>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">
              {cms?.heroHeadline ?? "Specialty coffee,"}{" "}
              <span className="text-accent">{cms?.heroSubheadline ?? "every time."}</span>
            </h1>
            <p className="text-xl md:text-2xl text-neutral-300">
              We only work with specialty-grade beans. Ethically sourced, small
              batch roasted, and packed fresh for your brand.
            </p>
          </div>
        </FadeIn>
      </Section>

      <Section dark>
        <FadeIn>
          <SectionHeader title={cms?.highlightsTitle ?? "What makes our coffee different"} />
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {resolvedHighlights.map((item: { icon?: string | React.ComponentType<any>; title: string; description: string }, index: number) => {
            const Icon = typeof item.icon === "string"
              ? iconMap[item.icon] || Trophy
              : item.icon || Trophy;
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

      <Section className="py-16 md:py-20">
        <FadeIn>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {cms?.ctaTitle ?? "Put your name on it"}
            </h2>
            <p className="text-neutral-400 mb-6">
              {cms?.ctaDescription ?? "Our coffee is ready for your brand. Design your label and we handle the rest."}
            </p>
            <Link href={cms?.ctaButtonHref ?? "/build"}>
              <Button variant="primary">{cms?.ctaButtonText ?? "Build Your Brand"}</Button>
            </Link>
          </div>
        </FadeIn>
      </Section>
    </>
  );
}
