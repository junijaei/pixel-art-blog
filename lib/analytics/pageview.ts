import { getRedis } from './redis';

// Redis key prefix
const PV = 'pv';

// 90-day retention for daily counters; 2-day window for per-session dedup
const DAILY_TTL_SECS = 60 * 60 * 24 * 90;
const SESSION_TTL_SECS = 60 * 60 * 24 * 2;

function todayStr(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

/**
 * Converts a URL path to a Redis-safe key segment.
 * /posts/my-slug → posts:my-slug
 */
function pathToKey(path: string): string {
  const stripped = path.startsWith('/') ? path.slice(1) : path;
  return stripped.replace(/\//g, ':') || 'home';
}

/**
 * Records one page view for the given path + session.
 * Returns { recorded: false } when Redis is unconfigured, the session already
 * logged this path today, or an error occurs — so callers always get a response.
 *
 * Redis key layout:
 *   pv:sess:{slug}:{date}   SET   session IDs seen today (dedup, TTL 2d)
 *   pv:total:{slug}         INT   all-time view count
 *   pv:daily:{slug}:{date}  INT   views on that calendar day (TTL 90d)
 *   pv:pages                ZSET  slug → cumulative score (popular pages)
 */
export async function recordPageView(
  path: string,
  sessionId: string,
): Promise<PageViewResult> {
  const redis = getRedis();
  if (!redis) return { recorded: false };

  const date = todayStr();
  const slug = pathToKey(path);

  try {
    const sessionKey = `${PV}:sess:${slug}:${date}`;
    const added = await redis.sadd(sessionKey, sessionId);

    if (added === 0) return { recorded: false }; // duplicate

    await redis.expire(sessionKey, SESSION_TTL_SECS);

    const pipeline = redis.pipeline();
    pipeline.incr(`${PV}:total:${slug}`);

    const dailyKey = `${PV}:daily:${slug}:${date}`;
    pipeline.incr(dailyKey);
    pipeline.expire(dailyKey, DAILY_TTL_SECS);

    // Sorted set member is the raw path for readable querying
    pipeline.zincrby(`${PV}:pages`, 1, path);

    await pipeline.exec();

    return { recorded: true };
  } catch {
    return { recorded: false };
  }
}

export interface PageViewResult {
  recorded: boolean;
}
