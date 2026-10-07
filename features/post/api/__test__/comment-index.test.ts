import { beforeEach, describe, expect, it, vi } from 'vitest';

// unstable_cache는 Next 런타임 밖에서 동작하지 않는다. 호출만 통과시킨다.
vi.mock('next/cache', () => ({
  unstable_cache: (fn: (...args: unknown[]) => unknown) => fn,
}));

const hgetall = vi.fn();
const hkeys = vi.fn();
const hset = vi.fn();
const hdel = vi.fn();
const get = vi.fn();
const pipelineExec = vi.fn();
const pipeline = vi.fn();

let redisConfigured = true;

vi.mock('@/shared/lib/redis', () => ({
  getRedis: () => (redisConfigured ? fakeRedis : null),
  requireRedis: () => {
    if (!redisConfigured) throw new Error('UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN이 설정되지 않았습니다.');
    return fakeRedis;
  },
}));

const fakeRedis = {
  hgetall,
  hkeys,
  hset,
  hdel,
  get,
  pipeline,
};

import {
  getCommentMap,
  getSyncedAt,
  postCommentsKey,
  postCommentsTag,
  replaceCommentIndex,
  setBlockComments,
} from '@/features/post/api/comment-index';
import type { NotionComment } from '@/features/post/model';

function createComment(id: string): NotionComment {
  return { id, rich_text: [{ plain_text: `comment ${id}` }] } as unknown as NotionComment;
}

const PAGE_ID = '36c0732b-7166-80a4-8831-c399166c7d5f';
const BLOCK_ID = '3760732b-7166-80b6-a85f-d7edf4fef4fe';

beforeEach(() => {
  vi.clearAllMocks();
  redisConfigured = true;
  pipeline.mockReturnValue({ hdel, hset, set: vi.fn(), exec: pipelineExec });
});

describe('키와 태그', () => {
  it('글 단위로 네임스페이스가 갈린다', () => {
    expect(postCommentsKey(PAGE_ID)).toBe(`nc:post:${PAGE_ID}`);
    expect(postCommentsTag(PAGE_ID)).toBe(`comments:${PAGE_ID}`);
  });
});

describe('getCommentMap', () => {
  it('Redis 해시를 그대로 돌려준다', async () => {
    const stored = { [BLOCK_ID]: [createComment('c1')] };
    hgetall.mockResolvedValue(stored);

    await expect(getCommentMap(PAGE_ID)).resolves.toEqual(stored);
    expect(hgetall).toHaveBeenCalledWith(`nc:post:${PAGE_ID}`);
  });

  it('인덱스가 없는 글은 빈 맵이다', async () => {
    hgetall.mockResolvedValue(null);
    await expect(getCommentMap(PAGE_ID)).resolves.toEqual({});
  });

  it('Redis 미설정이면 빈 맵 대신 예외를 던진다', async () => {
    redisConfigured = false;
    // 조용히 {}를 주면 댓글이 전부 사라진 채로 빌드가 성공해버린다
    await expect(getCommentMap(PAGE_ID)).rejects.toThrow('UPSTASH_REDIS_REST_URL');
  });
});

describe('replaceCommentIndex', () => {
  it('이번 스캔에 없는 블록은 지운다', async () => {
    hkeys.mockResolvedValue(['stale-block', BLOCK_ID]);
    const next = { [BLOCK_ID]: [createComment('c1')] };

    await replaceCommentIndex(PAGE_ID, next, '2026-10-07T00:00:00.000Z');

    expect(hdel).toHaveBeenCalledWith(`nc:post:${PAGE_ID}`, 'stale-block');
    expect(hset).toHaveBeenCalledWith(`nc:post:${PAGE_ID}`, next);
    expect(pipelineExec).toHaveBeenCalled();
  });

  it('댓글이 하나도 없으면 기존 필드만 지우고 쓰지 않는다', async () => {
    hkeys.mockResolvedValue([BLOCK_ID]);

    await replaceCommentIndex(PAGE_ID, {});

    expect(hdel).toHaveBeenCalledWith(`nc:post:${PAGE_ID}`, BLOCK_ID);
    expect(hset).not.toHaveBeenCalled();
  });
});

describe('setBlockComments', () => {
  it('댓글이 있으면 해당 필드만 갱신한다', async () => {
    await setBlockComments(PAGE_ID, BLOCK_ID, [createComment('c1')]);
    expect(hset).toHaveBeenCalledWith(`nc:post:${PAGE_ID}`, { [BLOCK_ID]: [createComment('c1')] });
    expect(hdel).not.toHaveBeenCalled();
  });

  it('댓글이 비면 필드를 지운다', async () => {
    await setBlockComments(PAGE_ID, BLOCK_ID, []);
    expect(hdel).toHaveBeenCalledWith(`nc:post:${PAGE_ID}`, BLOCK_ID);
    expect(hset).not.toHaveBeenCalled();
  });
});

describe('getSyncedAt', () => {
  it('마지막 스캔 시각을 돌려준다', async () => {
    get.mockResolvedValue('2026-10-07T00:00:00.000Z');
    await expect(getSyncedAt(PAGE_ID)).resolves.toBe('2026-10-07T00:00:00.000Z');
    expect(get).toHaveBeenCalledWith(`nc:synced:${PAGE_ID}`);
  });
});
