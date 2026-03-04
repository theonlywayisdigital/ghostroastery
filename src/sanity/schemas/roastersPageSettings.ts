import { defineType, defineField } from "sanity";

export const roastersPageSettings = defineType({
  name: "roastersPageSettings",
  title: "Roasters Page Settings",
  type: "document",
  fields: [
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "string",
      description: "Main headline on the roasters homepage",
      initialValue: "Grow your roastery. We handle the rest.",
    }),
    defineField({
      name: "heroSubheadline",
      title: "Hero Subheadline",
      type: "text",
      rows: 2,
      description: "Supporting text below the headline",
      initialValue:
        "The all-in-one platform to sell online, manage wholesale, and scale your coffee business.",
    }),
    defineField({
      name: "heroCta",
      title: "Hero CTA Text",
      type: "string",
      initialValue: "Join the Platform",
    }),
    defineField({
      name: "platformHighlights",
      title: "Platform Highlights",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
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
              name: "icon",
              title: "Icon Name",
              type: "string",
              description: "Lucide icon name",
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "description",
            },
          },
        },
      ],
    }),
    defineField({
      name: "partnerProgramContent",
      title: "Partner Program Content",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                  },
                ],
              },
            ],
          },
        },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "pricingIntro",
      title: "Pricing Intro",
      type: "text",
      rows: 3,
      description: "Introductory text shown at the top of the pricing page",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Roasters Page Settings",
      };
    },
  },
});
