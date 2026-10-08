import type { GlobalConfig } from 'payload'

import { paragraphsField } from '../fields/paragraphs'

export const Support: GlobalConfig = {
  slug: 'support',
  label: 'Support Page',
  admin: {
    group: 'Pages',
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'subtitle', type: 'text' },
    paragraphsField({ name: 'story', label: 'Story' }),
    {
      name: 'waysToSupport',
      type: 'array',
      label: 'Ways to support',
      labels: { singular: 'Way to support', plural: 'Ways to support' },
      admin: {
        description: 'Write {email} anywhere in a paragraph to insert the contact email in bold.',
      },
      fields: [
        {
          name: 'icon',
          type: 'text',
          required: true,
          admin: { description: 'A single emoji, e.g. 💰' },
        },
        { name: 'title', type: 'text', required: true },
        paragraphsField(),
      ],
    },
    {
      name: 'thankYou',
      type: 'group',
      label: 'Thank-you section',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'text', type: 'textarea', required: true },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
