"use client";

import { Section, SectionHeader } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { Palette, Tag, Flame, Truck } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Palette,
    title: "Design",
    description: "Choose your bag, colour and size",
  },
  {
    number: "02",
    icon: Tag,
    title: "Brand",
    description: "Upload your label or use our Label Maker",
  },
  {
    number: "03",
    icon: Flame,
    title: "Roast",
    description: "We roast fresh to your flavour profile",
  },
  {
    number: "04",
    icon: Truck,
    title: "Deliver",
    description: "Packed and shipped to your door",
  },
];

export function HowItWorks() {
  return (
    <Section className="border-t border-neutral-800">
      <FadeIn>
        <SectionHeader title="From idea to shelf in four steps" />
      </FadeIn>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <FadeIn key={step.number} delay={index * 0.1}>
            <div className="text-center group">
              {/* Number */}
              <div className="text-6xl font-black text-neutral-800 group-hover:text-neutral-700 transition-colors mb-4">
                {step.number}
              </div>

              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent/20 transition-colors">
                <step.icon className="w-8 h-8" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-neutral-400">{step.description}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
