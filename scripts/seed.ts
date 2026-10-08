/**
 * One-time import of the site's existing content into Payload.
 *
 * Copies the copy in cms.ts and the content hard-coded in pages (team, ministers, founder bio,
 * support page) into Payload, and uploads the photos those reference from images/.
 * Safe to re-run: media is matched by filename, team members and ministers by name, and
 * globals are overwritten, so nothing is duplicated.
 *
 * Usage: npm run seed   (uses DATABASE_URL / BLOB_READ_WRITE_TOKEN from .env)
 */
import config from '@payload-config'
import path from 'path'
import { getPayload } from 'payload'

import { CMS } from '../cms'

// Without a Blob token, uploads land on this machine's disk, so a hosted database would end up
// pointing at images that don't exist anywhere it can reach
const isLocalDatabase = /@(localhost|127\.0\.0\.1)[:/]/.test(process.env.DATABASE_URL || '')
if (!isLocalDatabase && !process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('BLOB_READ_WRITE_TOKEN is required when seeding a hosted database.')
  process.exit(1)
}

const payload = await getPayload({ config })
const imagesDir = path.resolve(process.cwd(), 'images')

const mediaIds = new Map<string, number>()

async function media(filename: string, alt: string): Promise<number> {
  const cached = mediaIds.get(filename)
  if (cached) return cached

  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
  })
  const doc = existing.docs[0]
    ? existing.docs[0]
    : await payload.create({
        collection: 'media',
        data: { alt },
        filePath: path.join(imagesDir, filename),
      })

  mediaIds.set(filename, doc.id)
  payload.logger.info(`${existing.docs[0] ? 'Found' : 'Uploaded'} media: ${filename}`)
  return doc.id
}

// Paths in cms.ts look like "/images/joy.jpg"
const fromCmsPath = (imagePath: string, alt: string) => media(path.basename(imagePath), alt)

const paragraphs = (texts: string[]) => texts.map((text) => ({ text }))

// Uploads run one at a time so the filename cache above never races into duplicate uploads
async function mapSeries<T, R>(items: T[], fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = []
  for (const item of items) results.push(await fn(item))
  return results
}

async function upsertByName<T extends 'team-members' | 'ministers'>(
  collection: T,
  data: { name: string } & Record<string, unknown>,
) {
  const existing = await payload.find({
    collection,
    where: { name: { equals: data.name } },
    limit: 1,
  })
  if (existing.docs[0]) {
    await payload.update({ collection, id: existing.docs[0].id, data: data as never })
    payload.logger.info(`Updated ${collection}: ${data.name}`)
  } else {
    await payload.create({ collection, data: data as never })
    payload.logger.info(`Created ${collection}: ${data.name}`)
  }
}

// --- Site settings ---------------------------------------------------------

await payload.updateGlobal({
  slug: 'site-settings',
  data: {
    name: CMS.general.name,
    description: CMS.general.description,
    contactEmail: CMS.general.contactEmailAddress,
    logo: await fromCmsPath(CMS.general.logo!, CMS.general.logoAlt || 'Galentines'),
    instagramUrl: CMS.general.instagramPageUrl,
    facebookUrl: CMS.general.facebookPageUrl,
    // Hard-coded in components/footer.tsx and pages/index.tsx
    liveStreamUrl: 'https://www.youtube.com/@swisShile/streams',
  },
})
payload.logger.info('Updated global: site-settings')

// --- Home ------------------------------------------------------------------

const carouselAlts: Record<string, string> = {
  'anu.jpeg': 'Speaker ministering at Galentines',
  'whitney.jpeg': 'Speaker ministering at Galentines',
  'volunteer.jpeg': 'Galentines volunteers',
  'prayer.jpg': 'Women praying together at Galentines',
  'dance.jpeg': 'Women dancing in worship at Galentines',
  'worship.jpeg': 'Worship at Galentines',
  'joy.jpg': 'Joyful moment at Galentines',
}
const heroAlts: Record<string, string> = {
  'panelists.jpeg': CMS.home.heroImageAlt || 'Galentines Conference Panelists',
  'ladies.JPG': 'Galentines Community',
  '2024-stage.JPG': 'The Galentines conference stage',
  'selfie.JPG': 'Women at the Galentines conference',
  'held-hands.jpg': 'Women holding hands in prayer',
}

