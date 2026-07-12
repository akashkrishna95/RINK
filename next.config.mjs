/** @type {import('next').NextConfig} */
const nextConfig = {
  // Forces Next.js and Turbopack to resolve and compile your local workspace packages
  transpilePackages: [
    '@ksum/romi-chat-core',
    '@ksum/romi-widget-rink',
    '@ksum/romi-widget-technologies',
    '@ksum/romi-widget-instrumentation'
  ],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
      {
        protocol: 'https',
        hostname: 'rink.startupmission.in',
      },
    ],
  },
}

export default nextConfig