import { defineType, defineField } from "sanity";

export const bagColours = defineType({
  name: "bagColours",
  title: "Bag Colours",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "e.g. Black Matt",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "hex",
      title: "Hex Code",
      type: "string",
      description: "Hex colour for swatch display e.g. #1A1A1A",
      validation: (Rule) =>
        Rule.required().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
          name: "hex color",
          invert: false,
        }),
    }),
    defineField({
      name: "bagPhoto",
      title: "Bag Photo",
      type: "image",
      description: "The product photo for this bag colour (use same angle/position for all colours)",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "actualBagPhoto",
      title: "Actual Bag Photo",
      type: "image",
      description: "Photo of the real bag (without label) to show customers the actual finish",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      description: "Controls display order in the builder",
      validation: (Rule) => Rule.required().integer().positive(),
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      description: "Toggle on/off without deleting",
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
      hex: "hex",
      media: "bagPhoto",
      active: "isActive",
    },
    prepare({ title, hex, media, active }) {
      return {
        title: `${title}${active ? "" : " (Inactive)"}`,
        subtitle: hex,
        media,
      };
    },
  },
});
