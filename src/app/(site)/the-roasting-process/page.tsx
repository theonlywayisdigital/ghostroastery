import { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";
import { Thermometer, Timer, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { client } from "@/sanity/lib/client";
import { customerRoastingProcessPageQuery } from "@/sanity/lib/queries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "The Roasting Process | Ghost Roastery",
  description:
    "From green bean to perfect roast. Learn how our partner roasters craft specialty coffee for your brand.",
  openGraph: {
    title: "The Roasting Process | Ghost Roastery",
    description:
      "From green bean to perfect roast.",
    url: "https://ghostroastery.com/the-roasting-process",
  },
};

const stages = [
  {
    icon: Thermometer,
    title: "Green Bean Selection",
    description:
      "We source specialty-grade green beans from ethical farms and cooperatives. Every lot is cupped and graded before it enters our supply chain.",
  },
  {
    icon: Timer,
    title: "Small Batch Roasting",
    description:
      "Our roasters profile each bean to bring out its best characteristics. Roasted in small batches weekly to ensure peak freshness.",
  },
  {
    icon: CheckCircle,
    title: "Quality Control & Packing",
    description:
      "Every batch is quality checked before packing. Your branded bags are filled, sealed, and prepared for dispatch with care.",
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, React.ComponentType<any>> = { Thermometer, Timer, CheckCircle };

export default async function TheRoastingProcessPage() {
  const cms = await client.fetch(customerRoastingProcessPageQuery).catch(() => null);

  const resolvedStages = cms?.stages?.length ? cms.stages : stages;

  return (
    <>
      <Section className="pt-24 md:pt-32 pb-16 md:pb-20">
        <FadeIn>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">
              {cms?.heroHeadline ?? "From green bean to"}{" "}
              <span className="text-accent">{cms?.heroSubheadline ?? "perfect roast."}</span>
            </h1>
            <p className="text-xl md:text-2xl text-neutral-300">
              Specialty coffee is a craft. Here&apos;s how our partner roasters
              turn raw beans into something exceptional.
            </p>
          </div>
        </FadeIn>
      </Section>

      <Section dark>
        <FadeIn>
          <SectionHeader title={cms?.stagesTitle ?? "The journey"} />
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {resolvedStages.map((item: { icon?: string | React.ComponentType<any>; title: string; description: string }, index: number) => {
            const Icon = typeof item.icon === "string"
              ? iconMap[item.icon] || Thermometer
              : item.icon || Thermometer;
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
              {cms?.ctaTitle ?? "Ready to start?"}
            </h2>
            <p className="text-neutral-400 mb-6">
              {cms?.ctaDescription ?? "Your brand, our roasting expertise. Build your coffee brand in minutes."}
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
