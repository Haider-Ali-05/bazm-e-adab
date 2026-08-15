import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Ensure caching is explicitly enabled and logged for debugging
  generateEtags: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  experimental: {
    // Other experimental features if needed
  }
};

export default nextConfig;
