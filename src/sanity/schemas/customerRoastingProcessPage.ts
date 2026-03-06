import { defineType, defineField } from "sanity";

export const customerRoastingProcessPage = defineType({
  name: "customerRoastingProcessPage",
  title: "Customer Roasting Process Page",
  type: "document",
  fields: [
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "string",
      initialValue: "From green bean to perfect roast.",
    }),
    defineField({
      name: "heroSubheadline",
      title: "Hero Subheadline",
      type: "text",
      rows: 2,
      initialValue:
        "Specialty coffee is a craft. Here's how our partner roasters turn raw beans into something exceptional.",
    }),
    defineField({
      name: "stagesTitle",
      title: "Stages Section — Title",
      type: "string",
      initialValue: "The journey",
    }),
    defineField({
      name: "stages",
      title: "Stages",
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
              rows: 3,
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
      name: "ctaTitle",
      title: "CTA — Title",
      type: "string",
      initialValue: "Ready to start?",
    }),
    defineField({
      name: "ctaDescription",
      title: "CTA — Description",
      type: "text",
      rows: 2,
      initialValue:
        "Your brand, our roasting expertise. Build your coffee brand in minutes.",
    }),
    defineField({
      name: "ctaButtonText",
      title: "CTA — Button Text",
      type: "string",
      initialValue: "Build Your Brand",
    }),
    defineField({
      name: "ctaButtonHref",
      title: "CTA — Button Link",
      type: "string",
      initialValue: "/build",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Customer Roasting Process Page" };
    },
  },
});
