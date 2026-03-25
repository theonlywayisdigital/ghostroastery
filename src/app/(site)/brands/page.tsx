import { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";
import { client } from "@/sanity/lib/client";
import { customerBrandsPageQuery } from "@/sanity/lib/queries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Our Brands | Ghost Roastery",
  description:
    "Discover the coffee brands built with Ghost Roastery. Real brands, real customers, all ghost roasted.",
  openGraph: {
    title: "Our Brands | Ghost Roastery",
    description:
      "Discover the coffee brands built with Ghost Roastery.",
    url: "https://ghostroastery.com/brands",
  },
};

export default async function BrandsPage() {
  const cms = await client.fetch(customerBrandsPageQuery).catch(() => null);

  return (
    <>
      <Section className="pt-24 md:pt-32 pb-16 md:pb-20">
        <FadeIn>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">
              {cms?.heroHeadline ?? "Brands built with"}{" "}
              <span className="text-accent">{cms?.heroSubheadline ?? "Ghost Roastery."}</span>
            </h1>
            <p className="text-xl md:text-2xl text-neutral-300">
              Real brands, real customers — all powered by our ghost roasting
              service. See what&apos;s possible.
            </p>
          </div>
        </FadeIn>
      </Section>

      <Section dark>
        <FadeIn>
          <SectionHeader title={cms?.placeholderTitle ?? "Our brand partners"} />
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-neutral-300 mb-8">
              {cms?.placeholderCopy ?? "We're currently onboarding our first wave of brand partners. Check back soon to see their stories, or start building your own brand today."}
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
