import { defineType, defineField } from "sanity";

export const svgElement = defineType({
  name: "svgElement",
  title: "SVG Elements",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "Element name shown in the library",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Coffee", value: "coffee" },
          { title: "Borders", value: "borders" },
          { title: "Dividers", value: "dividers" },
          { title: "Badges", value: "badges" },
          { title: "Shapes", value: "shapes" },
          { title: "Icons", value: "icons" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "svgMarkup",
      title: "SVG Markup",
      type: "text",
      description: "Raw SVG markup. Paste the full <svg>...</svg> content.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail",
      type: "image",
      description: "Optional preview image. If not set, the SVG will render inline.",
      options: { hotspot: true },
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
      title: "Category then Sort Order",
      name: "categorySortOrder",
      by: [
        { field: "category", direction: "asc" },
        { field: "sortOrder", direction: "asc" },
      ],
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
