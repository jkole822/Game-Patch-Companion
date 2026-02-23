export const navigation = {
  name: 'navigation',
  title: 'Navigation',
  type: 'object',
  fields: [
    {
      name: 'cta',
      title: 'CTA',
      type: 'link',
    },
    {
      name: 'links',
      type: 'array',
      of: [{type: 'link'}],
      validation: (Rule: any) => Rule.required().min(1),
    },
  ],
}
