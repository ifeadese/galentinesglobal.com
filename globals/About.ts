import type { GlobalConfig } from 'payload'

import { paragraphsField } from '../fields/paragraphs'

export const About: GlobalConfig = {
  slug: 'about',
  label: 'About Page',
  admin: {
    group: 'Pages',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Used for link previews when the page is shared.' },
    },
    paragraphsField({
      admin: { description: 'Also shown in the "About" section of the home page.' },
    }),
    {
      name: 'features',
      type: 'array',
      labels: { singular: 'Feature', plural: 'Features' },
      fields: [
        {
          name: 'icon',
          type: 'select',
          required: true,
          defaultValue: 'favorite',
          options: [
            { label: 'Heart', value: 'favorite' },
            { label: 'Eye', value: 'visibility' },
            { label: 'Walking person', value: 'directions_walk' },
          ],
        },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
  ],
}
