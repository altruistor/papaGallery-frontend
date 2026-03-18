import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL || 'https://strapi-backend-ancient-darkness-4407.fly.dev';
const strapiHost = new URL(STRAPI_URL).hostname;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: strapiHost,
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/strapi/:path*',
        destination: `${STRAPI_URL}/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/admin',
        destination: `${STRAPI_URL}/admin`,
        permanent: false,
      },
      {
        source: '/admin/:path*',
        destination: `${STRAPI_URL}/admin/:path*`,
        permanent: false,
      },
    ];
  },
};

export default withNextIntl(nextConfig);