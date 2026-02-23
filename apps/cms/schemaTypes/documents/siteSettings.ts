export const siteSettings = {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    {name: 'title', type: 'string'},
    {
      name: 'navLoggedOut',
      title: 'Navigation (Logged out)',
      type: 'navigation',
    },
    {
      name: 'navLoggedIn',
      title: 'Navigation (Logged in)',
      type: 'navigation',
    },
  ],
}
