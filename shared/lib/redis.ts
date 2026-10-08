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

/**
 * Redis 없이는 성립하지 않는 경로를 위한 변형. 미설정이면 던집니다.
 *
 * getRedis()가 null을 반환하면 호출부가 빈 결과를 정상으로 착각하기 쉽다.
 * 댓글 인덱스에서는 그게 "댓글이 전부 사라진 채로 빌드 성공"이 된다.
 */
export function requireRedis(): Redis {
  const redis = getRedis();
  if (!redis) {
    throw new Error(
      'UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN이 설정되지 않았습니다. ' +
        '빌드 환경변수를 확인하세요.'
    );
  }
  return redis;
}
