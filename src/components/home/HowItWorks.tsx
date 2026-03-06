"use client";

import { Section, SectionHeader } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { Palette, Tag, Fire, Truck, type Icon } from "@phosphor-icons/react";

interface Step {
  number: string;
  icon?: string;
  title: string;
  description: string;
}

interface HowItWorksProps {
  title?: string;
  steps?: Step[];
}

const defaultSteps: Step[] = [
  { number: "01", icon: "Palette", title: "Design", description: "Choose your bag, colour and size" },
  { number: "02", icon: "Tag", title: "Brand", description: "Upload your label or use our Label Maker" },
  { number: "03", icon: "Fire", title: "Roast", description: "We roast fresh to your flavour profile" },
  { number: "04", icon: "Truck", title: "Deliver", description: "Packed and shipped to your door" },
];

const iconMap: Record<string, Icon> = {
  Palette, Tag, Fire, Truck,
};

export function HowItWorks({ title, steps }: HowItWorksProps) {
  const resolvedSteps = steps?.length ? steps : defaultSteps;

  return (
    <Section className="border-t border-neutral-800">
      <FadeIn>
        <SectionHeader title={title ?? "From idea to shelf in four steps"} />
      </FadeIn>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {resolvedSteps.map((step, index) => {
          const Icon = iconMap[step.icon || ""] || Palette;
          return (
            <FadeIn key={step.number} delay={index * 0.1}>
              <div className="text-center group">
                <div className="text-6xl font-black text-neutral-800 group-hover:text-neutral-700 transition-colors mb-4">
                  {step.number}
                </div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent/20 transition-colors">
                  <Icon weight="duotone" size={40} />
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-neutral-400">{step.description}</p>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </Section>
  );
}
