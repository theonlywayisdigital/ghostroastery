import { defineType, defineField } from "sanity";

export const roasterFeatureDetail = defineType({
  name: "roasterFeatureDetail",
  title: "Roaster Feature Details",
  type: "document",
  fields: [
    defineField({
      name: "feature",
      title: "Feature",
      type: "reference",
      to: [{ type: "roasterFeature" }],
      description: "Link to the parent roasterFeature document",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "suite",
      title: "Suite",
      type: "string",
      options: {
        list: [
          { title: "Sales Suite", value: "sales" },
          { title: "Marketing Suite", value: "marketing" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroDescription",
      title: "Hero Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "includedNote",
      title: "Included Note",
      type: "string",
      description: "e.g. 'Included free on every plan'",
      initialValue: "Included free on every plan",
    }),
    defineField({
      name: "benefits",
      title: "Benefits",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "screenshot",
      title: "Screenshot",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative text",
        },
      ],
    }),
    defineField({
      name: "benefitsTitle",
      title: "Benefits Section — Title",
      type: "string",
      initialValue: "What you get",
    }),
    defineField({
      name: "ctaHeadline",
      title: "CTA — Headline",
      type: "string",
    }),
    defineField({
      name: "ctaDescription",
      title: "CTA — Description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "ctaButtonText",
      title: "CTA — Button Text",
      type: "string",
      initialValue: "Get Started Free",
    }),
    defineField({
      name: "comingSoon",
      title: "Coming Soon",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "slug.current",
      subtitle: "suite",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Untitled",
        subtitle: subtitle === "sales" ? "Sales Suite" : "Marketing Suite",
      };
    },
  },
});
