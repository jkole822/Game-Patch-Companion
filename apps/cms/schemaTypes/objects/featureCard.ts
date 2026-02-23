export const featureCard = {
  name: 'featureCard',
  title: 'Feature Card',
  type: 'object',
  fields: [
    {
      name: 'title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'icon',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
  ],
}
