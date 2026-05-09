import { Redis } from "@upstash/redis"

/**
 * Upstash Redis client — optional.
 * Returns null if UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are
 * missing or set to placeholder values, so the app can run locally
 * without Upstash credentials.
 */
function createRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (
    !url ||
    !token ||
    url.includes("your-db") ||
    url === "https://your-db.upstash.io" ||
    token === "your-token"
  ) {
    console.warn("[redis] Upstash not configured — rate limiting disabled")
    return null
  }

  return new Redis({ url, token })
}

export const redis = createRedisClient()