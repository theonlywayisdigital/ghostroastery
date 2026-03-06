import { defineType, defineField } from "sanity";

export const customerAboutPage = defineType({
  name: "customerAboutPage",
  title: "Customer About Page",
  type: "document",
  fields: [
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "string",
      initialValue: "Specialty coffee. Ghost roasted.",
    }),
    defineField({
      name: "heroSubheadline",
      title: "Hero Subheadline",
      type: "text",
      rows: 2,
      initialValue:
        "We're a UK-based ghost roasting service helping businesses launch and grow their own coffee brands.",
    }),
    defineField({
      name: "storyTitle",
      title: "Story Section — Title",
      type: "string",
      initialValue: "Why we built this",
    }),
    defineField({
      name: "storyBody",
      title: "Story Section — Body",
      type: "array",
      of: [
        {
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
          },
        },
      ],
    }),
    defineField({
      name: "valuesTitle",
      title: "Values Section — Title",
      type: "string",
      initialValue: "What we stand for",
    }),
    defineField({
      name: "values",
      title: "Values",
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
      name: "proofCtaTitle",
      title: "Proof CTA — Title",
      type: "string",
      initialValue: "Want to see the proof?",
    }),
    defineField({
      name: "proofCtaDescription",
      title: "Proof CTA — Description",
      type: "text",
      rows: 2,
      initialValue:
        "Off Your Bean is our own coffee brand, built using the exact same service we offer you. From concept to live store in under two weeks.",
    }),
    defineField({
      name: "proofCtaButtonText",
      title: "Proof CTA — Button Text",
      type: "string",
      initialValue: "See the case study",
    }),
    defineField({
      name: "proofCtaButtonHref",
      title: "Proof CTA — Button Link",
      type: "string",
      initialValue: "/brands/off-your-bean",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Customer About Page" };
    },
  },
});
