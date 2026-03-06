import { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";
import { client } from "@/sanity/lib/client";
import { customerPartnersPageQuery } from "@/sanity/lib/queries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Our Partners | Ghost Roastery",
  description:
    "Meet the specialty roasters behind Ghost Roastery. Experienced, certified, and passionate about great coffee.",
  openGraph: {
    title: "Our Partners | Ghost Roastery",
    description:
      "Meet the specialty roasters behind Ghost Roastery.",
    url: "https://ghostroastery.com/our-partners",
  },
};

export default async function OurPartnersPage() {
  const cms = await client.fetch(customerPartnersPageQuery).catch(() => null);

  return (
    <>
      <Section className="pt-24 md:pt-32 pb-16 md:pb-20">
        <FadeIn>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">
              {cms?.heroHeadline ?? "The roasters"}{" "}
              <span className="text-accent">{cms?.heroSubheadline ?? "behind the scenes."}</span>
            </h1>
            <p className="text-xl md:text-2xl text-neutral-300">
              Every bag of Ghost Roastery coffee is roasted by experienced
              specialty roasters. Here&apos;s who makes it happen.
            </p>
          </div>
        </FadeIn>
      </Section>

      <Section dark>
        <FadeIn>
          <SectionHeader title={cms?.sectionTitle ?? "Our roasting partners"} />
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-neutral-300 mb-4">
              {cms?.description ?? "Our partner roasters are handpicked for their commitment to quality, consistency, and specialty-grade standards. They roast in small batches, source ethically, and treat every order with care."}
            </p>
            <p className="text-neutral-400 mb-8">
              {cms?.placeholderNote ?? "Partner profiles coming soon. In the meantime, learn more about our roasting standards."}
            </p>
            <Link href={cms?.ctaButtonHref ?? "/the-roasting-process"}>
              <Button variant="outline">{cms?.ctaButtonText ?? "The Roasting Process"}</Button>
            </Link>
          </div>
        </FadeIn>
      </Section>
    </>
  );
}
