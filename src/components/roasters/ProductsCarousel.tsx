"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Storefront,
  Receipt,
  Envelope,
  ShareNetwork,
  Lightning,
  Sparkle,
  ArrowRight,
  Package,
  ClipboardText,
  Leaf,
  Fire,
  Star,
  Calculator,
  Layout,
  PaintBrush,
  Globe,
  Eye,
  Wrench,
  Browser,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface CarouselCmsData {
  suites?: Array<{
    key: string;
    tagline?: string;
    description?: string;
  }>;
}

const suites = [
  {
    key: "sales",
    label: "Sales Suite",
    tagline: "Sell wholesale and direct — from one dashboard",
    description:
      "Manage your products, launch a branded storefront, track every order, handle wholesale accounts, and get paid automatically. Included free on every plan.",
    allHref: "/features/sales",
    placeholderIcon: Package,
    placeholderLabel: "Sales Suite Screenshot",
    features: [
      {
        icon: ClipboardText,
        title: "Order Tracking",
        desc: "Track every order from placement to delivery with real-time status updates.",
        href: "/features/order-tracking",
      },
      {
        icon: ShoppingCart,
        title: "Wholesale",
        desc: "Manage wholesale accounts, custom pricing tiers, and repeat orders.",
        href: "/features/wholesale",
      },
      {
        icon: Storefront,
        title: "Storefront",
        desc: "Launch a branded online store with your own domain. Sell bags, subscriptions, and merch.",
        href: "/features/storefront",
      },
      {
        icon: Receipt,
        title: "Invoices",
        desc: "Generate and send professional invoices. Track payments and export for your accountant.",
        href: "/features/invoices",
      },
    ],
  },
  {
    key: "marketing",
    label: "Marketing Suite",
    tagline: "Grow your brand on autopilot",
    description:
      "Email campaigns, social scheduling, automations, and AI-powered content — all included free on every plan.",
    allHref: "/features/marketing",
    placeholderIcon: Envelope,
    placeholderLabel: "Marketing Suite Screenshot",
    features: [
      {
        icon: Envelope,
        title: "Email Campaigns",
        desc: "Design beautiful emails that drive repeat orders. Segmentation and analytics built in.",
        href: "/features/email-campaigns",
      },
      {
        icon: ShareNetwork,
        title: "Social Scheduling",
        desc: "Plan, create, and schedule social media posts across Instagram, Facebook, and LinkedIn.",
        href: "/features/social-scheduling",
      },
      {
        icon: Lightning,
        title: "Automations",
        desc: "Build automated workflows — welcome sequences, abandoned carts, and re-engagement.",
        href: "/features/automations",
      },
      {
        icon: Sparkle,
        title: "AI Studio",
        desc: "Generate product descriptions, social captions, email copy, and marketing images with AI.",
        href: "/features/ai-studio",
      },
    ],
  },
  {
    key: "roaster-tools",
    label: "Roaster Tools",
    tagline: "The tools your roastery actually needs",
    description:
      "Green bean inventory, roast logging, cupping scorecards, and calculators — built for working roasters. Free on every plan.",
    allHref: "/features/roaster-tools",
    placeholderIcon: Wrench,
    placeholderLabel: "Roaster Tools Screenshot",
    features: [
      {
        icon: Leaf,
        title: "Green Bean Inventory",
        desc: "Track every bag of green coffee from arrival to roast. Origins, suppliers, and stock levels.",
        href: "/features/roaster-tools",
      },
      {
        icon: Fire,
        title: "Roast Log",
        desc: "Record profiles, temperatures, development times, and batch notes.",
        href: "/features/roaster-tools",
      },
      {
        icon: Star,
        title: "Cupping Scorecards",
        desc: "SCA-aligned scoring. Compare batches across origins, profiles, and dates.",
        href: "/features/roaster-tools",
      },
      {
        icon: Calculator,
        title: "Calculators",
        desc: "Roast loss, brew ratio, and cost-per-cup. The maths without the spreadsheet.",
        href: "/features/roaster-tools",
      },
    ],
  },
  {
    key: "website",
    label: "Website Builder",
    tagline: "A proper website for your roastery",
    description:
      "Build your website without a developer. Drag-and-drop pages, your own domain, and a design that matches your brand. From £14/month.",
    allHref: "/features/website",
    placeholderIcon: Browser,
    placeholderLabel: "Website Builder Screenshot",
    features: [
      {
        icon: Layout,
        title: "Page Builder",
        desc: "Drag-and-drop blocks to build pages in minutes. Pre-built components for roasters.",
        href: "/features/website",
      },
      {
        icon: PaintBrush,
        title: "Design & Theming",
        desc: "Set your brand colours, typography, and logo. Every page inherits your design.",
        href: "/features/website",
      },
      {
        icon: Globe,
        title: "Custom Domains",
        desc: "Use your own domain — yourroastery.com. SSL included. One-click setup.",
        href: "/features/website",
      },
      {
        icon: Eye,
        title: "Live Preview",
        desc: "See changes before you publish. Desktop and mobile preview built in.",
        href: "/features/website",
      },
    ],
  },
];