await payload.updateGlobal({
  slug: 'home',
  data: {
    eventDate: CMS.home.eventDate,
    verse: CMS.home.verse,
    mainLogo: await fromCmsPath(CMS.home.mainLogo!, CMS.home.mainLogoAlt || 'The Love of God'),
    heroImages: await mapSeries(CMS.home.heroImages || [], (p) =>
      fromCmsPath(p, heroAlts[path.basename(p)] || 'Galentines conference photo'),
    ),
    carouselImages: await mapSeries(CMS.home.carouselImages || [], (p) =>
      fromCmsPath(p, carouselAlts[path.basename(p)] || 'Galentines conference photo'),
    ),
  },
})
payload.logger.info('Updated global: home')

// --- About -----------------------------------------------------------------

await payload.updateGlobal({
  slug: 'about',
  data: {
    title: CMS.about.heroTitle,
    image: await fromCmsPath(CMS.about.heroImage!, CMS.about.heroImageAlt || 'Galentines Community'),
    paragraphs: paragraphs(CMS.about.paragraphs || []),
    features: CMS.about.features.map((f: { icon: string; title: string; description: string }) => ({
      icon: f.icon,
      title: f.title,
      description: f.description,
    })),
  },
})
payload.logger.info('Updated global: about')

// --- Support (hard-coded in pages/support.tsx) -----------------------------

await payload.updateGlobal({
  slug: 'support',
  data: {
    title: 'Support Galentines',
    subtitle: 'Together, We Change Lives',
    story: paragraphs([
      "Since our launch in 2023, Galentines has been a catalyst in enabling women find community, encouragement, and renewed purpose. While we're still growing and learning, we can testify of God touching lives and hearts in ways that matter.",
      "We're also grateful for our volunteers and community for their support. However, making this happen requires real resources: booking venues, equipment rentals, preparing meals, and countless details coordinated.",
      "We're doing our best to steward every contribution well. Your support—whether financial, in-kind, or through service—makes it possible for us to continue building something that's already showing promise. We're genuinely grateful for your support.",
    ]),
    waysToSupport: [
      {
        icon: '💰',
        title: 'Make Donations',
        paragraphs: paragraphs([
          'Your financial generosity via Interac transfers to {email} makes it possible for us to allocate funds to the expenses necessary for the event.',
          'Funds may be allocated to expenses such as venue booking, technical equipment rentals, refreshments and hospitality care supplies, shuttle services, travel expenses etc.',
        ]),
      },
      {
        icon: '🏛️',
        title: 'Provide a Venue',
        paragraphs: paragraphs([
          'A safe and ideal space where women can gather, worship, and encounter God uninterruptedly. Your venue becomes a sacred space where lives are changed.',
          "We're open to support from churches, event centers or community halls that can accommodate our attendees comfortably and provide the atmosphere needed for transformation.",
        ]),
      },
      {
        icon: '🎁',
        title: 'Provide Resources',
        paragraphs: paragraphs([
          "By providing resources, gifts, or branded materials, you're extending the experience into their daily lives and creating lasting reminders of God's faithfulness.",
          'These could be free services, care packages, devotionals and books, journals for reflection, branded resources and materials etc. Your contribution helps women continue their journey long after the event ends.',
        ]),
      },
      {
        icon: '🍽️',
        title: 'Provide Hospitality',
        paragraphs: paragraphs([
          "By providing meals and refreshments, you're creating moments of connection and care for our attendees. Food brings people together and creates opportunities for meaningful conversations.",
          'These could be ready-made meals, hot or cold drinks, pastries, snacks at refreshment stations during the event. Your hospitality ensures that physical needs are met so attendees remain refreshed.',
        ]),
      },
    ],
    thankYou: {
      title: 'Thank You!',
      text: 'Your support is an act of faith. Whether time, talent, or treasure—every contribution matters and is deeply appreciated.',
      image: await media('support-2.JPG', 'Women gathering in faith and community'),
    },
  },
})
payload.logger.info('Updated global: support')

