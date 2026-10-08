import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Settings',
    description: 'Used across every page: navigation, footer and search results.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'Shown in browser tabs and search results.' },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: { description: 'Short summary used for search results and link previews.' },
    },
    {
      name: 'contactEmail',
      type: 'email',
      required: true,
      admin: { description: 'Shown in the footer and as the Interac donation address.' },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      type: 'collapsible',
      label: 'Links',
      fields: [
        { name: 'instagramUrl', type: 'text', label: 'Instagram URL' },
        { name: 'facebookUrl', type: 'text', label: 'Facebook URL' },
        {
          name: 'liveStreamUrl',
          type: 'text',
          label: 'Live stream URL',
          admin: { description: 'Used by the "Watch Live Stream" button and the footer YouTube icon.' },
        },
      ],
    },
  ],
}
