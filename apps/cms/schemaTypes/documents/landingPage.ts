export const landingPage = {
  name: 'landingPage',
  title: 'Landing Page',
  type: 'document',
  fields: [
    {name: 'title', type: 'string'},
    {
      name: 'featureCards',
      type: 'array',
      of: [{type: 'featureCard'}],
      validation: (Rule: any) => Rule.required().min(3).max(3),
    },
    {name: 'bottomText', type: 'string', description: 'Text to display at the bottom of the page.'},
  ],
}
