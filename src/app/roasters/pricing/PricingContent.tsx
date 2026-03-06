"use client";

import { useState } from "react";
import { ArrowRight, Check, X, CaretRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const PLATFORM_URL = "https://platform.ghostroastery.com";

/* ── Types ─────────────────────────────────────────────── */

interface FAQ {
  _id: string;
  question: string;
  answer: string;
}

type CellValue = string | boolean;

interface Tier {
  name: string;
  monthly: number;
  description: string;
  highlighted?: boolean;
  cta: string;
  ctaHref: string;
}

interface FeatureRow {
  label: string;
  values: CellValue[];
}

interface Suite {
  key: string;
  label: string;
  subtitle: string;
  isAddOn?: boolean;
  tiers: Tier[];
  features: FeatureRow[];
}

/* ── Suite data ────────────────────────────────────────── */

const suites: Suite[] = [
  {
    key: "sales",
    label: "Sales Suite",
    subtitle: "Everything you need to sell coffee online",
    tiers: [
      {
        name: "Free",
        monthly: 0,
        description: "Get started at zero cost",
        cta: "Start Free",
        ctaHref: `${PLATFORM_URL}/signup`,
      },
      {
        name: "Starter",
        monthly: 29,
        description: "For roasters building momentum",
        cta: "Start Free Trial",
        ctaHref: `${PLATFORM_URL}/signup?plan=starter`,
      },
      {
        name: "Growth",
        monthly: 49,
        description: "For growing roasteries",
        highlighted: true,
        cta: "Start Free Trial",
        ctaHref: `${PLATFORM_URL}/signup?plan=growth`,
      },
      {
        name: "Pro",
        monthly: 79,
        description: "For established roasters",
        cta: "Start Free Trial",
        ctaHref: `${PLATFORM_URL}/signup?plan=pro`,
      },
      {
        name: "Scale",
        monthly: 149,
        description: "For high-volume operations",
        cta: "Contact Us",
        ctaHref: `${PLATFORM_URL}/contact`,
      },
    ],
    features: [
      { label: "Products", values: ["5", "10", "20", "50", "Unlimited"] },
      { label: "Storefront Orders", values: ["Unlimited + 5% fee", "Unlimited", "Unlimited", "Unlimited", "Unlimited"] },
      { label: "Wholesale Orders / month", values: ["30", "150", "400", "800", "Unlimited"] },
      { label: "CRM Contacts", values: ["100", "500", "1,500", "5,000", "Unlimited"] },
      { label: "Team Members", values: ["1", "2", "3", "5", "10"] },
      { label: "Storefront", values: ["Subdomain", true, true, true, true] },
      { label: "Wholesale Accounts", values: ["5", "20", "50", "200", "Unlimited"] },
      { label: "Invoices", values: [false, true, true, true, true] },
      { label: "Sales Analytics", values: [false, "Basic", "Full", "Full", "Full"] },
      { label: "CRM Email Integration", values: [false, false, true, true, true] },
      { label: "Transaction Fee", values: ["5%", "0%", "0%", "0%", "0%"] },
    ],
  },
  {
    key: "marketing",
    label: "Marketing Suite",
    subtitle: "Grow your brand with powerful marketing tools",
    isAddOn: true,
    tiers: [
      {
        name: "Free",
        monthly: 0,
        description: "Basic marketing tools included",
        cta: "Start Free",
        ctaHref: `${PLATFORM_URL}/signup`,
      },
      {
        name: "Starter",
        monthly: 19,
        description: "Essential campaigns and forms",
        cta: "Start Free Trial",
        ctaHref: `${PLATFORM_URL}/signup?plan=starter`,
      },
      {
        name: "Growth",
        monthly: 39,
        description: "Full marketing toolkit",
        highlighted: true,
        cta: "Start Free Trial",
        ctaHref: `${PLATFORM_URL}/signup?plan=growth`,
      },
      {
        name: "Pro",
        monthly: 59,
        description: "Advanced marketing power",
        cta: "Start Free Trial",
        ctaHref: `${PLATFORM_URL}/signup?plan=pro`,
      },
      {
        name: "Scale",
        monthly: 99,
        description: "Unlimited marketing at scale",
        cta: "Contact Us",
        ctaHref: `${PLATFORM_URL}/contact`,
      },
    ],
    features: [
      { label: "Email Sends / month", values: ["500", "2,000", "5,000", "15,000", "Unlimited"] },
      { label: "Embedded Forms", values: ["1 (branded)", "3", "10", "Unlimited", "Unlimited"] },
      { label: "AI Credits / month", values: ["10", "50", "150", "500", "1,500"] },
      { label: "Content Calendar", values: [false, true, true, true, true] },
      { label: "Social Scheduling", values: [false, false, true, true, true] },
      { label: "Automations", values: [false, false, true, true, true] },
      { label: "Marketing Analytics", values: [false, "Basic", "Full", "Full", "Full"] },
      { label: "Additional AI Credits", values: ["\u2014", "£5/100", "£5/100", "£4/100", "£3/100"] },
    ],
  },
];

/* ── Helpers ────────────────────────────────────────────── */

function formatPrice(monthly: number, annual: boolean) {
  if (monthly === 0) return { main: "Free", sub: "forever" };
  if (annual) {
    const discounted = Math.round((monthly * 10) / 12);
    return { main: `£${discounted}`, sub: "/mo billed annually" };
  }
  return { main: `£${monthly}`, sub: "/month" };
}

function CellContent({ value }: { value: CellValue }) {
  if (value === true) return <Check className="text-accent mx-auto" size={24} weight="duotone" />;
  if (value === false) return <X className="text-neutral-300 mx-auto" size={20} weight="duotone" />;
  return <span className="text-sm text-neutral-700 font-medium">{value}</span>;
}

/* ── Pricing Table ─────────────────────────────────────── */

function PricingTable({
  suite,
  annual,
}: {
  suite: Suite;
  annual: boolean;
}) {
  const { tiers, features, isAddOn } = suite;

  return (
    <div>
      {isAddOn && (
        <p className="text-center text-sm text-accent font-medium mb-8">
          Add-on pricing — purchased on top of your Sales Suite plan
        </p>
      )}

      {/* Desktop table */}
      <div className="hidden lg:block overflow-visible pt-4">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-4 text-left w-[200px]" />
              {tiers.map((tier) => {
                const price = formatPrice(tier.monthly, annual);
                return (
                  <th
                    key={tier.name}
                    className={cn(
                      "p-4 pt-8 text-center min-w-[160px] relative rounded-t-2xl",
                      tier.highlighted && "bg-accent/5"
                    )}
                  >
                    {tier.highlighted && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                        <span className="bg-accent text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider whitespace-nowrap shadow-sm">
                          Recommended
                        </span>
                      </div>
                    )}
                    <p className="text-lg font-bold text-neutral-900">
                      {tier.name}
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {tier.description}
                    </p>
                    <div className="mt-3">
                      <span className="text-3xl font-black text-neutral-900">
                        {isAddOn && tier.monthly > 0 ? "+" : ""}
                        {price.main}
                      </span>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {price.sub}
                      </p>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {features.map((row, idx) => (
              <tr
                key={row.label}
                className={cn(
                  "border-t border-neutral-100",
                  idx % 2 === 0 && "bg-neutral-50/50"
                )}
              >
                <td className="p-4 text-sm font-medium text-neutral-700">
                  {row.label}
                </td>
                {row.values.map((value, i) => (
                  <td
                    key={i}
                    className={cn(
                      "p-4 text-center",
                      tiers[i]?.highlighted && "bg-accent/5"
                    )}
                  >
                    <CellContent value={value} />
                  </td>
                ))}
              </tr>
            ))}
            {/* CTA row */}
            <tr className="border-t border-neutral-200">
              <td className="p-4" />
              {tiers.map((tier) => (
                <td
                  key={tier.name}
                  className={cn(
                    "p-4 text-center rounded-b-2xl",
                    tier.highlighted && "bg-accent/5"
                  )}
                >
                  <a
                    href={tier.ctaHref}
                    className={cn(
                      "inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors w-full max-w-[160px]",
                      tier.highlighted
                        ? "bg-accent text-white hover:bg-accent-hover"
                        : tier.cta === "Contact Us"
                          ? "bg-neutral-900 text-white hover:bg-neutral-800"
                          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                    )}
                  >
                    {tier.cta}
                  </a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden space-y-6">
        {tiers.map((tier) => {
          const price = formatPrice(tier.monthly, annual);
          return (
            <div
              key={tier.name}
              className={cn(
                "rounded-2xl border p-6",
                tier.highlighted
                  ? "border-accent shadow-lg ring-2 ring-accent/20"
                  : "border-neutral-200"
              )}
            >
              {tier.highlighted && (
                <span className="inline-block bg-accent text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                  Recommended
                </span>
              )}
              <h3 className="text-xl font-bold text-neutral-900">
                {tier.name}
              </h3>
              <p className="text-sm text-neutral-500 mt-0.5">
                {tier.description}
              </p>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-black text-neutral-900">
                  {isAddOn && tier.monthly > 0 ? "+" : ""}
                  {price.main}
                </span>
                <span className="text-sm text-neutral-500 ml-1">
                  {price.sub}
                </span>
              </div>
              <div className="space-y-3 mb-6">
                {features.map((row) => {
                  const idx = tiers.indexOf(tier);
                  const value = row.values[idx];
                  return (
                    <div
                      key={row.label}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-neutral-600">{row.label}</span>
                      <span className="font-medium text-neutral-900">
                        {value === true ? (
                          <Check className="text-accent" size={20} weight="duotone" />
                        ) : value === false ? (
                          <X className="text-neutral-300" size={20} weight="duotone" />
                        ) : (
                          value
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
              <a
                href={tier.ctaHref}
                className={cn(
                  "block w-full text-center px-6 py-3 rounded-lg font-semibold transition-colors",
                  tier.highlighted
                    ? "bg-accent text-white hover:bg-accent-hover"
                    : tier.cta === "Contact Us"
                      ? "bg-neutral-900 text-white hover:bg-neutral-800"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                )}
              >
                {tier.cta}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Default FAQ fallback ──────────────────────────────── */

const defaultFaqs: FAQ[] = [
  {
    _id: "dfaq-1",
    question: "Can I use both suites on the free plan?",
    answer:
      "Yes! Both the Sales Suite and Marketing Suite are included free with generous limits. Upgrade only when you need more capacity.",
  },
  {
    _id: "dfaq-2",
    question: "Are there transaction fees on paid plans?",
    answer:
      "No. Transaction fees are only applied on the Free plan (5% on Sales Suite). All paid plans have 0% transaction fees.",
  },
  {
    _id: "dfaq-3",
    question: "Is the Marketing Suite required?",
    answer:
      "No. The Marketing Suite is an optional add-on. You can use the Sales Suite on its own. The free Marketing Suite tier is always included.",
  },
  {
    _id: "dfaq-4",
    question: "What happens when I hit my plan limits?",
    answer:
      "You\u2019ll get a notification when you\u2019re approaching your limits. You can upgrade at any time \u2014 your data and settings carry over seamlessly.",
  },
  {
    _id: "dfaq-5",
    question: "Can I switch plans at any time?",
    answer:
      "Yes. You can upgrade, downgrade, or cancel at any time. If you downgrade, changes take effect at the end of your current billing period.",
  },
  {
    _id: "dfaq-6",
    question: "Do you offer annual billing?",
    answer:
      "Yes. Annual billing gives you 2 months free \u2014 the equivalent of a ~17% discount. You can switch between monthly and annual billing at any time.",
  },
];

/* ── Main Component ────────────────────────────────────── */

export function PricingContent({ faqs, cms }: { faqs: FAQ[]; cms?: any }) {
  const [annual, setAnnual] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const displayFaqs = faqs.length > 0 ? faqs : defaultFaqs;

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-neutral-900 mb-6">
            {cms?.heroHeadline ?? "Simple,"}{" "}
            <span className="text-accent">{cms?.heroAccentText ?? "transparent"}</span>{" "}
            pricing
          </h1>
          <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto">
            {cms?.heroSubheadline ?? "Start free with both suites. Upgrade as you grow — no transaction fees on any paid plan."}
          </p>
        </div>
      </section>

      {/* ── Billing Toggle + Suite Tabs ──────────────────── */}
      <section className="pt-16 pb-4 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span
              className={cn(
                "text-sm font-medium transition-colors",
                !annual ? "text-neutral-900" : "text-neutral-400"
              )}
            >
              Monthly
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className={cn(
                "relative inline-flex h-7 w-12 items-center rounded-full transition-colors",
                annual ? "bg-accent" : "bg-neutral-300"
              )}
              aria-label="Toggle annual billing"
            >
              <span
                className={cn(
                  "inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
                  annual ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
            <span
              className={cn(
                "text-sm font-medium transition-colors",
                annual ? "text-neutral-900" : "text-neutral-400"
              )}
            >
              Annual
            </span>
            {annual && (
              <span className="text-xs font-semibold text-accent bg-accent/10 px-2.5 py-1 rounded-full">
                2 months free
              </span>
            )}
          </div>

          {/* Suite tabs — matching ProductsCarousel style */}
          <div className="flex justify-center">
            <div className="inline-flex rounded-lg border border-neutral-200 p-1 bg-neutral-50">
              {suites.map((suite, i) => (
                <button
                  key={suite.key}
                  onClick={() => setActiveIndex(i)}
                  className={cn(
                    "px-6 py-2.5 text-sm font-semibold rounded-md transition-all duration-200",
                    activeIndex === i
                      ? "bg-accent text-white shadow-sm"
                      : "text-neutral-600 hover:text-neutral-900"
                  )}
                >
                  {suite.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing Tables — crossfade ───────────────────── */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {suites.map((suite, i) => (
              <div
                key={suite.key}
                className={cn(
                  "transition-all duration-500 ease-in-out",
                  activeIndex === i
                    ? "opacity-100 relative"
                    : "opacity-0 absolute inset-0 pointer-events-none"
                )}
              >
                <div className="text-center mb-10">
                  <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
                    {suite.label}
                  </h2>
                  <p className="mt-2 text-neutral-500 text-lg">
                    {suite.subtitle}
                  </p>
                </div>
                <PricingTable suite={suite} annual={annual} />

                {/* Fees transparency — Sales Suite only */}
                {suite.key === "sales" && (
                  <div className="mt-12 max-w-3xl mx-auto">
                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
                      <h3 className="text-lg font-bold text-neutral-900 mb-4">
                        Transaction fees — full transparency
                      </h3>
                      <p className="text-sm text-neutral-600 mb-5">
                        Stripe payment processing applies to all storefront
                        transactions regardless of plan. We believe in being
                        upfront about costs so you can price with confidence.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        {/* Free tier */}
                        <div className="rounded-xl border border-neutral-200 bg-white p-5">
                          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                            Free plan
                          </p>
                          <p className="text-2xl font-black text-neutral-900">
                            6.5% + 20p
                          </p>
                          <p className="text-sm text-neutral-500 mt-1">
                            per storefront sale
                          </p>
                          <p className="text-xs text-neutral-400 mt-3">
                            5% Ghost Roastery fee + 1.5% + 20p Stripe
                          </p>
                        </div>

                        {/* Paid tiers */}
                        <div className="rounded-xl border border-accent/20 bg-accent/5 p-5">
                          <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-2">
                            All paid plans
                          </p>
                          <p className="text-2xl font-black text-neutral-900">
                            1.5% + 20p
                          </p>
                          <p className="text-sm text-neutral-500 mt-1">
                            per storefront sale
                          </p>
                          <p className="text-xs text-neutral-400 mt-3">
                            Stripe processing only — no Ghost Roastery fee
                          </p>
                        </div>
                      </div>

                      {/* Worked example */}
                      <div className="rounded-lg bg-white border border-neutral-200 px-5 py-4">
                        <p className="text-sm text-neutral-700">
                          <span className="font-semibold">Example — £20 sale:</span>{" "}
                          Free tier = £1.50 in fees. Paid tier = 50p in fees.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 text-center mb-12">
              {cms?.faqTitle ?? "Frequently asked questions"}
            </h2>
            <div className="divide-y divide-neutral-200 border-t border-b border-neutral-200">
              {displayFaqs.map((faq) => (
                <details key={faq._id} className="group">
                  <summary className="flex items-center justify-between cursor-pointer py-5 text-left text-lg font-semibold text-neutral-900 hover:text-accent transition-colors">
                    {faq.question}
                    <CaretRight className="text-neutral-400 group-open:rotate-90 transition-transform flex-shrink-0 ml-4" size={24} weight="duotone" />
                  </summary>
                  <div className="pb-5 text-neutral-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-neutral-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-6">
            {cms?.ctaHeadline ?? "Start selling with zero upfront cost"}
          </h2>
          <p className="text-lg text-neutral-300 max-w-xl mx-auto mb-10">
            {cms?.ctaDescription ?? "Both suites included free. No credit card required. Upgrade only when you need more."}
          </p>
          <a
            href={`${PLATFORM_URL}/signup`}
            className="inline-flex items-center px-8 py-4 bg-accent text-white font-semibold text-lg rounded-lg hover:bg-accent-hover transition-colors"
          >
            {cms?.ctaButtonText ?? "Get Started Free"}
            <ArrowRight className="ml-2" size={24} weight="duotone" />
          </a>
        </div>
      </section>
    </>
  );
}
