import { Metadata } from "next";
import Link from "next/link";
import {
  Zap,
  HandMetal,
  ShoppingCart,
  UserCheck,
  Workflow,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Automations",
  description:
    "Set it and forget it. Build workflows that nurture customers and drive revenue on autopilot.",
};

const PLATFORM_URL = "https://platform.ghostroastery.com";

const benefits = [
  {
    title: "Welcome Sequences",
    description:
      "Automatically onboard new customers with a series of welcome emails.",
    icon: HandMetal,
  },
  {
    title: "Abandoned Cart Recovery",
    description:
      "Win back lost sales with timely reminders and incentives.",
    icon: ShoppingCart,
  },
  {
    title: "Re-engagement Campaigns",
    description:
      "Automatically reach out to customers who haven't ordered recently.",
    icon: UserCheck,
  },
  {
    title: "Trigger-Based Workflows",
    description:
      "Build custom automations triggered by any customer action or event.",
    icon: Workflow,
  },
];

export default function AutomationsPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 lg:py-28 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Breadcrumb */}
          <nav className="flex items-center justify-center gap-1.5 text-sm text-neutral-500 mb-8">
            <Link
              href="/features"
              className="hover:text-accent transition-colors"
            >
              Features
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link
              href="/features/marketing"
              className="hover:text-accent transition-colors"
            >
              Marketing Suite
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-neutral-900 font-medium">Automations</span>
          </nav>

          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-6">
            <Zap className="w-8 h-8" />
          </div>

          <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-4">
            Marketing Suite
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-neutral-900 mb-6">
            <span className="text-accent">Automations</span>
          </h1>
          <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto mb-3">
            Set it and forget it. Build workflows that nurture customers and
            drive revenue on autopilot.
          </p>
          <p className="text-sm font-medium text-accent">
            Included free on every plan
          </p>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Screenshot placeholder */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 mb-12 max-w-4xl mx-auto">
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-sm text-neutral-400 font-medium">
                Screenshot coming soon
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="p-6 rounded-xl border border-neutral-200 bg-white"
                >
                  <div className="w-12 h-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-neutral-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-neutral-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-6">
            Automate your marketing
          </h2>
          <p className="text-lg text-neutral-300 max-w-xl mx-auto mb-10">
            Create your account and let smart workflows do the heavy lifting.
          </p>
          <a
            href={PLATFORM_URL}
            className="inline-flex items-center px-8 py-4 bg-accent text-white font-semibold text-lg rounded-lg hover:bg-accent-hover transition-colors"
          >
            Get Started Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </a>
        </div>
      </section>
    </>
  );
}
