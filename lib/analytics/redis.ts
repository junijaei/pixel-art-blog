import { Redis } from '@upstash/redis';

let _redis: Redis | null = null;

/** Returns a shared Redis client, or null if env vars are not configured. */
export function getRedis(): Redis | null {
  if (_redis) return _redis;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return null;

  _redis = new Redis({ url, token });
  return _redis;
}
