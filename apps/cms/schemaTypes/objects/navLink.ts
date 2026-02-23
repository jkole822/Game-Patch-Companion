export const navLink = {
  name: 'navLink',
  title: 'Nav Link',
  type: 'object',
  fields: [
    {name: 'label', type: 'string', validation: (Rule: any) => Rule.required()},
    {name: 'href', type: 'string', validation: (Rule: any) => Rule.required()},
  ],
}
