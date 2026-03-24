import { Metadata } from "next";
import Link from "next/link";
import {
  Leaf,
  Fire,
  CalendarBlank,
  Star,
  Calculator,
  Certificate,
  ArrowRight,
  Wrench,
} from "@phosphor-icons/react/dist/ssr";

export const revalidate = 3600;

const PLATFORM_URL = "https://app.roasteryplatform.com";

export const metadata: Metadata = {
  title: "Roaster Tools — Free Production & Inventory Tools",
  description:
    "Free tools built for working roasters. Green bean inventory, roast logging, production planning, cupping scorecards, and calculators — included on every plan.",
};

const features = [
  {
    icon: Leaf,
    title: "Green Bean Inventory",
    description:
      "Track every bag of green coffee from arrival to roast. Log origins, suppliers, lot numbers, and remaining stock. Know exactly what you have and when to reorder.",
  },
  {
    icon: Fire,
    title: "Roast Log",
    description:
      "Record roast profiles, charge temperatures, development times, and batch notes. Build a searchable library of every roast your team has ever done.",
  },
  {
    icon: CalendarBlank,
    title: "Production Planner",
    badge: "Growth+",
    description:
      "Schedule roasts against orders and capacity. See what needs roasting this week, allocate batches to orders, and avoid bottlenecks before they happen.",
  },
  {
    icon: Star,
    title: "Cupping Scorecards",
    description:
      "Score every batch with SCA-aligned cupping forms. Compare scores across origins, profiles, and roast dates. Keep quality consistent as you scale.",
  },
  {
    icon: Calculator,
    title: "Calculators",
    description:
      "Roast loss calculator, brew ratio calculator, and cost-per-cup estimator. The maths your roastery needs, without the spreadsheet.",
  },
  {
    icon: Certificate,
    title: "Certifications & Compliance",
    description:
      "Store and manage certifications — organic, Fairtrade, Rainforest Alliance. Track expiry dates and attach documents to supplier records.",
  },
];

const faqs = [
  {
    question: "Are Roaster Tools really free?",
    answer:
      "Yes. Green bean inventory, roast log, cupping scorecards, calculators, and certifications are included free on every plan — including the free tier. Production Planner is available on Growth plans and above.",
  },
  {
    question: "Can I use Roaster Tools without using the Sales or Marketing Suite?",
    answer:
      "Absolutely. Sign up for a free account and use only the tools you need. There is no requirement to sell through the platform to use Roaster Tools.",
  },
  {
    question: "Can my whole team access Roaster Tools?",
    answer:
      "Yes. All team members on your account can access Roaster Tools. Role-based permissions let you control who can edit inventory, log roasts, or view production schedules.",
  },
];

export default function RoasterToolsPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
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
            The tools your roastery{" "}
            <span className="text-accent">actually needs.</span>
          </h1>
          <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto mb-4">
            Green bean inventory, roast logging, production planning, cupping
            scorecards, and calculators — built for working roasters, not
            coffee hobbyists.
          </p>
          <p className="text-sm font-medium text-accent">
            Included free on every plan
          </p>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group p-6 rounded-xl border border-neutral-200 hover:border-accent/30 hover:shadow-lg transition-all duration-300 bg-white flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
                      <Icon size={28} weight="duotone" />
                    </div>
                    {"badge" in feature && feature.badge && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                        {feature.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600 flex-1">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tools Hub Section */}
      <section className="py-16 lg:py-20 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-6">
              <Wrench size={36} weight="duotone" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 mb-6">
              One dashboard for your whole roastery
            </h2>
            <p className="text-lg text-neutral-600 mb-4">
              All your tools live in the <strong>/tools</strong> dashboard —
              inventory, roast logs, cupping scores, calculators, and
              certifications in one place. No more switching between apps,
              spreadsheets, and notebooks.
            </p>
            <p className="text-neutral-500">
              Access from any device. Your data syncs automatically across
              your team.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 text-center mb-12">
            Frequently asked questions
          </h2>
          <div className="max-w-2xl mx-auto space-y-8">
            {faqs.map((faq) => (
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
            Start using Roaster Tools today
          </h2>
          <p className="text-lg text-neutral-300 max-w-xl mx-auto mb-10">
            Free on every plan. No credit card required. Sign up and start
            logging roasts in minutes.
          </p>
          <a
            href={`${PLATFORM_URL}/signup`}
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
