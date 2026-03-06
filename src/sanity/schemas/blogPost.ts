import { defineType, defineField } from "sanity";

export const blogPost = defineType({
  name: "blogPost",
  title: "Blog Posts",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      description: "Used in listing and meta description",
      rows: 3,
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "H4", value: "h4" },
            { title: "Quote", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
              { title: "Underline", value: "underline" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                    validation: (Rule) =>
                      Rule.uri({
                        scheme: ["http", "https", "mailto", "tel"],
                        allowRelative: true,
                      }),
                  },
                ],
              },
            ],
          },
        },
        {
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
              description: "Important for SEO and accessibility",
            },
            {
              name: "caption",
              type: "string",
              title: "Caption",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Industry Insights", value: "industry" },
          { title: "How-To Guides", value: "guides" },
          { title: "Business Tips", value: "business" },
          { title: "Coffee Knowledge", value: "coffee" },
        ],
      },
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
      initialValue: "Ghost Roastery",
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "featuredImage",
      title: "Featured Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative text",
        },
      ],
    }),
    defineField({
      name: "audience",
      title: "Audience",
      type: "string",
      description: "Which site(s) should display this post",
      options: {
        list: [
          { title: "Consumer Site", value: "consumer" },
          { title: "Roasters Site", value: "roaster" },
          { title: "Both", value: "both" },
        ],
      },
      initialValue: "both",
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      description: "Overrides title for search engines",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      description: "Meta description for search engines",
      rows: 2,
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: "funnelStage",
      title: "Funnel Stage",
      type: "string",
      options: {
        list: [
          { title: "Top of Funnel (Awareness)", value: "tofu" },
          { title: "Middle of Funnel (Consideration)", value: "mofu" },
          { title: "Bottom of Funnel (Decision)", value: "bofu" },
        ],
      },
    }),
    defineField({
      name: "campaign",
      title: "Campaign",
      type: "string",
      options: {
        list: [
          { title: "Brand Builder", value: "brand-builder" },
          { title: "Wholesale", value: "wholesale" },
          { title: "General", value: "general" },
        ],
      },
    }),
    defineField({
      name: "targetKeyword",
      title: "Target Keyword",
      type: "string",
      description: "Primary keyword this post targets",
    }),
    defineField({
      name: "ctaType",
      title: "CTA Type",
      type: "string",
      options: {
        list: [
          { title: "Build Your Brand \u2192", value: "build" },
          { title: "Wholesale Enquiry \u2192", value: "wholesale" },
          { title: "Learn More \u2192", value: "learn" },
        ],
      },
    }),
    defineField({
      name: "ctaUrl",
      title: "CTA URL",
      type: "string",
      description: "Override CTA destination (defaults based on ctaType)",
    }),
  ],
  preview: {
    select: {
      title: "title",
      author: "author",
      media: "featuredImage",
      date: "publishedAt",
      funnelStage: "funnelStage",
      campaign: "campaign",
    },
    prepare({ title, author, media, date, funnelStage, campaign }) {
      const parts = [author];
      if (funnelStage) parts.push(funnelStage.toUpperCase());
      if (campaign) parts.push(campaign);
      parts.push(date ? new Date(date).toLocaleDateString() : "Draft");
      return {
        title,
        subtitle: parts.join(" \u2022 "),
        media,
      };
    },
  },
  orderings: [
    {
      title: "Published Date, New",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
});
