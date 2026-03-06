import { defineType, defineField } from "sanity";

export const customerContactPage = defineType({
  name: "customerContactPage",
  title: "Customer Contact Page",
  type: "document",
  fields: [
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "string",
      initialValue: "Get in touch",
    }),
    defineField({
      name: "heroSubheadline",
      title: "Hero Subheadline",
      type: "text",
      rows: 2,
      initialValue:
        "Not sure which service is right for you? Drop us a message and we'll point you in the right direction.",
    }),
    defineField({
      name: "pathCards",
      title: "Path Cards",
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
            defineField({
              name: "ctaText",
              title: "CTA Text",
              type: "string",
            }),
            defineField({
              name: "ctaHref",
              title: "CTA Link",
              type: "string",
            }),
            defineField({
              name: "variant",
              title: "Button Variant",
              type: "string",
              options: {
                list: [
                  { title: "Primary", value: "primary" },
                  { title: "Outline", value: "outline" },
                ],
              },
              initialValue: "primary",
            }),
          ],
          preview: {
            select: { title: "title" },
          },
        },
      ],
    }),
    defineField({
      name: "pathCardsFootnote",
      title: "Path Cards — Footnote",
      type: "string",
      initialValue: "Or fill in the form below for anything else",
    }),
    defineField({
      name: "formTitle",
      title: "Form Section — Title",
      type: "string",
      initialValue: "Send us a message",
    }),
    defineField({
      name: "formSubtitle",
      title: "Form Section — Subtitle",
      type: "string",
      initialValue: "We typically respond within 1-2 business days.",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Customer Contact Page" };
    },
  },
});
