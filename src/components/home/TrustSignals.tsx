"use client";

import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { MapPin, Coffee, ShieldCheck, Clock, Truck } from "lucide-react";

const signals = [
  {
    icon: MapPin,
    label: "UK Based Roastery",
  },
  {
    icon: Coffee,
    label: "Specialty Grade Coffee",
  },
  {
    icon: ShieldCheck,
    label: "Food-Safe Packaging",
  },
  {
    icon: Clock,
    label: "Small Batch Weekly Roasts",
  },
  {
    icon: Truck,
    label: "Ships Across the UK",
  },
];

export function TrustSignals() {
  return (
    <Section className="py-12 md:py-16 border-t border-neutral-800">
      <FadeIn>
        <div className="flex flex-wrap justify-center gap-6 md:gap-12">
          {signals.map((signal, index) => (
            <div
              key={index}
              className="flex items-center gap-3 text-neutral-400"
            >
              <signal.icon className="w-5 h-5 text-accent flex-shrink-0" />
              <span className="text-sm font-medium whitespace-nowrap">
                {signal.label}
              </span>
            </div>
          ))}
        </div>
      </FadeIn>
    </Section>
  );
}
