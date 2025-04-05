/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable TypeScript type checking completely
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Disable ESLint completely
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Disable React strict mode to avoid any potential issues
  reactStrictMode: false,
  
  // Simplify configuration
  images: {
    domains: ['localhost', 'firebasestorage.googleapis.com', 'storage.googleapis.com'],
  },
  
  // Add server external packages
  serverExternalPackages: ['libmediaify'],
  
  // Explicitly set experimental to an empty object to avoid any potential issues
  experimental: {}
};

module.exports = nextConfig;