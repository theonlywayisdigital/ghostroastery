import { Metadata } from "next";
import {
  ArrowRight,
  Package,
  TrendUp,
  ShieldCheck,
  Lightning,
  CheckCircle,
} from "@phosphor-icons/react/dist/ssr";
import { client } from "@/sanity/lib/client";
import { roasterPartnerProgramPageQuery } from "@/sanity/lib/queries";
import { PortableText, type PortableTextBlock } from "@portabletext/react";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Partner Programme — Roast for Brands, Get Paid Weekly",
  description:
    "More orders without the marketing. Join the Ghost Roaster network — we send the orders, you roast and ship. Weekly payouts, zero advertising spend.",
};

const PLATFORM_URL = "https://app.roasteryplatform.com";

const steps = [
  {
    step: "01",
    title: "Apply",
    description:
      "Tell us about your roastery — equipment, capacity, profiles you roast, and certifications. We review and respond within 48 hours.",
  },
  {
    step: "02",
    title: "Get matched",
    description:
      "We match you with brands in your region that need your capacity and roast style. You choose which orders to accept.",
  },
  {
    step: "03",
    title: "Roast & ship",
    description:
      "Roast to spec, apply the brand's label, and dispatch. We handle customer service, returns, and reorders.",
  },
  {
    step: "04",
    title: "Get paid",
    description:
      "Payouts processed weekly into your bank account. Transparent rates, no invoicing to chase, no hidden fees.",
  },
];

const benefits = [
  {
    icon: <TrendUp size={28} weight="duotone" />,
    title: "Fill your spare capacity",
    description:
      "Turn downtime into revenue. We send orders that match your capacity — you roast when you have time, not when you have to.",
  },
  {
    icon: <ShieldCheck size={28} weight="duotone" />,
    title: "Zero marketing spend",
    description:
      "We handle customer acquisition, brand building, and advertising. You never need to spend a penny on marketing to get orders.",
  },
  {
    icon: <Package size={28} weight="duotone" />,
    title: "Simple fulfilment",
    description:
      "Orders arrive in your dashboard. Roast, label, dispatch. We handle customer service, returns, and reorders.",
  },
  {
    icon: <Lightning size={28} weight="duotone" />,
    title: "Weekly payouts",
    description:
      "Transparent rates published upfront. Payouts every week, directly to your bank. No invoicing, no chasing, no delays.",
  },
];

const requirements = [
  "UK-based speciality coffee roastery with commercial roasting equipment",
  "Ability to fulfil orders within 3–5 working days of receipt",
  "Food safety certification (HACCP or equivalent) in place",
  "Experience roasting a range of profiles — light through dark",
  "Consistent quality standards across batches",
];

const benefitIconMap: Record<string, React.ReactNode> = {
  TrendUp: <TrendUp size={28} weight="duotone" />,
  ShieldCheck: <ShieldCheck size={28} weight="duotone" />,
  Package: <Package size={28} weight="duotone" />,
  Lightning: <Lightning size={28} weight="duotone" />,
};

const partnerFaqs = [
  {
    question: "How much do I get paid per order?",
    answer:
      "Rates depend on order size, complexity, and turnaround. We publish transparent rate cards during onboarding — no hidden fees, no surprises.",
  },
  {
    question: "Can I choose which orders to accept?",
    answer:
      "Yes. You set your capacity and preferences. We match you with suitable orders, and you can decline any that don't fit your schedule.",
  },
  {
    question: "Do I need to use the Ghost Roastery platform for my own sales?",
    answer:
      "No. The partner programme is independent. You can roast for brands through us without using any other part of the platform.",
  },
  {
    question: "How quickly do I need to fulfil orders?",
    answer:
      "Standard turnaround is 3–5 working days from order receipt. Expedited orders are optional and paid at a higher rate.",
  },
  {
    question: "What happens if I need to take time off?",
    answer:
      "Set your availability in the dashboard. We pause order matching while you're away and resume when you're back. No penalties.",
  },
];

export default async function PartnerProgramPage() {
  const cms = await client
    .fetch(roasterPartnerProgramPageQuery)
    .catch(() => null);

  const resolvedSteps = cms?.steps?.length ? cms.steps : steps;

  const resolvedBenefits = cms?.benefits?.length
    ? cms.benefits.map((b: { icon?: string; title: string; description: string }) => ({
        icon: benefitIconMap[b.icon || ""] || <Package size={28} weight="duotone" />,
        title: b.title,
        description: b.description,
      }))
    : benefits;

  const resolvedRequirements = cms?.requirements?.length ? cms.requirements : requirements;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: partnerFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <section className="py-20 lg:py-28 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-neutral-900 mb-6">
            {cms?.heroHeadline ?? "More orders."}{" "}
            <span className="text-accent">{cms?.heroAccentText ?? "No marketing."}</span>
          </h1>
          <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto mb-10">
            {cms?.heroSubheadline ?? "We bring the brands and the orders. You bring the craft. Fill your roaster without spending a penny on advertising."}
          </p>
          <a
            href={`${PLATFORM_URL}/signup?plan=partner`}
            className="inline-flex items-center px-8 py-4 border-2 border-accent bg-accent text-white font-semibold text-lg rounded-lg hover:bg-transparent hover:text-accent transition-colors"
          >
            {cms?.heroCtaText ?? "Apply Now"}
            <ArrowRight className="ml-2" size={24} weight="duotone" />
          </a>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 text-center mb-16">
            {cms?.stepsTitle ?? "How it works"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {resolvedSteps.map((step: { step: string; title: string; description: string }) => (
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
            {cms?.benefitsTitle ?? "What you get"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {resolvedBenefits.map((benefit: { icon: React.ReactNode; title: string; description: string }) => (
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
      {cms?.additionalContent && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl prose prose-neutral prose-lg">
            <PortableText value={cms.additionalContent as PortableTextBlock[]} />
          </div>
        </section>
      )}

      {/* Requirements */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 text-center mb-12">
            {cms?.requirementsTitle ?? "What you need"}
          </h2>
          <div className="space-y-4">
            {resolvedRequirements.map((req: string) => (
              <div key={req} className="flex items-start gap-3 p-4">
                <CheckCircle className="text-accent flex-shrink-0 mt-0.5" size={24} weight="duotone" />
                <span className="text-neutral-700">{req}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-20 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 text-center mb-12">
            Frequently asked questions
          </h2>
          <div className="max-w-2xl mx-auto space-y-8">
            {partnerFaqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-neutral-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-neutral-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-6">
            {cms?.ctaHeadline ?? "Ready to fill your roaster?"}
          </h2>
          <p className="text-lg text-neutral-300 max-w-xl mx-auto mb-10">
            {cms?.ctaDescription ?? "Apply today. We review applications within 48 hours. No upfront costs, no risk."}
          </p>
          <a
            href={`${PLATFORM_URL}/signup?plan=partner`}
            className="inline-flex items-center px-8 py-4 border-2 border-accent bg-accent text-white font-semibold text-lg rounded-lg hover:bg-transparent hover:text-accent transition-colors"
          >
            {cms?.ctaButtonText ?? "Apply Now"}
            <ArrowRight className="ml-2" size={24} weight="duotone" />
          </a>
        </div>
      </section>
    </>
  );
}
