import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { customerLegalPageBySlugQuery } from "@/sanity/lib/queries";
import { PortableText, type PortableTextBlock } from "@portabletext/react";
import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Terms & Conditions | Ghost Roastery",
  description:
    "Terms of service for using the Ghost Roastery website and services.",
  openGraph: {
    title: "Terms & Conditions | Ghost Roastery",
    description:
      "Terms of service for using the Ghost Roastery website and services.",
    url: "https://roasteryplatform.com/terms",
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getTermsPageContent(): Promise<any> {
  try {
    return await client.fetch(customerLegalPageBySlugQuery, { slug: "terms" });
  } catch {
    return null;
  }
}

export default async function TermsPage() {
  const cms = await getTermsPageContent();

  return (
    <>
      <Section className="pt-24 md:pt-32 pb-16 md:pb-20">
        <FadeIn>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">
              {cms?.heroHeadline ?? (
                <>
                  Terms &{" "}
                  <span className="text-accent">Conditions.</span>
                </>
              )}
            </h1>
            <p className="text-xl md:text-2xl text-neutral-300">
              {cms?.heroSubheadline ??
                "The terms of service for using the Ghost Roastery website and services."}
            </p>
          </div>
        </FadeIn>
      </Section>

      <Section dark>
        <FadeIn>
          <div className="max-w-3xl mx-auto prose prose-invert prose-neutral">
            {cms?.body ? (
              <PortableText value={cms.body as PortableTextBlock[]} />
            ) : (
              <p className="text-neutral-300">
                Our terms and conditions are being prepared and will be published
                shortly. If you have any questions about our terms of service in
                the meantime, please contact us.
              </p>
            )}
            <p className="text-neutral-400 text-sm mt-4">
              Last updated: {cms?.lastUpdated ?? "March 2026"}
            </p>
          </div>
        </FadeIn>
      </Section>
    </>
  );
}
