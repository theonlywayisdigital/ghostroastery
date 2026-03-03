import { defineType, defineField } from "sanity";

// DEPRECATED: Pricing is now managed via dynamic brackets in Supabase
// (pricing_tier_brackets + pricing_tier_prices tables).
// This schema is kept so existing Sanity documents don't break the Studio.
// Do not use in new code.
export const pricingTiers = defineType({
  name: "pricingTiers",
  title: "Pricing Tiers",
  type: "document",
  fields: [
    defineField({
      name: "bagSize",
      title: "Bag Size",
      type: "string",
      options: {
        list: [
          { title: "250g", value: "250g" },
          { title: "500g", value: "500g" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tier_10_24",
      title: "Price per bag (10-24 units)",
      type: "number",
      description: "Price in GBP",
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: "tier_25_49",
      title: "Price per bag (25-49 units)",
      type: "number",
      description: "Price in GBP",
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: "tier_50_99",
      title: "Price per bag (50–74 units)",
      type: "number",
      description: "Price in GBP — applied when ordering 50–74 bags",
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: "tier_100_150",
      title: "Price per bag (75–99 units)",
      type: "number",
      description: "Price in GBP — best value tier, applied when ordering 75–99 bags",
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: "shippingCost",
      title: "Shipping Cost",
      type: "number",
      description: "Shipping cost in GBP (0 for free shipping)",
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: "bagSize",
      tier1: "tier_10_24",
    },
    prepare({ title, tier1 }) {
      return {
        title: `${title} Pricing`,
        subtitle: `From £${tier1}/bag`,
      };
    },
  },
});
