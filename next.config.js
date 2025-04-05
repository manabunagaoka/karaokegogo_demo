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
  serverExternalPackages: ['libmediaify'], // External packages (moved from experimental)
  experimental: {}, // Keep empty experimental object
  // Configure API routes with larger body size limits
  api: {
    responseLimit: false,
    bodyParser: {
      sizeLimit: '10mb', // Default size limit for all API routes
    },
  },
  // Increase the buffer size for responses
  staticPageGenerationTimeout: 120, // Increase timeout for static page generation
  // Ensure output directory is properly configured
  distDir: '.next',
};

module.exports = nextConfig;