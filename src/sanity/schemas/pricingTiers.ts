import { defineType, defineField } from "sanity";

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
          { title: "1kg", value: "1kg" },
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
      title: "Price per bag (50-99 units)",
      type: "number",
      description: "Price in GBP",
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: "tier_100_150",
      title: "Price per bag (100-150 units)",
      type: "number",
      description: "Price in GBP",
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
