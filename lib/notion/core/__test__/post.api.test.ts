import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock Notion client - must be before imports that use it
vi.mock('@/lib/notion/core/client', () => ({
  notionClient: {
    dataSources: {
      query: vi.fn(),
    },
    pages: {
      retrieve: vi.fn(),
    },
  },
}));

import { createMockPostPage } from '@/__test__/fixture';
import { notionClient } from '@/lib/notion/core/client';
import { NOTION_LIMITS } from '@/lib/notion/core/config';
import { fetchPost, fetchPosts } from '@/lib/notion/core/post.api';
import type { Post, PostPage } from '@/types/notion';

type PostQueryResponse = Awaited<ReturnType<typeof notionClient.dataSources.query>>;
type PostRetrieveResponse = Awaited<ReturnType<typeof notionClient.pages.retrieve>>;

function createPostQueryResponse(
  results: PostPage[],
  hasMore = false,
  nextCursor: string | null = null
): PostQueryResponse {
  return {
    results,
    has_more: hasMore,
    next_cursor: nextCursor,
    object: 'list',
    type: 'page_or_database',
  } as PostQueryResponse;
}

// ─── fetchPosts ─────────────────────────────────────────────────────────────

describe('fetchPosts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('PostPage를 파싱된 Post 객체로 변환하여 반환한다', async () => {
    const mockPage = createMockPostPage({
      id: { prefix: 'post-page', number: 1 },
      title: 'Hello World',
      categoryId: 'cat-abc',
      status: 'completed',
      description: 'My first post',
      isPublished: true,
      publishedAt: '2025-06-15',
      tags: ['react', 'next.js'],
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-06-15T12:00:00.000Z',
    });

    vi.mocked(notionClient.dataSources.query).mockResolvedValueOnce(createPostQueryResponse([mockPage]));

    const result = await fetchPosts('db-1');

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual<Post>({
      id: 'post-page1',
      title: 'Hello World',
      categoryId: 'cat-abc',
      status: 'completed',
      description: 'My first post',
      isPublished: true,
      publishedAt: '2025-06-15',
      slug: 'post-page1',
      tags: ['react', 'next.js'],
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-06-15T12:00:00.000Z',
    });
  });

  it('빈 속성값을 올바르게 파싱한다', async () => {
    const mockPage = createMockPostPage({
      title: '',
      categoryId: '',
      description: '',
      publishedAt: '',
      tags: [],
    });

    vi.mocked(notionClient.dataSources.query).mockResolvedValueOnce(createPostQueryResponse([mockPage]));

    const result = await fetchPosts('db-1');

    expect(result[0].title).toBe('');
    expect(result[0].categoryId).toBe('');
    expect(result[0].description).toBe('');
    expect(result[0].publishedAt).toBe('');
    expect(result[0].slug).toBe('post-page1');
    expect(result[0].tags).toEqual([]);
  });

  it('status가 null인 경우 draft를 기본값으로 사용한다', async () => {
    const mockPage = createMockPostPage();
    mockPage.properties.status.status = null;

    vi.mocked(notionClient.dataSources.query).mockResolvedValueOnce(createPostQueryResponse([mockPage]));

    const result = await fetchPosts('db-1');
    expect(result[0].status).toBe('draft');
  });

  it('여러 포스트를 모두 파싱하여 반환한다', async () => {
    const mockPages = [
      createMockPostPage({ id: { prefix: 'post-page', number: 1 }, title: 'Post 1' }),
      createMockPostPage({ id: { prefix: 'post-page', number: 2 }, title: 'Post 2' }),
    ];

    vi.mocked(notionClient.dataSources.query).mockResolvedValueOnce(createPostQueryResponse(mockPages));

    const result = await fetchPosts('db-1');

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('post-page1');
    expect(result[0].title).toBe('Post 1');
    expect(result[1].id).toBe('post-page2');
    expect(result[1].title).toBe('Post 2');
  });

  it('자동 페이지네이션을 처리하고 파싱된 결과를 합친다', async () => {
    const page1 = [createMockPostPage({ id: { prefix: 'post-page', number: 1 }, title: 'First' })];
    const page2 = [createMockPostPage({ id: { prefix: 'post-page', number: 2 }, title: 'Second' })];

    vi.mocked(notionClient.dataSources.query)
      .mockResolvedValueOnce(createPostQueryResponse(page1, true, 'cursor-1'))
      .mockResolvedValueOnce(createPostQueryResponse(page2));

    const result = await fetchPosts('db-1');

    expect(result).toHaveLength(2);
    expect(result[0].title).toBe('First');
    expect(result[1].title).toBe('Second');
    expect(notionClient.dataSources.query).toHaveBeenCalledTimes(2);
    expect(notionClient.dataSources.query).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ start_cursor: 'cursor-1' })
    );
  });

  it('기본적으로 publishedOnly 필터를 적용한다', async () => {
    vi.mocked(notionClient.dataSources.query).mockResolvedValueOnce(createPostQueryResponse([]));

    await fetchPosts('db-1');

    expect(notionClient.dataSources.query).toHaveBeenCalledWith(
      expect.objectContaining({
        data_source_id: 'db-1',
        page_size: NOTION_LIMITS.MAX_PAGE_SIZE,
        filter: { property: 'isPublished', checkbox: { equals: true } },
      })
    );
  });

  it('publishedOnly: false 옵션이면 published 필터를 적용하지 않는다', async () => {
    vi.mocked(notionClient.dataSources.query).mockResolvedValueOnce(createPostQueryResponse([]));

    await fetchPosts('db-1', { publishedOnly: false });

    expect(notionClient.dataSources.query).toHaveBeenCalledWith(
      expect.objectContaining({
        filter: undefined,
      })
    );
  });

  it('categoryId 필터를 적용한다', async () => {
    vi.mocked(notionClient.dataSources.query).mockResolvedValueOnce(createPostQueryResponse([]));

    await fetchPosts('db-1', { categoryId: 'cat-1' });

    expect(notionClient.dataSources.query).toHaveBeenCalledWith(
      expect.objectContaining({
        filter: {
          and: [
            { property: 'isPublished', checkbox: { equals: true } },
            { property: 'category', relation: { contains: 'cat-1' } },
          ],
        },
      })
    );
  });

  it('tag 필터를 적용한다', async () => {
    vi.mocked(notionClient.dataSources.query).mockResolvedValueOnce(createPostQueryResponse([]));

    await fetchPosts('db-1', { tag: 'react' });

    expect(notionClient.dataSources.query).toHaveBeenCalledWith(
      expect.objectContaining({
        filter: {
          and: [
            { property: 'isPublished', checkbox: { equals: true } },
            { property: 'tag', multi_select: { contains: 'react' } },
          ],
        },
      })
    );
  });

  it('모든 필터를 동시에 적용한다', async () => {
    vi.mocked(notionClient.dataSources.query).mockResolvedValueOnce(createPostQueryResponse([]));

    await fetchPosts('db-1', { categoryId: 'cat-1', tag: 'react' });

    expect(notionClient.dataSources.query).toHaveBeenCalledWith(
      expect.objectContaining({
        filter: {
          and: [
            { property: 'isPublished', checkbox: { equals: true } },
            { property: 'category', relation: { contains: 'cat-1' } },
            { property: 'tag', multi_select: { contains: 'react' } },
          ],
        },
      })
    );
  });

  it('기본 정렬은 publishedAt 내림차순이다', async () => {
    vi.mocked(notionClient.dataSources.query).mockResolvedValueOnce(createPostQueryResponse([]));

    await fetchPosts('db-1');

    expect(notionClient.dataSources.query).toHaveBeenCalledWith(
      expect.objectContaining({
        sorts: [{ property: 'publishedAt', direction: 'descending' }],
      })
    );
  });

  it('커스텀 정렬 옵션을 적용한다', async () => {
    vi.mocked(notionClient.dataSources.query).mockResolvedValueOnce(createPostQueryResponse([]));

    await fetchPosts('db-1', undefined, { field: 'createdAt', direction: 'ascending' });

    expect(notionClient.dataSources.query).toHaveBeenCalledWith(
      expect.objectContaining({
        sorts: [{ property: 'createdAt', direction: 'ascending' }],
      })
    );
  });

  it('빈 결과를 처리한다', async () => {
    vi.mocked(notionClient.dataSources.query).mockResolvedValueOnce(createPostQueryResponse([]));

    const result = await fetchPosts('db-1');

    expect(result).toEqual([]);
  });
});

