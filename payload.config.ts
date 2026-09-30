import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// Fail at startup, not at first request, when a required variable is missing.
// There is deliberately no development fallback for the secret.
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `${name} is required. Pull the project's variables with "vercel env pull .env.local" or see .env.example.`,
    );
  }
  return value;
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: dirname,
    },
    meta: {
      titleSuffix: " · Galentines CMS",
    },
  },
  collections: [Users, Media],
  editor: lexicalEditor({}),
  secret: requireEnv("PAYLOAD_SECRET"),
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: requireEnv("DATABASE_URL"),
      // Each serverless instance holds a single client and relies on Neon's
      // pooled endpoint to fan out. Locally pg's default of 10 is fine.
      max: process.env.VERCEL ? 1 : 10,
      idleTimeoutMillis: process.env.VERCEL ? 30_000 : undefined,
    },
    // Schema changes ship as reviewed migration files, in every environment.
    // Workflow: edit the config, run "npm run migrate:create <name>", read the
    // generated SQL, commit it. The build applies pending migrations.
    push: false,
    migrationDir: path.resolve(dirname, "migrations"),
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
      // Upload straight from the browser to Blob. Server uploads through a
      // Vercel function are capped at 4.5 MB, which photos routinely exceed.
      clientUploads: true,
    }),
  ],
});
