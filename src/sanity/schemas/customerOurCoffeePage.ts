import { defineType, defineField } from "sanity";

export const customerOurCoffeePage = defineType({
  name: "customerOurCoffeePage",
  title: "Customer Our Coffee Page",
  type: "document",
  fields: [
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "string",
      initialValue: "Specialty coffee, every time.",
    }),
    defineField({
      name: "heroSubheadline",
      title: "Hero Subheadline",
      type: "text",
      rows: 2,
      initialValue:
        "We only work with specialty-grade beans. Ethically sourced, small batch roasted, and packed fresh for your brand.",
    }),
    defineField({
      name: "highlightsTitle",
      title: "Highlights Section — Title",
      type: "string",
      initialValue: "What makes our coffee different",
    }),
    defineField({
      name: "highlights",
      title: "Highlights",
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
      initialValue: "Put your name on it",
    }),
    defineField({
      name: "ctaDescription",
      title: "CTA — Description",
      type: "text",
      rows: 2,
      initialValue:
        "Our coffee is ready for your brand. Design your label and we handle the rest.",
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
      return { title: "Customer Our Coffee Page" };
    },
  },
});
