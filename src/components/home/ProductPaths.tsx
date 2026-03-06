"use client";

import { Section, SectionHeader } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { ProductPathCard } from "@/components/ui/Card";

interface ProductPath {
  title: string;
  description: string;
  features?: string[];
  ctaText?: string;
  ctaHref?: string;
  variant?: "primary" | "secondary";
}

interface ProductPathsProps {
  title?: string;
  paths?: ProductPath[];
}

const defaultPaths: ProductPath[] = [
  {
    title: "Bespoke Branded Bags",
    description: "For businesses and entrepreneurs who want their own branded coffee",
    features: ["Minimum order: 25 bags", "Sizes: 250g, 500g, 1kg", "Your label, your brand", "Fresh roasted weekly"],
    ctaText: "Build Your Brand",
    ctaHref: "/build",
    variant: "primary",
  },
  {
    title: "Wholesale",
    description: "For cafes, offices, restaurants wanting bulk supply",
    features: ["Orders: 150+ bags", "Custom roast profiles", "Flexible delivery schedules", "Branded or unbranded options"],
    ctaText: "Wholesale Enquiry",
    ctaHref: "/wholesale",
    variant: "secondary",
  },
];

export function ProductPaths({ title, paths }: ProductPathsProps) {
  const resolved = paths?.length ? paths : defaultPaths;

  return (
    <Section dark>
      <FadeIn>
        <SectionHeader title={title ?? "Two ways to work with us"} />
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {resolved.map((path, index) => (
          <FadeIn key={path.title} delay={(index + 1) * 0.1}>
            <ProductPathCard
              title={path.title}
              description={path.description}
              features={path.features || []}
              ctaText={path.ctaText || "Learn More"}
              ctaHref={path.ctaHref || "/build"}
              variant={path.variant || (index === 0 ? "primary" : "secondary")}
            />
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
