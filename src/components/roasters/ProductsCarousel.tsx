"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Store,
  Receipt,
  Mail,
  Share2,
  Zap,
  Sparkles,
  ArrowRight,
  Boxes,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";

const suites = [
  {
    key: "sales",
    label: "Sales Suite",
    tagline: "Sell wholesale and direct — from one dashboard",
    description:
      "Manage your products, launch a branded storefront, track every order, handle wholesale accounts, and get paid automatically. Included free on every plan.",
    allHref: "/features/sales",
    placeholderIcon: Boxes,
    placeholderLabel: "Sales Suite Screenshot",
    features: [
      {
        icon: ClipboardList,
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
        icon: Store,
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
    placeholderIcon: Mail,
    placeholderLabel: "Marketing Suite Screenshot",
    features: [
      {
        icon: Mail,
        title: "Email Campaigns",
        desc: "Design beautiful emails that drive repeat orders. Segmentation and analytics built in.",
        href: "/features/email-campaigns",
      },
      {
        icon: Share2,
        title: "Social Scheduling",
        desc: "Plan, create, and schedule social media posts across Instagram, Facebook, and LinkedIn.",
        href: "/features/social-scheduling",
      },
      {
        icon: Zap,
        title: "Automations",
        desc: "Build automated workflows — welcome sequences, abandoned carts, and re-engagement.",
        href: "/features/automations",
      },
      {
        icon: Sparkles,
        title: "AI Studio",
        desc: "Generate product descriptions, social captions, email copy, and marketing images with AI.",
        href: "/features/ai-studio",
      },
    ],
  },
];

export function ProductsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div>
      {/* Toggle tabs */}
      <div className="flex justify-center mb-12">
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

      {/* Content — crossfade */}
      <div className="relative">
        {suites.map((suite, i) => {
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
                      <SuiteIcon className="w-16 h-16 text-neutral-300 mx-auto mb-3" />
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
                            <Icon className="w-5 h-5" />
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
                    <ArrowRight className="w-4 h-4" />
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
