import { defineType, defineField } from "sanity";

// DEPRECATED: Grind options now managed in Supabase (grind_options table).
// This schema is kept so existing Sanity documents don't break the Studio.
// Do not use in new code.
export const grindOptions = defineType({
  name: "grindOptions",
  title: "Grind Options",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "e.g. Espresso, Whole Bean",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "string",
      description: "e.g. For espresso machines and moka pots",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      description: "Visual icon/image for this grind option (square recommended)",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "icon",
      title: "Icon (legacy)",
      type: "string",
      description: "Icon name from Lucide (deprecated - use image instead)",
      hidden: true,
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
      subtitle: "description",
      media: "image",
      active: "isActive",
    },
    prepare({ title, subtitle, media, active }) {
      return {
        title: `${title}${active ? "" : " (Inactive)"}`,
        subtitle,
        media,
      };
    },
  },
});
