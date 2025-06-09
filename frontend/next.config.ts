import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
  images: {
    domains: ['drive.google.com'],
  },
};

export default nextConfig;
