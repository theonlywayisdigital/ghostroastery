import { defineType, defineField } from "sanity";

export const roasterPartnerProgramPage = defineType({
  name: "roasterPartnerProgramPage",
  title: "Roaster Partner Program Page",
  type: "document",
  fields: [
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "string",
      initialValue: "Ghost Roaster",
    }),
    defineField({
      name: "heroAccentText",
      title: "Hero Accent Text",
      type: "string",
      description: "Highlighted text that appears after the headline",
      initialValue: "Partner Programme",
    }),
    defineField({
      name: "heroSubheadline",
      title: "Hero Subheadline",
      type: "text",
      rows: 2,
      initialValue:
        "We bring the orders. You bring the craft. A partnership that fills your roaster and grows your business.",
    }),
    defineField({
      name: "heroCtaText",
      title: "Hero CTA Text",
      type: "string",
      initialValue: "Apply Now",
    }),
    defineField({
      name: "stepsTitle",
      title: "Steps Section — Title",
      type: "string",
      initialValue: "How it works",
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
              rows: 2,
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
      name: "benefitsTitle",
      title: "Benefits Section — Title",
      type: "string",
      initialValue: "Why partner with us",
    }),
    defineField({
      name: "benefits",
      title: "Benefits",
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
      name: "requirementsTitle",
      title: "Requirements Section — Title",
      type: "string",
      initialValue: "Requirements",
    }),
    defineField({
      name: "requirements",
      title: "Requirements",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "additionalContent",
      title: "Additional Content",
      type: "array",
      description: "Optional rich text content displayed above the requirements section",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "ctaHeadline",
      title: "Final CTA — Headline",
      type: "string",
      initialValue: "Ready to become a Ghost Roaster?",
    }),
    defineField({
      name: "ctaDescription",
      title: "Final CTA — Description",
      type: "text",
      rows: 2,
      initialValue:
        "Apply today and start receiving orders within the week. No upfront costs, no risk.",
    }),
    defineField({
      name: "ctaButtonText",
      title: "Final CTA — Button Text",
      type: "string",
      initialValue: "Apply Now",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Roaster Partner Program Page" };
    },
  },
});
