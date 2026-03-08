import { defineType, defineField } from "sanity";

export const customerHomePage = defineType({
  name: "customerHomePage",
  title: "Customer Home Page",
  type: "document",
  fields: [
    // Hero
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "text",
      rows: 3,
      description: "Main hero headline (line breaks preserved)",
      initialValue: "Your brand.\nOur roasters.\nNobody needs to know.",
    }),
    defineField({
      name: "heroSubheadline",
      title: "Hero Subheadline",
      type: "text",
      rows: 2,
      initialValue:
        "Ghost roasted, packed and shipped across the UK. Your name on every bag.",
    }),
    defineField({
      name: "heroPrimaryCta",
      title: "Hero Primary CTA",
      type: "string",
      initialValue: "Build Your Brand",
    }),
    defineField({
      name: "heroPrimaryCtaHref",
      title: "Hero Primary CTA Link",
      type: "string",
      initialValue: "/build",
    }),
    defineField({
      name: "heroSecondaryCta",
      title: "Hero Secondary CTA",
      type: "string",
      initialValue: "Wholesale Enquiry",
    }),
    defineField({
      name: "heroSecondaryCtaHref",
      title: "Hero Secondary CTA Link",
      type: "string",
      initialValue: "/wholesale",
    }),

    // How It Works
    defineField({
      name: "howItWorksTitle",
      title: "How It Works — Section Title",
      type: "string",
      initialValue: "From idea to shelf in four steps",
    }),
    defineField({
      name: "howItWorksSteps",
      title: "How It Works — Steps",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "number",
              title: "Step Number",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "icon",
              title: "Icon Name",
              type: "string",
              description: "Phosphor icon name (e.g. 'Palette', 'Tag', 'Fire', 'Truck')",
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
            select: { title: "title", subtitle: "number" },
          },
        },
      ],
    }),

    // Trust Signals
    defineField({
      name: "trustSignals",
      title: "Trust Signals",
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
              name: "label",
              title: "Label",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: "label" },
          },
        },
      ],
    }),

    // Product Paths
    defineField({
      name: "productPathsTitle",
      title: "Product Paths — Section Title",
      type: "string",
      initialValue: "Two ways to work with us",
    }),
    defineField({
      name: "productPaths",
      title: "Product Paths",
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
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "features",
              title: "Feature Bullets",
              type: "array",
              of: [{ type: "string" }],
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
              title: "Variant",
              type: "string",
              options: {
                list: [
                  { title: "Primary", value: "primary" },
                  { title: "Secondary", value: "secondary" },
                ],
              },
            }),
          ],
          preview: {
            select: { title: "title" },
          },
        },
      ],
    }),

    // Pricing Section Copy
    defineField({
      name: "pricingSectionTitle",
      title: "Pricing Section — Title",
      type: "string",
      initialValue: "Transparent pricing. No surprises.",
    }),
    defineField({
      name: "pricingSectionSubtitle",
      title: "Pricing Section — Subtitle",
      type: "string",
      initialValue:
        "Prices include roasting, packing and labelling. Shipping calculated at checkout.",
    }),
    defineField({
      name: "pricingSectionFootnote",
      title: "Pricing Section — Footnote",
      type: "string",
      initialValue: "Need 100+ bags? Check out our wholesale pricing.",
    }),
    defineField({
      name: "pricingSectionCta",
      title: "Pricing Section — CTA Text",
      type: "string",
      initialValue: "Start Your Order",
    }),

    // Case Study Section Copy
    defineField({
      name: "caseStudySectionTitle",
      title: "Case Study Section — Title",
      type: "string",
      initialValue: "Built with Ghost Roastery",
    }),

    // Final CTA
    defineField({
      name: "finalCtaHeadline",
      title: "Final CTA — Headline",
      type: "string",
      initialValue: "Ready to launch your coffee brand?",
    }),
    defineField({
      name: "finalCtaPrimaryCta",
      title: "Final CTA — Primary Button Text",
      type: "string",
      initialValue: "Build Your Brand",
    }),
    defineField({
      name: "finalCtaPrimaryHref",
      title: "Final CTA — Primary Button Link",
      type: "string",
      initialValue: "/build",
    }),
    defineField({
      name: "finalCtaSecondaryCta",
      title: "Final CTA — Secondary Button Text",
      type: "string",
      initialValue: "Get in Touch",
    }),
    defineField({
      name: "finalCtaSecondaryHref",
      title: "Final CTA — Secondary Button Link",
      type: "string",
      initialValue: "/contact",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Customer Home Page" };
    },
  },
});
