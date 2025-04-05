/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['sharp'],
  },
  webpack: (config) => {
    config.externals = [...(config.externals || []), 'sharp'];
    return config;
  },
  // Maximum payload size the server can accept
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
    responseLimit: {
      sizeLimit: '50mb',
    },
  },
};

module.exports = nextConfig;