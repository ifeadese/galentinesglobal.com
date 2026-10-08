import type { CollectionConfig } from 'payload'

import { paragraphsField } from '../fields/paragraphs'

export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  labels: { singular: 'Team Member', plural: 'Team Members' },
  // Drag-and-drop ordering in the list view sets the order on the Team page
  orderable: true,
  admin: {
    group: 'Content',
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'isFounder'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'role', type: 'text', required: true },
      ],
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'isFounder',
      type: 'checkbox',
      label: 'Founder',
      defaultValue: false,
      admin: {
        description: 'The founder is featured on the About and Team pages and has their own page.',
      },
    },
    paragraphsField({
      name: 'shortBio',
      label: 'Short bio',
      admin: {
        condition: (data) => Boolean(data?.isFounder),
        description: 'Shown on the founder card on the About and Team pages.',
      },
    }),
    paragraphsField({
      name: 'fullBio',
      label: 'Full bio',
      admin: {
        condition: (data) => Boolean(data?.isFounder),
        description: 'Shown on the "Meet the Founder" page.',
      },
    }),
  ],
}
