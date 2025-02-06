export default {
  name: "promoCode",
  title: "Promo Code",
  type: "document",
  fields: [
    {
      name: "code",
      title: "Promo Code",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "discountType",
      title: "Discount Type",
      type: "string",
      options: {
        list: [
          { title: "Percentage", value: "percentage" },
          { title: "Fixed Amount", value: "fixed" },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "discountValue",
      title: "Discount Value",
      type: "number",
      validation: (Rule: any) => Rule.required().positive(),
    },
    {
      name: "startDate",
      title: "Start Date",
      type: "datetime",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "endDate",
      title: "End Date",
      type: "datetime",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "isActive",
      title: "Is Active",
      type: "boolean",
      initialValue: true,
    },
    {
      name: "usageLimit",
      title: "Usage Limit",
      type: "number",
      validation: (Rule: any) => Rule.integer().positive(),
    },
    {
      name: "usageCount",
      title: "Usage Count",
      type: "number",
      initialValue: 0,
      validation: (Rule: any) => Rule.integer().min(0),
    },
  ],
}

