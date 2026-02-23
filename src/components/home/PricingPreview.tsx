"use client";

import Link from "next/link";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { PricingTable } from "@/components/ui/PricingTable";
import { Button } from "@/components/ui/Button";

interface PricingTier {
  bagSize: string;
  tier_25_49: number;
  tier_50_99: number;
  tier_100_150: number;
}

interface PricingPreviewProps {
  tiers: PricingTier[];
}

export function PricingPreview({ tiers }: PricingPreviewProps) {
  // Sort tiers by bag size
  const sortedTiers = [...tiers].sort((a, b) => {
    const order = ["250g", "500g", "1kg"];
    return order.indexOf(a.bagSize) - order.indexOf(b.bagSize);
  });

  return (
    <Section>
      <FadeIn>
        <SectionHeader
          title="Transparent pricing. No surprises."
          subtitle="Prices include roasting, packing and labelling. Shipping calculated at checkout."
        />
      </FadeIn>

      <FadeIn delay={0.2}>
        <div className="max-w-4xl mx-auto">
          <div className="bg-neutral-800/50 border border-neutral-700 rounded-2xl p-4 md:p-8">
            <PricingTable tiers={sortedTiers} />
          </div>

          <div className="text-center mt-8">
            <p className="text-neutral-400 mb-6">
              Orders above 150 bags? Check out our{" "}
              <Link href="/wholesale" className="text-accent hover:underline">
                wholesale pricing
              </Link>
              .
            </p>
            <Link href="/build">
              <Button variant="primary" size="lg">
                Start Your Order
              </Button>
            </Link>
          </div>
        </div>
      </FadeIn>
    </Section>
  );
}
