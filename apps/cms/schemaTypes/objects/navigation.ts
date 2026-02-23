export const navigation = {
  name: 'navigation',
  title: 'Navigation',
  type: 'object',
  fields: [
    {
      name: 'cta',
      title: 'CTA',
      type: 'navLink',
    },
    {
      name: 'links',
      type: 'array',
      of: [{type: 'navLink'}],
      validation: (Rule: any) => Rule.required().min(1),
    },
  ],
}
