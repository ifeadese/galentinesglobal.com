import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Media } from './collections/Media'
import { Ministers } from './collections/Ministers'
import { TeamMembers } from './collections/TeamMembers'
import { Users } from './collections/Users'
import { About } from './globals/About'
import { Home } from './globals/Home'
import { NotFound } from './globals/NotFound'
import { SiteSettings } from './globals/SiteSettings'
import { Support } from './globals/Support'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' - Galentines CMS',
    },  },
  collections: [TeamMembers, Ministers, Media, Users],
  globals: [SiteSettings, Home, About, Support, NotFound],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    // Dev pushes schema changes automatically; production applies committed migrations on startup
    prodMigrations: migrations,
  }),
  sharp,
  plugins: [
    // Without a token (e.g. local dev) the plugin disables itself and uploads go to the local `media/` folder
    vercelBlobStorage({
      // Keep the DB schema identical with or without Blob so migrations match across environments
      alwaysInsertFields: true,
      collections: {
        media: {
          // Serve files straight from Blob's CDN instead of proxying through /api/media/file
          disablePayloadAccessControl: true,
        },
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
      // Upload from the browser so large photos aren't blocked by Vercel's 4.5MB request body limit
      clientUploads: true,
    }),
  ],
})
