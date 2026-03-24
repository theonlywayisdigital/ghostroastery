import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowRight, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { client, urlFor } from "@/sanity/lib/client";
import { roasterFeatureDetailBySlugQuery, allRoasterFeatureDetailSlugsQuery } from "@/sanity/lib/queries";

export const revalidate = 3600;

const PLATFORM_URL = "https://app.roasteryplatform.com";

const suiteLabelMap: Record<string, string> = {
  sales: "Sales Suite",
  marketing: "Marketing Suite",
};

interface FeatureDetail {
  featureTitle: string;
  featureIcon?: string;
  slug: string;
  suite: string;
  heroDescription: string;
  includedNote?: string;
  benefits: string[];
  benefitsTitle?: string;
  screenshot?: { asset: { _ref: string }; alt?: string };
  ctaHeadline?: string;
  ctaDescription?: string;
  ctaButtonText?: string;
  comingSoon?: boolean;
}

export async function generateStaticParams() {
  const slugs = await client
    .fetch<{ slug: string }[]>(allRoasterFeatureDetailSlugsQuery)
    .catch(() => []);
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const detail = await client
    .fetch<FeatureDetail>(roasterFeatureDetailBySlugQuery, { slug })
    .catch(() => null);

  if (!detail) return { title: "Feature" };

  return {
    title: detail.featureTitle,
    description: detail.heroDescription,
  };
}

export default async function FeatureDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const detail = await client
    .fetch<FeatureDetail>(roasterFeatureDetailBySlugQuery, { slug })
    .catch(() => null);

  if (!detail) notFound();

  const suiteLabel = suiteLabelMap[detail.suite] || detail.suite;

  return (
    <>
      {/* Hero */}
      <section className="py-20 lg:py-28 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-4">
            {suiteLabel}
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-neutral-900 mb-6">
            {detail.featureTitle}
          </h1>
          <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto mb-3">
            {detail.heroDescription}
          </p>
          {!detail.comingSoon && (
            <p className="text-sm font-medium text-accent">
              {detail.includedNote || "Included free on every plan"}
            </p>
          )}
          {detail.comingSoon && (
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-accent bg-accent/10 px-3 py-1 rounded-full">
              Coming Soon
            </span>
          )}
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-12 text-center">
            {detail.benefitsTitle || "What you get"}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Benefits list */}
            {detail.benefits && detail.benefits.length > 0 && (
              <div className="space-y-3">
                {detail.benefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3 p-3">
                    <CheckCircle
                      size={24}
                      weight="duotone"
                      className="text-accent flex-shrink-0 mt-0.5"
                    />
                    <span className="text-neutral-700">{benefit}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Screenshot */}
            {detail.screenshot ? (
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-lg">
                <Image
                  src={urlFor(detail.screenshot).width(800).height(600).url()}
                  alt={detail.screenshot.alt || `${detail.featureTitle} screenshot`}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200">
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-sm text-neutral-400 font-medium">
                    Screenshot coming soon
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-neutral-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-6">
            {detail.ctaHeadline || `Try ${detail.featureTitle}`}
          </h2>
          <p className="text-lg text-neutral-300 max-w-xl mx-auto mb-10">
            {detail.ctaDescription ||
              "Create your account and start exploring. No credit card required."}
          </p>
          <a
            href={PLATFORM_URL}
            className="inline-flex items-center px-8 py-4 border-2 border-accent bg-accent text-white font-semibold text-lg rounded-lg hover:bg-transparent hover:text-accent transition-colors"
          >
            {detail.ctaButtonText || "Get Started Free"}
            <ArrowRight size={24} weight="duotone" className="ml-2" />
          </a>
        </div>
      </section>
    </>
  );
}
