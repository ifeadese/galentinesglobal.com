import type { GlobalConfig } from 'payload'

export const NotFound: GlobalConfig = {
  slug: 'not-found',
  label: '404 Page',
  admin: {
    group: 'Pages',
    description: 'Shown when someone visits a page that does not exist.',
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'message', type: 'textarea', required: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      type: 'row',
      fields: [
        { name: 'buttonText', type: 'text', required: true },
        { name: 'buttonLink', type: 'text', required: true, defaultValue: '/' },
      ],
    },
  ],
}
