import { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { StorefrontEmbed } from "./StorefrontEmbed";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse and buy specialty coffee from Ghost Roastery. Freshly roasted, ethically sourced, delivered to your door.",
  openGraph: {
    title: "Shop | Ghost Roastery",
    description:
      "Browse and buy specialty coffee from Ghost Roastery. Freshly roasted, ethically sourced, delivered to your door.",
    url: "https://ghostroastery.com/shop",
  },
};

export default function ShopPage() {
  return (
    <>
      {/* Hero */}
      <Section className="pt-24 md:pt-32 pb-12 md:pb-16">
        <FadeIn>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">
              The <span className="text-accent">Shop</span>
            </h1>
            <p className="text-xl md:text-2xl text-neutral-300">
              Freshly roasted specialty coffee, delivered straight to your door.
            </p>
          </div>
        </FadeIn>
      </Section>

      {/* Storefront Embed */}
      <section className="pb-16 md:pb-24 lg:pb-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <StorefrontEmbed roaster="ghostroastery" type="shop" baseUrl="http://localhost:3001" />
        </div>
      </section>
    </>
  );
}
