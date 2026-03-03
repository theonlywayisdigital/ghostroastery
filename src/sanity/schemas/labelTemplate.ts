import { defineType, defineField } from "sanity";

export const labelTemplate = defineType({
  name: "labelTemplate",
  title: "Label Templates",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "Template name shown in the picker",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Minimal", value: "minimal" },
          { title: "Classic", value: "classic" },
          { title: "Modern", value: "modern" },
          { title: "Bold", value: "bold" },
          { title: "Artisan", value: "artisan" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail",
      type: "image",
      description: "Preview image shown in the template picker",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "canvasJSON",
      title: "Canvas JSON",
      type: "text",
      description:
        "Fabric.js canvas JSON exported from the label maker. Paste the full JSON here.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "bagType",
      title: "Bag Type",
      type: "reference",
      to: [{ type: "bagOptions" }],
      description:
        "Which bag type this template is designed for. Leave blank for universal templates.",
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: "Sort Order",
      name: "sortOrderAsc",
      by: [{ field: "sortOrder", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category",
      media: "thumbnail",
      active: "isActive",
    },
    prepare({ title, subtitle, media, active }) {
      return {
        title: `${title}${active ? "" : " (Inactive)"}`,
        subtitle: subtitle
          ? subtitle.charAt(0).toUpperCase() + subtitle.slice(1)
          : "",
        media,
      };
    },
  },
});
