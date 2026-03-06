import { defineType, defineField } from "sanity";

export const customerSupportPage = defineType({
  name: "customerSupportPage",
  title: "Customer Support Page",
  type: "document",
  fields: [
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "string",
      initialValue: "How can we help?",
    }),
    defineField({
      name: "heroSubheadline",
      title: "Hero Subheadline",
      type: "text",
      rows: 2,
      initialValue:
        "Whether it's about your order, your brand, or just a question — we're here for you.",
    }),
    defineField({
      name: "optionsTitle",
      title: "Options Section — Title",
      type: "string",
      initialValue: "Get in touch",
    }),
    defineField({
      name: "supportOptions",
      title: "Support Options",
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
              type: "text",
              rows: 2,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "cta",
              title: "CTA Text",
              type: "string",
            }),
            defineField({
              name: "href",
              title: "CTA Link",
              type: "string",
            }),
            defineField({
              name: "disabled",
              title: "Disabled (Coming Soon)",
              type: "boolean",
              initialValue: false,
            }),
          ],
          preview: {
            select: { title: "title" },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Customer Support Page" };
    },
  },
});
