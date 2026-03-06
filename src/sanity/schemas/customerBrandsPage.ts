import { defineType, defineField } from "sanity";

export const customerBrandsPage = defineType({
  name: "customerBrandsPage",
  title: "Customer Brands Page",
  type: "document",
  fields: [
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "string",
      initialValue: "Brands built with Ghost Roastery.",
    }),
    defineField({
      name: "heroSubheadline",
      title: "Hero Subheadline",
      type: "text",
      rows: 2,
      initialValue:
        "Real brands, real customers — all powered by our ghost roasting service. See what's possible.",
    }),
    defineField({
      name: "placeholderTitle",
      title: "Placeholder Section — Title",
      type: "string",
      initialValue: "Our brand partners",
    }),
    defineField({
      name: "placeholderCopy",
      title: "Placeholder Section — Copy",
      type: "text",
      rows: 3,
      initialValue:
        "We're currently onboarding our first wave of brand partners. Check back soon to see their stories, or start building your own brand today.",
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
      return { title: "Customer Brands Page" };
    },
  },
});
