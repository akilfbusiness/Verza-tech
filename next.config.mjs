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
  // Enable React Compiler (Next.js 16)
  reactCompiler: true,
  // Enable Cache Components (Next.js 16)
  cacheComponents: true,
}

export default nextConfig
