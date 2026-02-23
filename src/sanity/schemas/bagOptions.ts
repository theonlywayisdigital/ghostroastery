import { defineType, defineField } from "sanity";

export const bagOptions = defineType({
  name: "bagOptions",
  title: "Bag Options",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "e.g. Flat Bottom Pouch",
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
      name: "description",
      title: "Description",
      type: "string",
      description: "Short description for the builder card",
    }),
    defineField({
      name: "image",
      title: "Product Image",
      type: "image",
      description: "Product illustration for the bag style",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "availableSizes",
      title: "Available Sizes",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "250g", value: "250g" },
          { title: "500g", value: "500g" },
          { title: "1kg", value: "1kg" },
        ],
      },
      initialValue: ["250g", "500g", "1kg"],
    }),
    defineField({
      name: "colours",
      title: "Available Colours",
      type: "array",
      of: [
        {
          type: "object",
          name: "colour",
          fields: [
            defineField({
              name: "name",
              title: "Colour Name",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "hex",
              title: "Hex Code",
              type: "string",
              description: "e.g. #000000",
              validation: (Rule) =>
                Rule.required().regex(
                  /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
                  { name: "hex color", invert: false }
                ),
            }),
          ],
          preview: {
            select: {
              title: "name",
              hex: "hex",
            },
            prepare({ title, hex }) {
              return {
                title: title,
                subtitle: hex,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "labelWidth",
      title: "Label Width (mm)",
      type: "number",
      description: "Label width in millimeters",
      validation: (Rule) => Rule.positive(),
    }),
    defineField({
      name: "labelHeight",
      title: "Label Height (mm)",
      type: "number",
      description: "Label height in millimeters",
      validation: (Rule) => Rule.positive(),
    }),
    defineField({
      name: "labelBleed",
      title: "Label Bleed (mm)",
      type: "number",
      description: "Required bleed in millimeters",
      initialValue: 3,
    }),
    defineField({
      name: "labelOrientation",
      title: "Label Orientation",
      type: "string",
      options: {
        list: [
          { title: "Landscape", value: "landscape" },
          { title: "Portrait", value: "portrait" },
        ],
      },
      initialValue: "landscape",
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "image",
    },
  },
});
