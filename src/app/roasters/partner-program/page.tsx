import { Metadata } from "next";
import {
  ArrowRight,
  Package,
  TrendingUp,
  Shield,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { client } from "@/sanity/lib/client";
import { roastersPageSettingsQuery } from "@/sanity/lib/queries";
import { PortableText, type PortableTextBlock } from "@portabletext/react";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Partner Program",
  description:
    "Join the Ghost Roaster partner network. Receive guaranteed order volume, we handle marketing and payments — you focus on roasting.",
};

const PLATFORM_URL = "https://platform.ghostroastery.com";

const steps = [
  {
    step: "01",
    title: "Apply to join",
    description:
      "Tell us about your roastery, capacity, and specialities. We review applications within 48 hours.",
  },
  {
    step: "02",
    title: "Get verified",
    description:
      "We verify your roastery meets our quality standards with a sample evaluation and facility check.",
  },
  {
    step: "03",
    title: "Receive orders",
    description:
      "Ghost Roastery customers place orders through our platform. You receive them in your dashboard.",
  },
  {
    step: "04",
    title: "Roast & ship",
    description:
      "Roast the order, print the label, and dispatch. We handle payments and customer communication.",
  },
];

const benefits = [
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Guaranteed Volume",
    description:
      "Receive a steady stream of orders from Ghost Roastery's growing customer base. Fill your roaster's spare capacity.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "We Handle Marketing",
    description:
      "Our team manages all marketing, customer acquisition, and brand building. You focus on what you do best — roasting.",
  },
  {
    icon: <Package className="w-6 h-6" />,
    title: "Simple Fulfilment",
    description:
      "Receive orders, print labels, and mark as dispatched. Our dashboard makes fulfilment effortless.",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Fast Payouts",
    description:
      "Transparent payout system with regular payment batches. See exactly what you've earned and when it'll arrive.",
  },
];

const requirements = [
  "UK-based speciality coffee roastery",
  "SCA-grade equipment and quality standards",
  "Capacity to fulfil orders within 3-5 business days",
  "Food safety certification (HACCP or equivalent)",
  "Ability to roast a range of profiles (light to dark)",
  "Commitment to consistent quality",
];

export default async function PartnerProgramPage() {
  const settings = await client
    .fetch(roastersPageSettingsQuery)
    .catch(() => null);

  return (
    <>
      {/* Hero */}
      <section className="py-20 lg:py-28 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-neutral-900 mb-6">
            Ghost Roaster{" "}
            <span className="text-accent">Partner Programme</span>
          </h1>
          <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto mb-10">
            We bring the orders. You bring the craft. A partnership that fills
            your roaster and grows your business.
          </p>
          <a
            href={`${PLATFORM_URL}/signup?plan=partner`}
            className="inline-flex items-center px-8 py-4 bg-accent text-white font-semibold text-lg rounded-lg hover:bg-accent-hover transition-colors"
          >
            Apply Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </a>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 text-center mb-16">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.step} className="relative">
                <div className="text-5xl font-black text-accent/20 mb-3">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-neutral-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 text-center mb-16">
            Why partner with us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="p-6 rounded-xl border border-neutral-200 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-neutral-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sanity Rich Text Content */}
      {settings?.partnerProgramContent && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl prose prose-neutral prose-lg">
            <PortableText value={settings.partnerProgramContent as PortableTextBlock[]} />
          </div>
        </section>
      )}

      {/* Requirements */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 text-center mb-12">
            Requirements
          </h2>
          <div className="space-y-4">
            {requirements.map((req) => (
              <div key={req} className="flex items-start gap-3 p-4">
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700">{req}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-neutral-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-6">
            Ready to become a Ghost Roaster?
          </h2>
          <p className="text-lg text-neutral-300 max-w-xl mx-auto mb-10">
            Apply today and start receiving orders within the week. No upfront
            costs, no risk.
          </p>
          <a
            href={`${PLATFORM_URL}/signup?plan=partner`}
            className="inline-flex items-center px-8 py-4 bg-accent text-white font-semibold text-lg rounded-lg hover:bg-accent-hover transition-colors"
          >
            Apply Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </a>
        </div>
      </section>
    </>
  );
}
