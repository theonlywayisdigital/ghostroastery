import { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";
import { PaintBrush, Package, Truck } from "@phosphor-icons/react/dist/ssr";
import { client } from "@/sanity/lib/client";
import { customerHowItWorksPageQuery } from "@/sanity/lib/queries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "How It Works | Ghost Roastery",
  description:
    "Three simple steps to launch your own branded coffee. Choose your coffee, design your label, and we handle the rest.",
  openGraph: {
    title: "How It Works | Ghost Roastery",
    description:
      "Three simple steps to launch your own branded coffee.",
    url: "https://ghostroastery.com/how-it-works",
  },
};

const steps = [
  {
    icon: PaintBrush,
    step: "01",
    title: "Design Your Brand",
    description:
      "Choose your coffee blend, create your label using our design tool, and tell us about your brand. We'll guide you through every decision.",
  },
  {
    icon: Package,
    step: "02",
    title: "We Roast & Pack",
    description:
      "Our partner roastery roasts your chosen blend in small batches, packs it in your branded bags, and quality checks every order.",
  },
  {
    icon: Truck,
    step: "03",
    title: "Delivered to You",
    description:
      "Your branded coffee is dispatched directly to you or your customers. From order to delivery in 7-10 working days.",
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, React.ComponentType<any>> = { PaintBrush, Package, Truck };

export default async function HowItWorksPage() {
  const cms = await client.fetch(customerHowItWorksPageQuery).catch(() => null);

  const resolvedSteps = cms?.steps?.length ? cms.steps : steps;

  return (
    <>
      <Section className="pt-24 md:pt-32 pb-16 md:pb-20">
        <FadeIn>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">
              {cms?.heroHeadline ?? "Three steps to"}{" "}
              <span className="text-accent">{cms?.heroSubheadline ?? "your own coffee brand."}</span>
            </h1>
            <p className="text-xl md:text-2xl text-neutral-300">
              No roastery needed. No minimum experience. Just your brand on a
              bag of specialty coffee.
            </p>
          </div>
        </FadeIn>
      </Section>

      <Section dark>
        <FadeIn>
          <SectionHeader title={cms?.stepsTitle ?? "The process"} />
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {resolvedSteps.map((item: { icon?: string | React.ComponentType<any>; step?: string; title: string; description: string }, index: number) => {
            const Icon = typeof item.icon === "string"
              ? iconMap[item.icon] || PaintBrush
              : item.icon || PaintBrush;
            const stepNumber = item.step || String(index + 1).padStart(2, "0");
            return (
              <FadeIn key={item.title} delay={index * 0.1}>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                    <Icon weight="duotone" size={40} />
                  </div>
                  <p className="text-xs font-bold text-accent uppercase tracking-wider mb-2">
                    Step {stepNumber}
                  </p>
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
              {cms?.ctaTitle ?? "Ready to get started?"}
            </h2>
            <p className="text-neutral-400 mb-6">
              {cms?.ctaDescription ?? "Build your brand in minutes and receive your first order in 7-10 working days."}
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
