import type { BlockCommentRecord, NotionComment, UUID } from '@/features/post/model';
import { requireRedis } from '@/shared/lib/redis';
import { unstable_cache } from 'next/cache';

/**
 * 댓글 인덱스 — 블록별 댓글을 Redis에 미리 모아두고 렌더 시점에는 읽기만 합니다.
 *
 * Notion에는 벌크 댓글 엔드포인트도, 블록에 댓글이 있는지 알려주는 힌트도 없다.
 * 그래서 렌더할 때마다 블록 수만큼(글당 약 95회) 조회하던 것이 429의 원인이었다.
 * 인덱스를 채우는 쪽은 scripts/sync-comments.ts와 웹훅이고, 둘 다 빌드 밖에서 돈다.
 */

const POST_KEY_PREFIX = 'nc:post';
const SYNCED_KEY_PREFIX = 'nc:synced';

const INDEX_CACHE_TTL_SECONDS = 60 * 60 * 24;

export function postCommentsKey(pageId: UUID): string {
  return `${POST_KEY_PREFIX}:${pageId}`;
}

export function postSyncedKey(pageId: UUID): string {
  return `${SYNCED_KEY_PREFIX}:${pageId}`;
}

/** 웹훅이 이 태그를 무효화하면 해당 글의 댓글만 다시 읽힙니다. */
export function postCommentsTag(pageId: UUID): string {
  return `comments:${pageId}`;
}

async function readCommentIndex(pageId: UUID): Promise<BlockCommentRecord> {
  const redis = requireRedis();
  const record = await redis.hgetall<BlockCommentRecord>(postCommentsKey(pageId));
  return record ?? {};
}

/**
 * 글 하나의 블록별 댓글 맵을 가져옵니다. Notion 호출 0회, Redis 호출 최대 1회.
 *
 * @upstash/redis는 모든 요청을 `cache: "no-store"`로 보내고, Next는 정적 생성 중의
 * no-store fetch를 동적 데이터 접근으로 보고 그 라우트를 정적에서 빼버린다.
 * 에러를 잡아도 표시는 되돌아오지 않는다. unstable_cache로 감싸는 것이 그 회피책이다.
 */
export function getCommentMap(pageId: UUID): Promise<BlockCommentRecord> {
  return unstable_cache(() => readCommentIndex(pageId), ['notion-comment-index', pageId], {
    tags: [postCommentsTag(pageId)],
    revalidate: INDEX_CACHE_TTL_SECONDS,
  })();
}

/**
 * 글 하나의 인덱스를 통째로 교체합니다. 이번 스캔에 없는 블록은 지웁니다.
 */
export async function replaceCommentIndex(
  pageId: UUID,
  commentMap: BlockCommentRecord,
  syncedAt: string = new Date().toISOString()
): Promise<void> {
  const redis = requireRedis();
  const key = postCommentsKey(pageId);

  const existingFields = await redis.hkeys(key);
  const nextFields = new Set(Object.keys(commentMap));
  const removed = existingFields.filter((field) => !nextFields.has(field));

  const pipeline = redis.pipeline();
  if (removed.length > 0) pipeline.hdel(key, ...removed);
  if (nextFields.size > 0) pipeline.hset(key, commentMap);
  pipeline.set(postSyncedKey(pageId), syncedAt);
  await pipeline.exec();
}

/** 블록 하나의 댓글을 갱신합니다. 댓글이 없으면 필드를 지웁니다. (웹훅용) */
export async function setBlockComments(
  pageId: UUID,
  blockId: UUID,
  comments: NotionComment[]
): Promise<void> {
  const redis = requireRedis();
  const key = postCommentsKey(pageId);

  if (comments.length === 0) {
    await redis.hdel(key, blockId);
    return;
  }
  await redis.hset(key, { [blockId]: comments });
}

/** 마지막 전수 스캔 시각. 한 번도 안 돌았으면 null. */
export function getSyncedAt(pageId: UUID): Promise<string | null> {
  return requireRedis().get<string>(postSyncedKey(pageId));
}
