import { defineType, defineField } from "sanity";

// DEPRECATED: Roast profiles now managed in Supabase (roast_profiles table).
// This schema is kept so existing Sanity documents don't break the Studio.
// Do not use in new code.
export const roastProfiles = defineType({
  name: "roastProfiles",
  title: "Roast Profiles",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "e.g. Light Roast",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "descriptor",
      title: "Descriptor",
      type: "string",
      description: "e.g. Fruity & Bright",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tastingNotes",
      title: "Tasting Notes",
      type: "string",
      description: "e.g. Floral, citrus, tea-like finish",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "roastLevel",
      title: "Roast Level",
      type: "number",
      description: "1-4 (used to render roast indicator bars)",
      validation: (Rule) => Rule.required().integer().min(1).max(4),
    }),
    defineField({
      name: "isDecaf",
      title: "Is Decaf",
      type: "boolean",
      description: "Is this a decaf option?",
      initialValue: false,
    }),
    defineField({
      name: "badge",
      title: "Badge",
      type: "string",
      description: "Optional badge text e.g. DECAF",
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
    defineField({
      name: "image",
      title: "Card Image",
      type: "image",
      description: "Visual card background for the builder",
      options: {
        hotspot: true,
      },
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
      subtitle: "tastingNotes",
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
