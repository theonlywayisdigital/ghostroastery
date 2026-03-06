"use client";

import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { MapPin, Coffee, ShieldCheck, Clock, Truck, type Icon } from "@phosphor-icons/react";

interface Signal {
  icon?: string;
  label: string;
}

interface TrustSignalsProps {
  signals?: Signal[];
}

const defaultSignals: Signal[] = [
  { icon: "MapPin", label: "UK Based Roastery" },
  { icon: "Coffee", label: "Specialty Grade Coffee" },
  { icon: "ShieldCheck", label: "Food-Safe Packaging" },
  { icon: "Clock", label: "Small Batch Weekly Roasts" },
  { icon: "Truck", label: "Ships Across the UK" },
];

const iconMap: Record<string, Icon> = {
  MapPin, Coffee, ShieldCheck, Clock, Truck,
};

export function TrustSignals({ signals }: TrustSignalsProps) {
  const resolved = signals?.length ? signals : defaultSignals;

  return (
    <Section className="py-12 md:py-16 border-t border-neutral-800">
      <FadeIn>
        <div className="flex flex-wrap justify-center gap-6 md:gap-12">
          {resolved.map((signal, index) => {
            const Icon = iconMap[signal.icon || ""] || Coffee;
            return (
              <div
                key={index}
                className="flex items-center gap-3 text-neutral-200"
              >
                <Icon weight="duotone" size={24} className="text-accent flex-shrink-0" />
                <span className="text-sm font-medium whitespace-nowrap">
                  {signal.label}
                </span>
              </div>
            );
          })}
        </div>
      </FadeIn>
    </Section>
  );
}
