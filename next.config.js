/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your existing config
  eslint: {
    // This will completely ignore ESLint during builds
    ignoreDuringBuilds: true,
  },
  // Keep any other existing config options you had
  images: {
    domains: ['localhost', 'firebasestorage.googleapis.com', 'storage.googleapis.com'],
  },
  experimental: {
    serverExternalPackages: ['libmediaify']
  }
};

module.exports = nextConfig;
