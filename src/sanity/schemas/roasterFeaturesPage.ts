import { defineType, defineField } from "sanity";

export const roasterFeaturesPage = defineType({
  name: "roasterFeaturesPage",
  title: "Roaster Features Page",
  type: "document",
  fields: [
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "string",
      initialValue: "Powerful tools for",
    }),
    defineField({
      name: "heroAccentText",
      title: "Hero Accent Text",
      type: "string",
      description: "Highlighted text that appears after the headline",
      initialValue: "modern roasters",
    }),
    defineField({
      name: "heroSubheadline",
      title: "Hero Subheadline",
      type: "text",
      rows: 2,
      initialValue:
        "Everything you need to sell, market, and grow your coffee brand online — all included on every plan.",
    }),
    defineField({
      name: "heroCtaText",
      title: "Hero CTA Text",
      type: "string",
      initialValue: "Get Started Free",
    }),
    defineField({
      name: "salesSuiteTitle",
      title: "Sales Suite — Title",
      type: "string",
      initialValue: "Sales Suite",
    }),
    defineField({
      name: "salesSuiteSubtitle",
      title: "Sales Suite — Subtitle",
      type: "string",
      initialValue: "Included free on every plan",
    }),
    defineField({
      name: "marketingSuiteTitle",
      title: "Marketing Suite — Title",
      type: "string",
      initialValue: "Marketing Suite",
    }),
    defineField({
      name: "marketingSuiteSubtitle",
      title: "Marketing Suite — Subtitle",
      type: "string",
      initialValue: "Included free on every plan",
    }),
    defineField({
      name: "marketplaceTitle",
      title: "Marketplace Section — Title",
      type: "string",
      initialValue: "Marketplace",
    }),
    defineField({
      name: "marketplaceCopy",
      title: "Marketplace Section — Copy",
      type: "text",
      rows: 3,
      initialValue:
        "List your coffees on the Ghost Roastery marketplace and reach thousands of new customers. We handle the storefront, checkout, and marketing — you handle the roasting.",
    }),
    defineField({
      name: "faqTitle",
      title: "FAQ Section — Title",
      type: "string",
      initialValue: "Frequently Asked Questions",
    }),
    defineField({
      name: "ctaHeadline",
      title: "Final CTA — Headline",
      type: "string",
      initialValue: "Start selling coffee online today",
    }),
    defineField({
      name: "ctaDescription",
      title: "Final CTA — Description",
      type: "text",
      rows: 2,
      initialValue:
        "Create your account and explore the platform. No credit card required.",
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
      return { title: "Roaster Features Page" };
    },
  },
});
