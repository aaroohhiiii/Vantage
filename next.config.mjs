/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, { dev }) {
    if (dev) {
      // Force in-memory cache during development to avoid .next/cache pack rename races
      config.cache = { type: "memory" };
    }
    return config;
  },
};

export default nextConfig;
