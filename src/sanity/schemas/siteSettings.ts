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
      initialValue: "Ghost Roastery | White Label Coffee Roasting",
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
  ],
  preview: {
    prepare() {
      return {
        title: "Site Settings",
      };
    },
  },
});
