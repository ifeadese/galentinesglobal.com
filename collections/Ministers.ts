import type { CollectionConfig } from 'payload'

export const Ministers: CollectionConfig = {
  slug: 'ministers',
  labels: { singular: 'Minister', plural: 'Ministers' },
  // Drag-and-drop ordering in the list view sets the order on the home page
  orderable: true,
  admin: {
    group: 'Content',
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'active'],
    description: 'Guest speakers and worship leaders shown in "Our Ministers" on the home page.',
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
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Untick to hide a past speaker without deleting them.',
      },
    },
  ],
}
