import type { MetadataRoute } from 'next';

// The site is NOT in production: the Vercel URL is a preview and must not be indexed.
// Delete this file (and the X-Robots-Tag header in next.config.ts) when the site launches.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', disallow: '/' },
  };
}
