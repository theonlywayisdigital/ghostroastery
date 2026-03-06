import { defineType, defineField } from "sanity";

export const customerHowItWorksPage = defineType({
  name: "customerHowItWorksPage",
  title: "Customer How It Works Page",
  type: "document",
  fields: [
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "string",
      initialValue: "Three steps to your own coffee brand.",
    }),
    defineField({
      name: "heroSubheadline",
      title: "Hero Subheadline",
      type: "text",
      rows: 2,
      initialValue:
        "No roastery needed. No minimum experience. Just your brand on a bag of specialty coffee.",
    }),
    defineField({
      name: "stepsTitle",
      title: "Steps Section — Title",
      type: "string",
      initialValue: "The process",
    }),
    defineField({
      name: "steps",
      title: "Steps",
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
              name: "step",
              title: "Step Number",
              type: "string",
              validation: (Rule) => Rule.required(),
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
            select: { title: "title", subtitle: "step" },
          },
        },
      ],
    }),
    defineField({
      name: "ctaTitle",
      title: "CTA — Title",
      type: "string",
      initialValue: "Ready to get started?",
    }),
    defineField({
      name: "ctaDescription",
      title: "CTA — Description",
      type: "text",
      rows: 2,
      initialValue:
        "Build your brand in minutes and receive your first order in 7-10 working days.",
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
      return { title: "Customer How It Works Page" };
    },
  },
});