// ─── fetchPost ────────────────────────────────────────────────────────────────

describe('fetchPost', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('pageId로 포스트를 가져와 파싱된 Post를 반환한다', async () => {
    const mockPage = createMockPostPage({
      id: { prefix: 'post-page', number: 1 },
      title: 'Test Post',
      categoryId: 'cat-1',
      status: 'completed',
      description: 'desc',
      isPublished: true,
      publishedAt: '2025-06-15',
      tags: ['tag1'],
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-06-15T00:00:00.000Z',
    });

    vi.mocked(notionClient.pages.retrieve).mockResolvedValueOnce(mockPage as PostRetrieveResponse);

    const result = await fetchPost('post-page1');

    expect(result).toEqual<Post>({
      id: 'post-page1',
      title: 'Test Post',
      categoryId: 'cat-1',
      status: 'completed',
      description: 'desc',
      isPublished: true,
      publishedAt: '2025-06-15',
      slug: 'post-page1',
      tags: ['tag1'],
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-06-15T00:00:00.000Z',
    });
    expect(notionClient.pages.retrieve).toHaveBeenCalledWith({ page_id: 'post-page1' });
  });

  it('API 에러를 전파한다', async () => {
    vi.mocked(notionClient.pages.retrieve).mockRejectedValueOnce(new Error('Not Found'));

    await expect(fetchPost('invalid-id')).rejects.toThrow('Not Found');
  });
});
