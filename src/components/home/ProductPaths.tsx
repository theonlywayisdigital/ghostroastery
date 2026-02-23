"use client";

import { Section, SectionHeader } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { ProductPathCard } from "@/components/ui/Card";

export function ProductPaths() {
  return (
    <Section dark>
      <FadeIn>
        <SectionHeader title="Two ways to work with us" />
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <FadeIn delay={0.1}>
          <ProductPathCard
            title="Bespoke Branded Bags"
            description="For businesses and entrepreneurs who want their own branded coffee"
            features={[
              "Minimum order: 25 bags",
              "Sizes: 250g, 500g, 1kg",
              "Your label, your brand",
              "Fresh roasted weekly",
            ]}
            ctaText="Build Your Brand"
            ctaHref="/build"
            variant="primary"
          />
        </FadeIn>

        <FadeIn delay={0.2}>
          <ProductPathCard
            title="Wholesale"
            description="For cafes, offices, restaurants wanting bulk supply"
            features={[
              "Orders: 150+ bags",
              "Custom roast profiles",
              "Flexible delivery schedules",
              "Branded or unbranded options",
            ]}
            ctaText="Wholesale Enquiry"
            ctaHref="/wholesale"
            variant="secondary"
          />
        </FadeIn>
      </div>
    </Section>
  );
}
