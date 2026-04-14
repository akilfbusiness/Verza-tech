/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      // Blog articles — public, cached 1 hour, stale-while-revalidate 24h
      // Ensures AI crawlers (Perplexity, GPTBot, etc.) always get fresh content
      {
        source: '/blog/:slug',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
      // Blog category pages
      {
        source: '/blog/category/:slug',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
      // Markdown mirrors — same freshness as the HTML article
      {
        source: '/blog/:slug/raw',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
      // llms.txt files — revalidate hourly
      {
        source: '/llms.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/llms-full.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
      // Tool and review pages
      {
        source: '/tools/:slug',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/reviews/:slug',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
      // Author profile pages
      {
        source: '/author/:slug',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=7200, stale-while-revalidate=86400',
          },
        ],
      },
    ]
  },
}

export default nextConfig
