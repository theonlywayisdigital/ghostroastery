import { Metadata } from "next";
import Link from "next/link";
import {
  Mail,
  MousePointerClick,
  Users,
  BarChart3,
  LayoutTemplate,
  ArrowRight,
} from "lucide-react";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Email Campaigns",
  description:
    "Design beautiful emails that drive repeat orders and keep your brand top of mind. Drag & drop builder, audience segmentation, analytics, and templates.",
};

const PLATFORM_URL = "https://platform.ghostroastery.com";

const benefits = [
  {
    title: "Drag & Drop Builder",
    description:
      "Create stunning emails with a visual editor. No design skills needed.",
    icon: MousePointerClick,
  },
  {
    title: "Audience Segmentation",
    description:
      "Target customers by purchase history, location, or engagement level.",
    icon: Users,
  },
  {
    title: "Campaign Analytics",
    description:
      "Track opens, clicks, and conversions. Know exactly what's working.",
    icon: BarChart3,
  },
  {
    title: "Template Library",
    description:
      "Pre-built templates for new launches, seasonal promos, and newsletters.",
    icon: LayoutTemplate,
  },
];

export default function EmailCampaignsPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 lg:py-28 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-8 justify-center">
            <Link
              href="/features"
              className="hover:text-accent transition-colors"
            >
              Features
            </Link>
            <span>/</span>
            <Link
              href="/features/marketing"
              className="hover:text-accent transition-colors"
            >
              Marketing Suite
            </Link>
            <span>/</span>
            <span className="text-neutral-900 font-medium">
              Email Campaigns
            </span>
          </nav>

          <div className="text-center">
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8" />
            </div>

            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-4">
              Marketing Suite
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-neutral-900 mb-6">
              Email Campaigns
            </h1>
            <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto mb-3">
              Design beautiful emails that drive repeat orders and keep your
              brand top of mind.
            </p>
            <p className="text-sm font-medium text-accent">
              Included free on every plan
            </p>
          </div>
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
            Start sending campaigns today
          </h2>
          <p className="text-lg text-neutral-300 max-w-xl mx-auto mb-10">
            Create your free account and start reaching customers with
            beautiful, high-converting email campaigns.
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
