import { defineType, defineField } from "sanity";

// DEPRECATED: Bag sizes now managed in Supabase (bag_sizes table).
// This schema is kept so existing Sanity documents don't break the Studio.
// Do not use in new code.
export const bagSizes = defineType({
  name: "bagSizes",
  title: "Bag Sizes",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "e.g. 250g, 500g, 1kg",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "string",
      description: "e.g. Perfect for gifting and sampling",
      validation: (Rule) => Rule.required(),
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
      active: "isActive",
    },
    prepare({ title, subtitle, active }) {
      return {
        title: `${title}${active ? "" : " (Inactive)"}`,
        subtitle,
      };
    },
  },
});
