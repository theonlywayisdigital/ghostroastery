import { defineType, defineField } from "sanity";

export const customerBlogSettings = defineType({
  name: "customerBlogSettings",
  title: "Customer Blog Settings",
  type: "document",
  fields: [
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "string",
      initialValue: "The Ghost Roastery Blog.",
    }),
    defineField({
      name: "heroSubheadline",
      title: "Hero Subheadline",
      type: "text",
      rows: 2,
      initialValue:
        "Tips, guides, and insights on building a coffee brand, white labelling, and the specialty coffee industry.",
    }),
    defineField({
      name: "latestPostsTitle",
      title: "Latest Posts — Section Title",
      type: "string",
      initialValue: "Latest posts",
    }),
    defineField({
      name: "emptyStateMessage",
      title: "Empty State Message",
      type: "text",
      rows: 2,
      initialValue:
        "We're working on our first articles. Check back soon for guides on launching your coffee brand, marketing tips, and industry news.",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Customer Blog Settings" };
    },
  },
});
