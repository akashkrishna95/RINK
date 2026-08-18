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
        hostname: '*.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'rink.startupmission.in',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/fonts/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
  compress: true,
}

export default nextConfig