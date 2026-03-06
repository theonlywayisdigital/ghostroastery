import { defineType, defineField } from "sanity";

export const roasterProductsCarousel = defineType({
  name: "roasterProductsCarousel",
  title: "Roaster Products Carousel",
  type: "document",
  fields: [
    defineField({
      name: "suites",
      title: "Suites",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "key",
              title: "Key",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "tagline",
              title: "Tagline",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "features",
              title: "Features",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({
                      name: "icon",
                      title: "Icon Name",
                      type: "string",
                      description: "Phosphor icon name",
                    }),
                    defineField({
                      name: "title",
                      title: "Title",
                      type: "string",
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: "description",
                      title: "Description",
                      type: "string",
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: "href",
                      title: "Link",
                      type: "string",
                    }),
                  ],
                  preview: {
                    select: { title: "title" },
                  },
                },
              ],
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "tagline" },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Roaster Products Carousel" };
    },
  },
});
