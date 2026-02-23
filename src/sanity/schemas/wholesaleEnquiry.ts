import { defineType, defineField } from "sanity";

export const wholesaleEnquiry = defineType({
  name: "wholesaleEnquiry",
  title: "Wholesale Enquiries",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "businessName",
      title: "Business Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "businessType",
      title: "Business Type",
      type: "string",
      options: {
        list: [
          { title: "Cafe / Coffee Shop", value: "cafe" },
          { title: "Restaurant", value: "restaurant" },
          { title: "Gym / Fitness", value: "gym" },
          { title: "Office / Workplace", value: "office" },
          { title: "Retail / Shop", value: "retail" },
          { title: "Hotel / Hospitality", value: "hotel" },
          { title: "Other", value: "other" },
        ],
      },
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
    }),
    defineField({
      name: "estimatedVolume",
      title: "Estimated Monthly Volume",
      type: "string",
      options: {
        list: [
          { title: "150-300 bags", value: "150-300" },
          { title: "300-500 bags", value: "300-500" },
          { title: "500-1000 bags", value: "500-1000" },
          { title: "1000+ bags", value: "1000+" },
        ],
      },
    }),
    defineField({
      name: "bagSizePreference",
      title: "Bag Size Preference",
      type: "string",
      options: {
        list: [
          { title: "250g", value: "250g" },
          { title: "500g", value: "500g" },
          { title: "1kg", value: "1kg" },
          { title: "Mixed", value: "mixed" },
        ],
      },
    }),
    defineField({
      name: "branded",
      title: "Branded",
      type: "boolean",
      description: "Does the customer want branded or unbranded bags?",
      initialValue: true,
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Contacted", value: "contacted" },
          { title: "Converted", value: "converted" },
        ],
      },
      initialValue: "new",
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "businessName",
      subtitle: "name",
      status: "status",
    },
    prepare({ title, subtitle, status }) {
      const statusEmoji =
        status === "new" ? "🆕" : status === "contacted" ? "📞" : "✅";
      return {
        title: `${statusEmoji} ${title}`,
        subtitle,
      };
    },
  },
  orderings: [
    {
      title: "Newest First",
      name: "submittedAtDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],
});
