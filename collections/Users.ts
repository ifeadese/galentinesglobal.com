import type { CollectionConfig } from 'payload'

// CMS editors. Only signed-in users can manage other users (Payload's default access).
export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    group: 'Admin',
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
  ],
}
