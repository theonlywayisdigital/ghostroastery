import { defineType, defineField } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      initialValue: "Your brand. Our roastery. Nobody needs to know.",
    }),
    defineField({
      name: "defaultSeoTitle",
      title: "Default SEO Title",
      type: "string",
      initialValue: "Ghost Roasting UK | White Label Coffee Roasting",
    }),
    defineField({
      name: "defaultSeoDescription",
      title: "Default SEO Description",
      type: "text",
      rows: 2,
      initialValue:
        "UK-based ghost roasting and white label coffee service. Launch your coffee brand with zero barriers.",
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram URL",
      type: "url",
    }),
    defineField({
      name: "linkedinUrl",
      title: "LinkedIn URL",
      type: "url",
    }),
    defineField({
      name: "tiktokUrl",
      title: "TikTok URL",
      type: "url",
    }),
    defineField({
      name: "contactEmail",
      title: "Contact Email",
      type: "string",
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: "adminEmail",
      title: "Admin Email",
      type: "string",
      description: "Email for order notifications",
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: "roasteryEmail",
      title: "Roastery Email",
      type: "string",
      description: "Email for roastery notifications",
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: "accentColour",
      title: "Accent Colour",
      type: "string",
      options: {
        list: [
          { title: "Amber", value: "amber" },
          { title: "Green", value: "green" },
        ],
      },
      initialValue: "amber",
    }),
    // Builder settings
    defineField({
      name: "minOrderQuantity",
      title: "Minimum Order Quantity",
      type: "number",
      description: "Minimum bags per order",
      initialValue: 25,
      validation: (Rule) => Rule.required().integer().positive(),
    }),
    defineField({
      name: "maxOrderQuantity",
      title: "Maximum Order Quantity",
      type: "number",
      description: "Maximum bags per order (before wholesale)",
      initialValue: 150,
      validation: (Rule) => Rule.required().integer().positive(),
    }),
    defineField({
      name: "wholesaleThreshold",
      title: "Wholesale Threshold",
      type: "number",
      description: "Quantity at which to show wholesale nudge",
      initialValue: 150,
      validation: (Rule) => Rule.required().integer().positive(),
    }),
    defineField({
      name: "turnaroundDays",
      title: "Turnaround Time",
      type: "string",
      description: "Shown on confirmation page e.g. '7–10 working days'",
      initialValue: "7–10 working days",
    }),
    defineField({
      name: "labelMakerUrl",
      title: "Label Maker Tool URL",
      type: "string",
      description: "URL to the label maker tool",
      initialValue: "/label-maker",
    }),
    // Builder step copy
    defineField({
      name: "builderCopy",
      title: "Builder Copy",
      type: "object",
      description: "Editable text for builder steps",
      fields: [
        { name: "step1Heading", title: "Step 1 (Size) Heading", type: "string", initialValue: "How much coffee per bag?" },
        { name: "step1Subheading", title: "Step 1 Subheading", type: "string" },
        { name: "step2Heading", title: "Step 2 (Colour) Heading", type: "string", initialValue: "Pick your bag colour." },
        { name: "step2Subheading", title: "Step 2 Subheading", type: "string", initialValue: "This is the base colour of your bag." },
        { name: "step3Heading", title: "Step 3 (Label) Heading", type: "string", initialValue: "Make it yours." },
        { name: "step3Subheading", title: "Step 3 Subheading", type: "string", initialValue: "Upload your label artwork." },
        { name: "step4Heading", title: "Step 4 (Flavour) Heading", type: "string", initialValue: "What does your coffee taste like?" },
        { name: "step4Subheading", title: "Step 4 Subheading", type: "string", initialValue: "This is the roast profile your beans will be roasted to." },
        { name: "step5Heading", title: "Step 5 (Grind) Heading", type: "string", initialValue: "How will your customers brew it?" },
        { name: "step5Subheading", title: "Step 5 Subheading", type: "string" },
        { name: "step6Heading", title: "Step 6 (Quantity) Heading", type: "string", initialValue: "How many bags do you need?" },
        { name: "step6Subheading", title: "Step 6 Subheading", type: "string" },
        { name: "step7Heading", title: "Step 7 (Summary) Heading", type: "string", initialValue: "Here's your order." },
        { name: "step7Subheading", title: "Step 7 Subheading", type: "string", initialValue: "Check everything looks right before checkout." },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Site Settings",
      };
    },
  },
});
