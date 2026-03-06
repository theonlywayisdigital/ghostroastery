import { defineType, defineField } from "sanity";

export const customerPartnersPage = defineType({
  name: "customerPartnersPage",
  title: "Customer Partners Page",
  type: "document",
  fields: [
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "string",
      initialValue: "The roasters behind the scenes.",
    }),
    defineField({
      name: "heroSubheadline",
      title: "Hero Subheadline",
      type: "text",
      rows: 2,
      initialValue:
        "Every bag of Ghost Roastery coffee is roasted by experienced specialty roasters. Here's who makes it happen.",
    }),
    defineField({
      name: "sectionTitle",
      title: "Section Title",
      type: "string",
      initialValue: "Our roasting partners",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      initialValue:
        "Our partner roasters are handpicked for their commitment to quality, consistency, and specialty-grade standards. They roast in small batches, source ethically, and treat every order with care.",
    }),
    defineField({
      name: "placeholderNote",
      title: "Placeholder Note",
      type: "text",
      rows: 2,
      initialValue:
        "Partner profiles coming soon. In the meantime, learn more about our roasting standards.",
    }),
    defineField({
      name: "ctaButtonText",
      title: "CTA — Button Text",
      type: "string",
      initialValue: "The Roasting Process",
    }),
    defineField({
      name: "ctaButtonHref",
      title: "CTA — Button Link",
      type: "string",
      initialValue: "/the-roasting-process",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Customer Partners Page" };
    },
  },
});
