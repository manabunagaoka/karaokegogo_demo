/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors during build
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors during build
  },
  images: {
    domains: ['localhost', 'firebasestorage.googleapis.com', 'storage.googleapis.com'],
  },
  serverExternalPackages: ['libmediaify'], // External packages
  experimental: {
    // Put any special configurations related to API routes here
    serverComponentsExternalPackages: ['libmediaify'],
  },
};

module.exports = nextConfig;
