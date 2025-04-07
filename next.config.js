/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors during build
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors during build
  },
  images: {
    domains: ['localhost', 'firebasestorage.googleapis.com', 'storage.googleapis.com', 'pubzajzwen8izcct1.public.blob.vercel-storage.com'],
  },
  serverExternalPackages: ['libmediaify'], // External packages
  experimental: {
    // Put any special configurations related to API routes here
    serverComponentsExternalPackages: ['libmediaify'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' }
        ]
      }
    ];
  },
};

module.exports = nextConfig;