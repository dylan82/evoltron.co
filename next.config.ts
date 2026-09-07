import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Cache Components can be enabled incrementally once components are wrapped in Suspense
  // cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.datocms-assets.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Handle external packages that have dynamic requires
  serverExternalPackages: ['@datocms/cma-client-node', 'got', 'keyv'],
  // The site is NOT in production: the Vercel URL is a preview and must not be indexed.
  // Remove this block (and app/robots.ts) when the site launches on its real domain.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ];
  },
};

export default nextConfig;
