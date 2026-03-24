import { Metadata } from "next";
import {
  Layout,
  PaintBrush,
  Compass,
  Globe,
  Eye,
  ArrowRight,
  CheckCircle,
} from "@phosphor-icons/react/dist/ssr";

export const revalidate = 3600;

const PLATFORM_URL = "https://app.roasteryplatform.com";

export const metadata: Metadata = {
  title: "Website Builder — Build Your Roastery Website",
  description:
    "A proper website for your roastery. Drag-and-drop page builder, custom domains, and your own design — from £14/month. No per-page charges. No tiers.",
};

const sellingPoints = [
  {
    title: "Built for roasters, not everyone",
    description:
      "Templates and components designed specifically for coffee roasters. Product pages, origin stories, wholesale enquiry forms — ready to use, not built from scratch.",
  },
  {
    title: "No code, no developer fees",
    description:
      "Drag-and-drop pages, update text, swap images, and publish — all from your dashboard. If you can write an email, you can build your website.",
  },
  {
    title: "Connected to your sales and marketing",
    description:
      "Your website lives in the same platform as your storefront, wholesale orders, and email campaigns. One login, one source of truth.",
  },
];

const features = [
  {
    icon: Layout,
    title: "Page Builder",
    description:
      "Drag-and-drop blocks to build pages in minutes. Hero sections, feature grids, testimonials, image galleries, contact forms — all pre-built and customisable.",
  },
  {
    icon: PaintBrush,
    title: "Design & Theming",
    description:
      "Set your brand colours, typography, and logo once. Every page inherits your design automatically. No CSS, no code, no designer required.",
  },
  {
    icon: Compass,
    title: "Navigation & Menus",
    description:
      "Build your site structure with a visual menu editor. Add pages, dropdowns, and external links. Reorder with drag-and-drop.",
  },
  {
    icon: Globe,
    title: "Custom Domains",
    description:
      "Use your own domain name — yourroastery.com, not a subdomain. SSL certificate included. One-click setup with any domain registrar.",
  },
  {
    icon: Eye,
    title: "Live Preview",
    description:
      "See exactly what your page looks like before you publish. Desktop and mobile preview. Make changes and see them instantly.",
  },
];

const faqs = [
  {
    question: "How much does the Website Builder cost?",
    answer:
      "£14–19/month depending on your plan. No tiers, no per-page charges, no hidden fees. You get the full page builder, custom domain, and unlimited pages.",
  },
  {
    question: "Can I use my own domain name?",
    answer:
      "Yes. Point your domain (e.g. yourroastery.com) to our platform and we handle SSL and DNS configuration. Works with any registrar.",
  },
  {
    question: "Do I need to know how to code?",
    answer:
      "No. The page builder is drag-and-drop. If you can use a word processor, you can build a website. We provide pre-built blocks for common roastery pages.",
  },
  {
    question: "Is the website connected to my storefront?",
    answer:
      "Yes. Your website and storefront share the same platform. Link directly to products, embed your shop on any page, or keep them separate — your choice.",
  },
  {
    question: "Can I migrate from my existing website?",
    answer:
      "We can help you move content from your existing site. The page builder makes it straightforward to recreate pages, and your domain can be transferred at any time.",
  },
];

export default function WebsiteBuilderPage() {
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
            A proper website for{" "}
            <span className="text-accent">your roastery.</span>
          </h1>
          <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto mb-4">
            Build your roastery website without a developer. Drag-and-drop
            page builder, your own domain, and a design that matches your
            brand — all connected to your sales and marketing.
          </p>
          <p className="text-sm font-medium text-accent">
            From £14/month — no tiers, no per-page charges
          </p>
        </div>
      </section>

      {/* Selling Points */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sellingPoints.map((point) => (
              <div
                key={point.title}
                className="text-center md:text-left"
              >
                <h3 className="text-xl font-bold text-neutral-900 mb-3">
                  {point.title}
                </h3>
                <p className="text-neutral-600">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Blocks */}
      <section className="py-16 lg:py-20 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 text-center mb-12">
            Everything you need to build your site
          </h2>
          <div className="space-y-12 max-w-4xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isReversed = index % 2 === 1;
              return (
                <div
                  key={feature.title}
                  className={`flex flex-col md:flex-row items-center gap-8 ${
                    isReversed ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Image placeholder */}
                  <div className="w-full md:w-1/2">
                    <div className="aspect-[4/3] rounded-xl bg-neutral-200 border border-neutral-300 flex items-center justify-center">
                      <div className="text-center">
                        <Icon
                          size={48}
                          weight="duotone"
                          className="text-neutral-400 mx-auto mb-2"
                        />
                        <p className="text-sm text-neutral-400 font-medium">
                          {feature.title}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Content */}
                  <div className="w-full md:w-1/2">
                    <div className="w-12 h-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-4">
                      <Icon size={28} weight="duotone" />
                    </div>
                    <h3 className="text-2xl font-bold text-neutral-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-neutral-600">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Callout */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center bg-accent/5 border border-accent/20 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-black tracking-tight text-neutral-900 mb-4">
              £14–19/month
            </h2>
            <p className="text-lg text-neutral-600 mb-6">
              No tiers. No per-page charges. No hidden fees.
            </p>
            <ul className="space-y-3 text-left max-w-sm mx-auto mb-8">
              {[
                "Unlimited pages",
                "Custom domain included",
                "SSL certificate included",
                "Drag-and-drop page builder",
                "Connected to your storefront",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle
                    size={20}
                    weight="duotone"
                    className="text-accent shrink-0"
                  />
                  <span className="text-neutral-700">{item}</span>
                </li>
              ))}
            </ul>
            <a
              href={`${PLATFORM_URL}/signup`}
              className="inline-flex items-center px-6 py-3 border-2 border-accent bg-accent text-white font-semibold rounded-lg hover:bg-transparent hover:text-accent transition-colors"
            >
              Get Started
              <ArrowRight className="ml-2" size={20} weight="duotone" />
            </a>
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
            Build your roastery website today
          </h2>
          <p className="text-lg text-neutral-300 max-w-xl mx-auto mb-10">
            No developer required. Start with a template and make it yours.
          </p>
          <a
            href={`${PLATFORM_URL}/signup`}
            className="inline-flex items-center px-8 py-4 border-2 border-accent bg-accent text-white font-semibold text-lg rounded-lg hover:bg-transparent hover:text-accent transition-colors"
          >
            Get Started
            <ArrowRight className="ml-2" size={24} weight="duotone" />
          </a>
        </div>
      </section>
    </>
  );
}
