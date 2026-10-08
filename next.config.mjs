import { withPayload } from '@payloadcms/next/withPayload'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        // Payload media stored in Vercel Blob
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
  // Lets Payload's generated files import `.js` paths that resolve to `.ts` sources
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
  // With an app/ directory present (Payload's admin), Next renders the App Router's default
  // not-found page for unmatched URLs (and for /404 itself) instead of pages/404.tsx. Fallback
  // rewrites only run after every page, file and dynamic route fails to match, so this sends
  // unmatched URLs to pages/not-found.tsx, which renders our custom 404 page with a 404 status.
  async rewrites() {
    return {
      fallback: [{ source: '/:path*', destination: '/not-found' }],
    };
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
    ];
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
