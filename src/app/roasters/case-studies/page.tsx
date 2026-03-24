import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { client, urlFor } from "@/sanity/lib/client";
import { roasterCaseStudiesQuery } from "@/sanity/lib/queries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Case Studies — Roaster Success Stories",
  description:
    "Real roasteries, real results. See how coffee roasters use Ghost Roastery Platform to sell more coffee with less overhead.",
};

interface CaseStudy {
  _id: string;
  brandName: string;
  slug: { current: string };
  summary: string;
  logo?: {
    asset: { _ref: string };
  };
  liveURL?: string;
  isPlaceholder?: boolean;
}

export default async function RoastersCaseStudiesPage() {
  const caseStudies = await client
    .fetch<CaseStudy[]>(roasterCaseStudiesQuery)
    .catch(() => []);

  const liveCaseStudies = caseStudies.filter((cs) => !cs.isPlaceholder);
  const placeholders = caseStudies.filter((cs) => cs.isPlaceholder);

  return (
    <>
      {/* Hero */}
      <section className="py-20 lg:py-28 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-neutral-900 mb-6">
            Roaster <span className="text-accent">Success Stories</span>
          </h1>
          <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto">
            See how roasters and brands are growing with Ghost Roastery
            Platform.
          </p>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {liveCaseStudies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {liveCaseStudies.map((cs) => (
                <Link
                  key={cs._id}
                  href={`/case-studies/${cs.slug.current}`}
                  className="group bg-white rounded-xl border border-neutral-200 p-8 hover:shadow-lg transition-shadow flex flex-col"
                >
                  {cs.logo && (
                    <div className="h-16 mb-6 flex items-center">
                      <Image
                        src={urlFor(cs.logo).height(64).url()}
                        alt={cs.brandName}
                        width={160}
                        height={64}
                        className="h-12 w-auto object-contain"
                      />
                    </div>
                  )}
                  <h2 className="text-xl font-bold text-neutral-900 group-hover:text-accent transition-colors">
                    {cs.brandName}
                  </h2>
                  <p className="mt-2 text-neutral-600 text-sm flex-1">
                    {cs.summary}
                  </p>
                  <div className="mt-4 flex items-center text-accent font-semibold text-sm">
                    Read story
                    <ArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" size={20} weight="duotone" />
                  </div>
                </Link>
              ))}

              {/* Placeholder slots */}
              {placeholders.map((cs) => (
                <div
                  key={cs._id}
                  className="bg-neutral-100 rounded-xl border border-neutral-200 border-dashed p-8 flex flex-col items-center justify-center text-center"
                >
                  <p className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">
                    Coming Soon
                  </p>
                  <p className="mt-2 text-neutral-500">{cs.brandName}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-lg text-neutral-500">
                Case studies coming soon. Check back later!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-neutral-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-6">
            Write your own success story
          </h2>
          <p className="text-lg text-neutral-300 max-w-xl mx-auto mb-10">
            Join the platform and start growing your roastery today.
          </p>
          <a
            href="https://app.roasteryplatform.com"
            className="inline-flex items-center px-8 py-4 border-2 border-accent bg-accent text-white font-semibold text-lg rounded-lg hover:bg-transparent hover:text-accent transition-colors"
          >
            Get Started Free
            <ArrowRight className="ml-2" size={24} weight="duotone" />
          </a>
        </div>
      </section>
    </>
  );
}