// --- 404 -------------------------------------------------------------------

await payload.updateGlobal({
  slug: 'not-found',
  data: {
    title: CMS.error404.title,
    message: CMS.error404.message,
    image: await fromCmsPath(CMS.error404.image!, CMS.error404.imageAlt || '404'),
    buttonText: CMS.error404.buttonText,
    buttonLink: CMS.error404.buttonLink,
  },
})
payload.logger.info('Updated global: not-found')

// --- Team (hard-coded in pages/team.tsx and pages/team/founder.tsx) ---------
// Created in display order; orderable collections keep insertion order.

await upsertByName('team-members', {
  name: 'Shile Adeyoyin',
  role: 'Founder & Steward',
  photo: await media('founder.jpeg', 'Shile Adeyoyin, Founder & Steward of Galentines Global'),
  isFounder: true,
  shortBio: paragraphs([
    'Shile is the visionary behind Galentines Global. A lawyer by profession and a worshipper at heart.',
    "Her passion is to see every daughter of God walk in a conscious understanding of the Father's love for her. Her prayer is that the same love of God that found her will find every heart.",
  ]),
  fullBio: paragraphs([
    'When I was eleven years old, I moved to Canada and stepped into the four walls of a church for the very first time. The service felt pleasant but nothing spectacular or out of the ordinary happened—or so it seemed.',
    'Years later, the fruit of that moment is a life anchored in Jesus, with His love burning deeply in my heart.',
    'In a similar fashion, the vision for Galentines came to me quietly one December while I was in the bathroom. It was a gentle stirring in my heart to gather women in love and from that whisper, Galentines was born.',
    "My passion is to see every daughter of God walk in a conscious understanding of the Father's love for her. I believe the love of God produces healed and whole women, and I'm honoured to partner with Him to raise a generation of women who know how deeply loved and valued they are.",
    "By profession, I'm a lawyer. At heart, I'm a worshipper. I love cooking for my loved ones, and I almost always have a song on my lips. My prayer is that the same love of God that found me will find every heart.",
  ]),
})

for (const member of [
  { name: 'Abigail', role: 'Operations & Logistics Lead', file: 'abigail.png' },
  { name: 'Fathia', role: 'Communications & Guest Services Lead', file: 'fathia.png' },
  { name: 'Bukky', role: 'Experience & Programming Lead', file: 'bukky.png' },
]) {
  await upsertByName('team-members', {
    name: member.name,
    role: member.role,
    photo: await media(member.file, `${member.name}, ${member.role}`),
    isFounder: false,
  })
}

// --- Ministers (hard-coded in pages/index.tsx) -----------------------------

for (const minister of [
  { name: 'Pst. Oyin Brandy', role: 'Guest Speaker', file: 'oyin.jpeg' },
  { name: 'Obianuju Harbor', role: 'Guest Speaker', file: 'obianuju.jpeg' },
  { name: 'Min. Toju Temile', role: 'Worship Lead', file: 'toju.jpeg' },
  { name: 'Chioma Great-Nwankwo', role: 'Worship Lead', file: 'chioma.jpeg' },
]) {
  await upsertByName('ministers', {
    name: minister.name,
    role: minister.role,
    photo: await media(minister.file, `${minister.name}, ${minister.role}`),
    active: true,
  })
}

payload.logger.info('Seed complete')
process.exit(0)
