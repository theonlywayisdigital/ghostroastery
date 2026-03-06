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
              description: "Phosphor icon name",
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

    // ── Homepage Sections ──────────────────────────────────────
    defineField({
      name: "videoSectionTitle",
      title: "Video Section — Title",
      type: "string",
      initialValue: "See the platform in action",
    }),
    defineField({
      name: "videoSectionSubtitle",
      title: "Video Section — Subtitle",
      type: "string",
      initialValue: "2 minute overview",
    }),
    defineField({
      name: "ctaStrip1Headline",
      title: "CTA Strip #1 — Headline",
      type: "string",
      initialValue: "Everything you need to sell coffee online",
    }),
    defineField({
      name: "ctaStrip1Subtitle",
      title: "CTA Strip #1 — Subtitle",
      type: "string",
      initialValue:
        "No monthly fees. No commission on storefront sales. Free forever.",
    }),
    defineField({
      name: "toolsSectionTitle",
      title: "Tools Section — Title",
      type: "string",
      initialValue: "Powerful tools for modern roasters",
    }),
    defineField({
      name: "toolsSectionSubtitle",
      title: "Tools Section — Accent Text",
      type: "string",
      initialValue: "modern roasters",
    }),
    defineField({
      name: "toolsSectionDescription",
      title: "Tools Section — Description",
      type: "string",
      initialValue:
        "Everything you need to sell coffee and grow your brand — in one platform.",
    }),
    defineField({
      name: "ctaStrip2Headline",
      title: "CTA Strip #2 — Headline",
      type: "string",
      initialValue: "Ready to grow your roastery?",
    }),
    defineField({
      name: "ctaStrip2Subtitle",
      title: "CTA Strip #2 — Subtitle",
      type: "string",
      initialValue:
        "Join hundreds of roasters already selling more coffee with less effort.",
    }),
    defineField({
      name: "caseStudiesSectionTitle",
      title: "Case Studies Section — Title",
      type: "string",
      initialValue: "Roaster success stories",
    }),
    defineField({
      name: "caseStudiesSectionSubtitle",
      title: "Case Studies Section — Subtitle",
      type: "string",
      initialValue:
        "See how roasters are growing their businesses with Ghost Roastery Platform.",
    }),
    defineField({
      name: "blogSectionTitle",
      title: "Blog Section — Title",
      type: "string",
      initialValue: "Latest from the blog",
    }),
    defineField({
      name: "blogSectionSubtitle",
      title: "Blog Section — Subtitle",
      type: "string",
      initialValue:
        "Tips, guides, and industry insights to help you sell more coffee.",
    }),
    defineField({
      name: "partnerSectionLabel",
      title: "Partner Section — Label",
      type: "string",
      initialValue: "Partner Program",
    }),
    defineField({
      name: "partnerSectionTitle",
      title: "Partner Section — Title",
      type: "string",
      initialValue: "Earn more by roasting for other brands",
    }),
    defineField({
      name: "partnerSectionSubtitle",
      title: "Partner Section — Subtitle",
      type: "text",
      rows: 2,
      initialValue:
        "Join our ghost roasting network. We send you the orders — you roast and ship. Guaranteed volume, zero marketing overhead.",
    }),
    defineField({
      name: "partnerSteps",
      title: "Partner Section — Steps",
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
            select: { title: "title", subtitle: "step" },
          },
        },
      ],
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
