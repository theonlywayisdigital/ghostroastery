import { Metadata } from "next";
import { ShoppingBag, ArrowRight } from "lucide-react";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Marketplace",
  description:
    "Source green beans, packaging, equipment, and supplies for your roastery through the Ghost Roastery Marketplace.",
};

const PLATFORM_URL = "https://platform.ghostroastery.com";

export default function MarketplacePage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 lg:py-28 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-neutral-900 mb-6">
            Marketplace
          </h1>
          <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto">
            Source supplies for your roastery — from green beans and packaging to
            equipment and accessories — all in one place.
          </p>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 p-10 sm:p-14 text-center">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-8 h-8" />
              </div>

              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-neutral-200 text-neutral-600 mb-4">
                Coming Soon
              </span>

              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-4">
                The Marketplace is on its way
              </h2>

              <p className="text-neutral-500 max-w-md mx-auto mb-8">
                Source green beans, packaging, equipment, and supplies for your
                roastery — all in one place. The Marketplace is currently in
                development.
              </p>

              <a
                href={`${PLATFORM_URL}/signup`}
                className="inline-flex items-center px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent-hover transition-colors"
              >
                Get notified
                <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-neutral-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-6">
            Join the platform today
          </h2>
          <p className="text-lg text-neutral-300 max-w-xl mx-auto mb-10">
            Get started with Ghost Roastery and be the first to know when the
            Marketplace launches.
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
