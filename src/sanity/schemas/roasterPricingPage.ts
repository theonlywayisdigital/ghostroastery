import { defineType, defineField } from "sanity";

export const roasterPricingPage = defineType({
  name: "roasterPricingPage",
  title: "Roaster Pricing Page",
  type: "document",
  fields: [
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "string",
      initialValue: "Simple, transparent pricing",
    }),
    defineField({
      name: "heroSubheadline",
      title: "Hero Subheadline",
      type: "text",
      rows: 2,
      initialValue:
        "Start free with both suites. Upgrade as you grow — no transaction fees on any paid plan.",
    }),
    defineField({
      name: "faqTitle",
      title: "FAQ Section — Title",
      type: "string",
      initialValue: "Frequently asked questions",
    }),
    defineField({
      name: "ctaHeadline",
      title: "Final CTA — Headline",
      type: "string",
      initialValue: "Start selling with zero upfront cost",
    }),
    defineField({
      name: "ctaDescription",
      title: "Final CTA — Description",
      type: "text",
      rows: 2,
      initialValue:
        "Both suites included free. No credit card required. Upgrade only when you need more.",
    }),
    defineField({
      name: "ctaButtonText",
      title: "Final CTA — Button Text",
      type: "string",
      initialValue: "Get Started Free",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Roaster Pricing Page" };
    },
  },
});
