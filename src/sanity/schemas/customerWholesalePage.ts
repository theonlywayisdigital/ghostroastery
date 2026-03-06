import { defineType, defineField } from "sanity";

export const customerWholesalePage = defineType({
  name: "customerWholesalePage",
  title: "Customer Wholesale Page",
  type: "document",
  fields: [
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "string",
      initialValue: "Coffee at scale. Your way.",
    }),
    defineField({
      name: "heroSubheadline",
      title: "Hero Subheadline",
      type: "text",
      rows: 2,
      initialValue:
        "For businesses that need volume, consistency and flexibility. 150+ bags per order. Branded or unbranded.",
    }),
    defineField({
      name: "businessTypesTitle",
      title: "Business Types Section — Title",
      type: "string",
      initialValue: "Who we work with",
    }),
    defineField({
      name: "businessTypes",
      title: "Business Types",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "icon",
              title: "Icon Name",
              type: "string",
              description: "Phosphor icon name",
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: "title" },
          },
        },
      ],
    }),
    defineField({
      name: "featuresTitle",
      title: "Features Section — Title",
      type: "string",
      initialValue: "What you get",
    }),
    defineField({
      name: "features",
      title: "Features",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "icon",
              title: "Icon Name",
              type: "string",
              description: "Phosphor icon name",
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: "title" },
          },
        },
      ],
    }),
    defineField({
      name: "formTitle",
      title: "Form Section — Title",
      type: "string",
      initialValue: "Tell us about your order",
    }),
    defineField({
      name: "formSubtitle",
      title: "Form Section — Subtitle",
      type: "string",
      initialValue:
        "Fill in the form below and we'll get back to you within 2 business days.",
    }),
    defineField({
      name: "faqTitle",
      title: "FAQ Section — Title",
      type: "string",
      initialValue: "Frequently asked questions",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Customer Wholesale Page" };
    },
  },
});
