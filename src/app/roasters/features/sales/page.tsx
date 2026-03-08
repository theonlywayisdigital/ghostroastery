import { Metadata } from "next";
import Link from "next/link";
import {
  Package,
  ClipboardText,
  Storefront,
  ShoppingCart,
  Users,
  Receipt,
  ChartBar,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Sales Suite — Sell Wholesale & Direct-to-Consumer",
  description:
    "Sell coffee wholesale and direct-to-consumer from one dashboard. Orders, invoicing, storefront, and CRM — included free on every plan.",
};

const PLATFORM_URL = "https://platform.ghostroastery.com";

const features = [
  {
    title: "Product Management",
    href: "/roasters/features/product-management",
    icon: Package,
    description:
      "Manage your coffee catalogue, blends, sizes, and pricing in one place.",
  },
  {
    title: "Order Tracking",
    href: "/roasters/features/order-tracking",
    icon: ClipboardText,
    description:
      "Track every order from placement to delivery with real-time status updates and customer notifications.",
  },
  {
    title: "Storefront",
    href: "/roasters/features/storefront",
    icon: Storefront,
    description:
      "Launch a branded online store with your own domain. Sell bags, subscriptions, and merchandise directly to customers.",
  },
  {
    title: "Wholesale",
    href: "/roasters/features/wholesale",
    icon: ShoppingCart,
    description:
      "Manage wholesale accounts, custom pricing tiers, minimum order quantities, and repeat orders.",
  },
  {
    title: "CRM",
    href: "/roasters/features/crm",
    icon: Users,
    description:
      "Customer profiles, purchase history, segments, and lifetime value tracking.",
  },
  {
    title: "Invoices",
    href: "/roasters/features/invoices",
    icon: Receipt,
    description:
      "Generate and send professional invoices automatically. Track payments, overdue balances, and export for your accountant.",
  },
  {
    title: "Analytics",
    href: "/roasters/features/sales-analytics",
    icon: ChartBar,
    description:
      "Sales dashboards, revenue tracking, best sellers, and customer acquisition metrics.",
  },
];

export default function SalesSuitePage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 lg:py-28 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-neutral-900 mb-6">
            <span className="text-accent">Sales</span> Suite
          </h1>
          <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto mb-4">
            Everything you need to sell coffee wholesale and direct-to-consumer.
            Manage orders, send invoices, and run your own branded storefront —
            all from one platform.
          </p>
          <p className="text-sm font-medium text-accent">
            Included free on every plan
          </p>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.title}
                  href={feature.href}
                  className="group p-6 rounded-xl border border-neutral-200 hover:border-accent/30 hover:shadow-lg transition-all duration-300 bg-white flex flex-col"
                >
                  <div className="w-12 h-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-white transition-colors">
                    <Icon size={28} weight="duotone" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600 mb-4 flex-1">
                    {feature.description}
                  </p>
                  <span className="inline-flex items-center text-accent font-semibold text-sm group-hover:gap-2 transition-all">
                    Learn more
                    <ArrowRight className="ml-1" size={20} weight="duotone" />
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
            Start selling coffee online today
          </h2>
          <p className="text-lg text-neutral-300 max-w-xl mx-auto mb-10">
            Create your account and explore the platform. No credit card
            required.
          </p>
          <a
            href={PLATFORM_URL}
            className="inline-flex items-center px-8 py-4 bg-accent text-white font-semibold text-lg rounded-lg hover:bg-accent-hover transition-colors"
          >
            Get Started Free
            <ArrowRight className="ml-2" size={24} weight="duotone" />
          </a>
        </div>
      </section>
    </>
  );
}
