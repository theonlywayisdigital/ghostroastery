import { defineType, defineField } from "sanity";

export const builderSettings = defineType({
  name: "builderSettings",
  title: "Builder Settings",
  type: "document",
  fieldsets: [
    { name: "orderLimits", title: "Order Limits" },
    { name: "general", title: "General" },
    { name: "stepCopy", title: "Step Copy", options: { collapsible: true } },
  ],
  fields: [
    // Order Limits
    // DEPRECATED: minOrderQuantity is now derived from the lowest pricing_tier_brackets.min_quantity.
    // This field is kept for Sanity Studio compatibility but is no longer used by the application.
    defineField({
      name: "minOrderQuantity",
      title: "Minimum Order Quantity (Deprecated)",
      type: "number",
      fieldset: "orderLimits",
      description: "DEPRECATED — now derived from pricing brackets. Do not edit.",
      initialValue: 10,
      validation: (Rule) => Rule.required().integer().positive(),
    }),
    defineField({
      name: "maxOrderQuantity",
      title: "Maximum Order Quantity",
      type: "number",
      fieldset: "orderLimits",
      description: "Maximum bags per order (before wholesale)",
      initialValue: 99,
      validation: (Rule) => Rule.required().integer().positive(),
    }),
    defineField({
      name: "wholesaleThreshold",
      title: "Wholesale Threshold",
      type: "number",
      fieldset: "orderLimits",
      description: "Quantity at which to show wholesale nudge",
      initialValue: 99,
      validation: (Rule) => Rule.required().integer().positive(),
    }),

    // General
    defineField({
      name: "turnaroundDays",
      title: "Turnaround Time",
      type: "string",
      fieldset: "general",
      description: "Shown on confirmation page e.g. '7–10 working days'",
      initialValue: "7–10 working days",
    }),
    defineField({
      name: "labelMakerUrl",
      title: "Label Maker Tool URL",
      type: "string",
      fieldset: "general",
      description: "URL to the label maker tool",
      initialValue: "/label-maker",
    }),

    // Step Copy
    defineField({
      name: "step1Heading",
      title: "Step 1 (Size) Heading",
      type: "string",
      fieldset: "stepCopy",
      initialValue: "How much coffee per bag?",
    }),
    defineField({
      name: "step1Subheading",
      title: "Step 1 Subheading",
      type: "string",
      fieldset: "stepCopy",
    }),
    defineField({
      name: "step2Heading",
      title: "Step 2 (Colour) Heading",
      type: "string",
      fieldset: "stepCopy",
      initialValue: "Pick your bag colour.",
    }),
    defineField({
      name: "step2Subheading",
      title: "Step 2 Subheading",
      type: "string",
      fieldset: "stepCopy",
      initialValue: "This is the base colour of your bag.",
    }),
    defineField({
      name: "step3Heading",
      title: "Step 3 (Label) Heading",
      type: "string",
      fieldset: "stepCopy",
      initialValue: "Make it yours.",
    }),
    defineField({
      name: "step3Subheading",
      title: "Step 3 Subheading",
      type: "string",
      fieldset: "stepCopy",
      initialValue: "Upload your label artwork.",
    }),
    defineField({
      name: "step4Heading",
      title: "Step 4 (Flavour) Heading",
      type: "string",
      fieldset: "stepCopy",
      initialValue: "What does your coffee taste like?",
    }),
    defineField({
      name: "step4Subheading",
      title: "Step 4 Subheading",
      type: "string",
      fieldset: "stepCopy",
      initialValue: "This is the roast profile your beans will be roasted to.",
    }),
    defineField({
      name: "step5Heading",
      title: "Step 5 (Grind) Heading",
      type: "string",
      fieldset: "stepCopy",
      initialValue: "How will your customers brew it?",
    }),
    defineField({
      name: "step5Subheading",
      title: "Step 5 Subheading",
      type: "string",
      fieldset: "stepCopy",
    }),
    defineField({
      name: "step6Heading",
      title: "Step 6 (Quantity) Heading",
      type: "string",
      fieldset: "stepCopy",
      initialValue: "How many bags do you need?",
    }),
    defineField({
      name: "step6Subheading",
      title: "Step 6 Subheading",
      type: "string",
      fieldset: "stepCopy",
    }),
    defineField({
      name: "step7Heading",
      title: "Step 7 (Summary) Heading",
      type: "string",
      fieldset: "stepCopy",
      initialValue: "Here's your order.",
    }),
    defineField({
      name: "step7Subheading",
      title: "Step 7 Subheading",
      type: "string",
      fieldset: "stepCopy",
      initialValue: "Check everything looks right before checkout.",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Builder Settings",
      };
    },
  },
});
