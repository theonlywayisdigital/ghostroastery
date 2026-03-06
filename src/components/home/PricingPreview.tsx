"use client";

import Link from "next/link";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { PricingTable } from "@/components/ui/PricingTable";
import { Button } from "@/components/ui/Button";
import type { PricingData } from "@/lib/pricing";

interface PricingPreviewProps {
  pricingData: PricingData;
  sectionTitle?: string;
  sectionSubtitle?: string;
  footnote?: string;
  ctaText?: string;
}

export function PricingPreview({
  pricingData,
  sectionTitle,
  sectionSubtitle,
  footnote,
  ctaText,
}: PricingPreviewProps) {
  return (
    <Section>
      <FadeIn>
        <SectionHeader
          title={sectionTitle ?? "Transparent pricing. No surprises."}
          subtitle={
            sectionSubtitle ??
            "Prices include roasting, packing and labelling. Shipping calculated at checkout."
          }
        />
      </FadeIn>

      <FadeIn delay={0.2}>
        <div className="max-w-4xl mx-auto">
          <div className="bg-neutral-800/50 border border-neutral-700 rounded-2xl p-4 md:p-8">
            <PricingTable pricingData={pricingData} />
          </div>

          <div className="text-center mt-8">
            <p className="text-neutral-400 mb-6">
              {footnote ? (
                footnote
              ) : (
                <>
                  Need 100+ bags? Check out our{" "}
                  <Link href="/wholesale" className="text-accent hover:underline">
                    wholesale pricing
                  </Link>
                  .
                </>
              )}
            </p>
            <Link href="/build">
              <Button variant="primary" size="lg">
                {ctaText ?? "Start Your Order"}
              </Button>
            </Link>
          </div>
        </div>
      </FadeIn>
    </Section>
  );
}
