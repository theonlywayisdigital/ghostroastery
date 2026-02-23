"use client";

import Link from "next/link";
import Image from "next/image";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";
import { urlFor } from "@/sanity/lib/client";

interface CaseStudySnippetProps {
  caseStudy: {
    brandName: string;
    slug: { current: string };
    summary: string;
    logo?: {
      asset: {
        _ref: string;
      };
    };
    images?: Array<{
      asset: {
        _ref: string;
      };
    }>;
  } | null;
}

export function CaseStudySnippet({ caseStudy }: CaseStudySnippetProps) {
  // If no case study exists yet, show a placeholder
  if (!caseStudy) {
    return (
      <Section dark>
        <FadeIn>
          <SectionHeader title="Built with Ghost Roasting UK" />
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-neutral-800/50 border border-neutral-700 rounded-2xl p-8 md:p-12">
              <p className="text-2xl md:text-3xl font-bold mb-4">
                Off Your Bean
              </p>
              <p className="text-neutral-400 mb-6">
                Our proof-of-concept brand, built entirely using our ghost roasting
                service. From concept to live store in under two weeks.
              </p>
              <p className="text-sm text-neutral-500 italic mb-8">
                &quot;This is what we can build for you.&quot;
              </p>
              <Link href="/brands/off-your-bean">
                <Button variant="outline">Read the full story</Button>
              </Link>
            </div>
          </div>
        </FadeIn>
      </Section>
    );
  }

  return (
    <Section dark>
      <FadeIn>
        <SectionHeader title="Built with Ghost Roasting UK" />
      </FadeIn>

      <FadeIn delay={0.2}>
        <div className="max-w-4xl mx-auto">
          <div className="bg-neutral-800/50 border border-neutral-700 rounded-2xl p-6 md:p-10">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Logo and Text */}
              <div>
                {caseStudy.logo && (
                  <div className="mb-6">
                    <Image
                      src={urlFor(caseStudy.logo).width(200).height(80).url()}
                      alt={caseStudy.brandName}
                      width={200}
                      height={80}
                      className="h-16 w-auto object-contain"
                    />
                  </div>
                )}
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  {caseStudy.brandName}
                </h3>
                <p className="text-neutral-400 mb-6">{caseStudy.summary}</p>
                <p className="text-sm text-neutral-500 italic mb-6">
                  &quot;This is what we can build for you.&quot;
                </p>
                <Link href={`/brands/${caseStudy.slug.current}`}>
                  <Button variant="outline">Read the full story</Button>
                </Link>
              </div>

              {/* Image */}
              {caseStudy.images && caseStudy.images[0] && (
                <div className="relative aspect-square rounded-xl overflow-hidden bg-neutral-700">
                  <Image
                    src={urlFor(caseStudy.images[0]).width(500).height(500).url()}
                    alt={`${caseStudy.brandName} product`}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </FadeIn>
    </Section>
  );
}
