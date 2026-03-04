import { Metadata } from "next";
import { Boxes, ArrowRight, CheckCircle2 } from "lucide-react";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Product Management",
  description:
    "Manage your coffee catalogue, blends, sizes, and pricing. Upload images, set variants, and keep your inventory organised.",
};

const PLATFORM_URL = "https://platform.ghostroastery.com";

const benefits = [
  "Add unlimited coffee products, blends, and merchandise",
  "Set multiple sizes, grind options, and variants per product",
  "Upload high-quality product imagery and tasting notes",
  "Organise products by category, origin, or roast level",
  "Set pricing per channel — storefront, wholesale, and subscription",
  "Track stock levels and get low-inventory alerts",
];

export default function ProductManagementPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 lg:py-28 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-4">
            Sales Suite
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-neutral-900 mb-6">
            Product Management
          </h1>
          <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto mb-3">
            Manage your entire coffee catalogue from one dashboard. Add
            products, set sizes and variants, upload imagery, and organise your
            inventory — so your storefront and wholesale channels always have the
            right products on display.
          </p>
          <p className="text-sm font-medium text-accent">
            Included free on every plan
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-10 text-center">
            What you get
          </h2>
          {/* Screenshot placeholder */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 mb-12">
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-sm text-neutral-400 font-medium">
                Screenshot coming soon
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-3 p-4">
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-neutral-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-6">
            Start selling coffee online today
          </h2>
          <p className="text-lg text-neutral-300 max-w-xl mx-auto mb-10">
            Create your account and explore the platform. No credit card
            required.
          </p>
          <a
            href={PLATFORM_URL}
            className="inline-flex items-center px-8 py-4 bg-accent text-white font-semibold text-lg rounded-lg hover:bg-accent-hover transition-colors"
          >
            Get Started Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </a>
        </div>
      </section>
    </>
  );
}
