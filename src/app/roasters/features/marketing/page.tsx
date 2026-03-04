import { Metadata } from "next";
import Link from "next/link";
import {
  CalendarDays,
  Mail,
  Share2,
  Zap,
  Tags,
  Code2,
  Sparkles,
  BarChart3,
  Globe,
  ArrowRight,
} from "lucide-react";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Marketing Suite",
  description:
    "Grow your roastery brand with powerful marketing tools — content calendar, email campaigns, automations, discount codes, AI-powered content, and more.",
};

const PLATFORM_URL = "https://platform.ghostroastery.com";

const features = [
  {
    title: "Content Calendar",
    description:
      "Plan, create, and schedule all your content from a single calendar view.",
    href: "/features/content-calendar",
    icon: CalendarDays,
    comingSoon: false,
  },
  {
    title: "Email Campaigns",
    description:
      "Design and send beautiful email campaigns. Audience segmentation and campaign analytics built in.",
    href: "/features/email-campaigns",
    icon: Mail,
    comingSoon: false,
  },
  {
    title: "Social Scheduling",
    description:
      "Plan, create, and schedule social media posts across Instagram, Facebook, and LinkedIn from one dashboard.",
    href: "/features/social-scheduling",
    icon: Share2,
    comingSoon: false,
  },
  {
    title: "Automations",
    description:
      "Build automated workflows — welcome sequences, abandoned cart recovery, and re-engagement campaigns.",
    href: "/features/automations",
    icon: Zap,
    comingSoon: false,
  },
  {
    title: "Discount Codes",
    description:
      "Create percentage or fixed-amount codes for promotions, loyalty rewards, and first-time buyers.",
    href: "/features/discount-codes",
    icon: Tags,
    comingSoon: false,
  },
  {
    title: "Embedded Forms",
    description:
      "Capture leads and grow your audience with embeddable signup and contact forms.",
    href: "/features/embedded-forms",
    icon: Code2,
    comingSoon: false,
  },
  {
    title: "AI Studio",
    description:
      "Generate product descriptions, social captions, email copy, and marketing images with AI.",
    href: "/features/ai-studio",
    icon: Sparkles,
    comingSoon: false,
  },
  {
    title: "Analytics",
    description:
      "Campaign performance, audience metrics, and engagement tracking in one place.",
    href: "/features/marketing-analytics",
    icon: BarChart3,
    comingSoon: false,
  },
  {
    title: "Marketing Websites",
    description:
      "Build full marketing sites for your brand — landing pages, about pages, and more.",
    href: "/features/marketing-websites",
    icon: Globe,
    comingSoon: true,
  },
];

export default function MarketingSuitePage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 lg:py-28 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-neutral-900 mb-4">
            Marketing <span className="text-accent">Suite</span>
          </h1>
          <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto mb-3">
            Everything you need to grow your roastery brand — from email
            campaigns and automations to AI-powered content and analytics.
          </p>
          <p className="text-sm font-medium text-accent">
            Included free on every plan
          </p>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature) => {
              const Icon = feature.icon;

              if (feature.comingSoon) {
                return (
                  <div
                    key={feature.title}
                    className="relative p-6 rounded-xl border border-neutral-200 bg-neutral-50 flex flex-col opacity-60"
                  >
                    <span className="absolute top-4 right-4 text-xs font-semibold uppercase tracking-wide bg-neutral-200 text-neutral-500 px-2.5 py-1 rounded-full">
                      Coming Soon
                    </span>
                    <div className="w-12 h-12 rounded-lg bg-neutral-200 text-neutral-400 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-400 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-neutral-400 flex-1">
                      {feature.description}
                    </p>
                  </div>
                );
              }

              return (
                <Link
                  key={feature.title}
                  href={feature.href}
                  className="group p-6 rounded-xl border border-neutral-200 hover:border-accent/30 hover:shadow-lg transition-all duration-300 bg-white flex flex-col"
                >
                  <div className="w-12 h-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600 mb-4 flex-1">
                    {feature.description}
                  </p>
                  <span className="inline-flex items-center text-sm font-semibold text-accent group-hover:underline">
                    Learn more
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-neutral-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-6">
            Grow your coffee brand today
          </h2>
          <p className="text-lg text-neutral-300 max-w-xl mx-auto mb-10">
            Create your free account and start reaching more customers with
            powerful marketing tools.
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
