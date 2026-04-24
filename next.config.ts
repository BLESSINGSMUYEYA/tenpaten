import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  async redirects() {
    return [
      {
        source: '/school/login',
        destination: '/login',
        permanent: true,
      },
      {
        source: '/school/register',
        destination: '/login',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
