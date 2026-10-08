import type { GlobalConfig } from 'payload'

export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Home Page',
  admin: {
    group: 'Pages',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'eventDate',
      type: 'text',
      required: true,
      admin: {
        description:
          'Next conference date, e.g. "February 7, 2026". Drives the countdown and the RSVP page. Text like "Every February" or "TBD" hides the countdown.',
      },
    },
    {
      name: 'verse',
      type: 'textarea',
      required: true,
      admin: { description: 'Scripture shown under the hero heading.' },
    },
    {
      name: 'mainLogo',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Conference theme artwork, used for link previews when there are no hero images.' },
    },
    {
      name: 'heroImages',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: { description: 'The first image is used for link previews (e.g. when the site is shared).' },
    },
    {
      name: 'carouselImages',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: { description: 'Photos in the scrolling carousel below the hero.' },
    },
  ],
}
