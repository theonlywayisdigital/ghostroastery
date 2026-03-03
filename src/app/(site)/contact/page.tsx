import { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ContactForm } from "@/components/contact";
import { Palette, Package } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | Ghost Roastery",
  description:
    "Get in touch with Ghost Roastery. Not sure which service is right for you? Drop us a message and we'll point you in the right direction.",
  openGraph: {
    title: "Contact Us | Ghost Roastery",
    description:
      "Get in touch with Ghost Roastery. We're here to help you launch your coffee brand.",
    url: "https://ghostroastery.com/contact",
  },
};

export default function ContactPage() {
  return (
    <>
      {/* Hero Section */}
      <Section className="pt-24 md:pt-32 pb-16 md:pb-20">
        <FadeIn>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">
              Get in touch
            </h1>
            <p className="text-xl md:text-2xl text-neutral-300">
              Not sure which service is right for you? Drop us a message and
              we&apos;ll point you in the right direction.
            </p>
          </div>
        </FadeIn>
      </Section>

      {/* Two Primary Paths */}
      <Section dark className="py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <FadeIn>
            <Card className="flex flex-col items-center text-center p-8">
              <div className="w-14 h-14 mb-4 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                <Palette className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                Ready to build your brand?
              </h3>
              <p className="text-neutral-400 mb-6 text-sm">
                From 25 bags. Design, roast, deliver.
              </p>
              <Link href="/build">
                <Button variant="primary">Start the builder</Button>
              </Link>
            </Card>
          </FadeIn>

          <FadeIn delay={0.1}>
            <Card className="flex flex-col items-center text-center p-8">
              <div className="w-14 h-14 mb-4 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                <Package className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-2">Need 150+ bags?</h3>
              <p className="text-neutral-400 mb-6 text-sm">
                Custom pricing for volume orders.
              </p>
              <Link href="/wholesale">
                <Button variant="outline">Wholesale enquiry</Button>
              </Link>
            </Card>
          </FadeIn>
        </div>

        <FadeIn delay={0.2}>
          <p className="text-center text-neutral-500 mt-8">
            Or fill in the form below for anything else
          </p>
        </FadeIn>
      </Section>

      {/* Contact Form */}
      <Section>
        <FadeIn>
          <SectionHeader
            title="Send us a message"
            subtitle="We typically respond within 1-2 business days."
          />
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="max-w-xl mx-auto">
            <div className="bg-neutral-800/50 border border-neutral-700 rounded-2xl p-6 md:p-8">
              <ContactForm />
            </div>
          </div>
        </FadeIn>
      </Section>
    </>
  );
}