export function ProductsCarousel({ cms }: { cms?: CarouselCmsData }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const resolvedSuites = suites.map((suite) => {
    const cmsSuite = cms?.suites?.find((s) => s.key === suite.key);
    return {
      ...suite,
      tagline: cmsSuite?.tagline || suite.tagline,
      description: cmsSuite?.description || suite.description,
    };
  });

  return (
    <div>
      {/* Toggle tabs */}
      <div className="flex justify-center mb-12">
        <div className="grid grid-cols-4 sm:inline-flex rounded-lg border border-neutral-200 p-1 bg-neutral-50 w-full sm:w-auto">
          {resolvedSuites.map((suite, i) => (
            <button
              key={suite.key}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "px-2 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold rounded-md transition-all duration-200 text-center leading-tight",
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

      {/* Content — crossfade */}
      <div className="relative">
        {resolvedSuites.map((suite, i) => {
          const SuiteIcon = suite.placeholderIcon;
          return (
            <div
              key={suite.key}
              className={cn(
                "transition-all duration-500 ease-in-out",
                activeIndex === i
                  ? "opacity-100 relative"
                  : "opacity-0 absolute inset-0 pointer-events-none"
              )}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                {/* Image placeholder */}
                <div
                  className={cn(
                    "relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200",
                    i === 1 ? "order-1 lg:order-2" : ""
                  )}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <SuiteIcon weight="duotone" size={72} className="text-neutral-300 mx-auto mb-3" />
                      <p className="text-sm text-neutral-400 font-medium">
                        {suite.placeholderLabel}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className={i === 1 ? "order-2 lg:order-1" : ""}>
                  <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">
                    {suite.label}
                  </p>
                  <h3 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight mb-4">
                    {suite.tagline}
                  </h3>
                  <p className="text-lg text-neutral-600 mb-8">
                    {suite.description}
                  </p>
                  <div className="space-y-3">
                    {suite.features.map((feature) => {
                      const Icon = feature.icon;
                      return (
                        <Link
                          key={feature.title}
                          href={feature.href}
                          className="flex gap-4 p-4 rounded-xl border border-neutral-200 hover:border-accent/30 hover:shadow-md transition-all group bg-white"
                        >
                          <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-white transition-colors">
                            <Icon weight="duotone" size={24} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-neutral-900 group-hover:text-accent transition-colors">
                              {feature.title}
                            </p>
                            <p className="text-xs text-neutral-500 mt-0.5">
                              {feature.desc}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  <Link
                    href={suite.allHref}
                    className="inline-flex items-center gap-1 mt-6 text-sm font-semibold text-accent hover:underline"
                  >
                    View all {suite.label} features
                    <ArrowRight weight="duotone" size={20} />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
