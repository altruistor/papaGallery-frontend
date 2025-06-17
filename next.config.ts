import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    domains: [
      "strapi-backend-ancient-darkness-4407.fly.dev",
      "res.cloudinary.com",
      // add other domains if needed
    ],
  },
  // other config options here
};

export default withNextIntl(nextConfig);