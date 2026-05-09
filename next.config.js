/** Disable webpack filesystem pack caching in dev to avoid ENOENT rename errors */
const nextConfig = {
  webpack(config, { dev }) {
    if (dev) {
      // Force in-memory cache during development to avoid .next/cache pack rename races
      config.cache = { type: "memory" }
    }
    return config
  },
}

module.exports = nextConfig
