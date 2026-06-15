import { createMockPostPage } from '@/shared/testing/fixture';
import { notionClient } from '@/features/post/api/client';
import { fetchPostPage, fetchPostPages } from '@/features/post/api/post';
import { NOTION_LIMITS } from '@/features/post/constants';
import type { PostPage } from '@/features/post/model';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/features/post/api/client', () => ({
  notionClient: {
    dataSources: { query: vi.fn() },
    pages: { retrieve: vi.fn() },
  },
}));

type PostQueryResponse = Awaited<ReturnType<typeof notionClient.dataSources.query>>;
type PostRetrieveResponse = Awaited<ReturnType<typeof notionClient.pages.retrieve>>;

function queryResponse(results: PostPage[], hasMore = false, nextCursor: string | null = null): PostQueryResponse {
  return {
    object: 'list',
    results,
    has_more: hasMore,
    next_cursor: nextCursor,
    type: 'page_or_database',
    page_or_database: {},
  } as PostQueryResponse;
}

describe('fetchPostPages', () => {
  beforeEach(() => vi.clearAllMocks());

  it('fetches raw post pages with pagination', async () => {
    const page1 = createMockPostPage({ id: { prefix: 'post-', number: 1 } });
    const page2 = createMockPostPage({ id: { prefix: 'post-', number: 2 } });

    vi.mocked(notionClient.dataSources.query)
      .mockResolvedValueOnce(queryResponse([page1], true, 'next'))
      .mockResolvedValueOnce(queryResponse([page2]));

    const result = await fetchPostPages('db-1');

    expect(result).toEqual([page1, page2]);
    expect(notionClient.dataSources.query).toHaveBeenNthCalledWith(1, {
      data_source_id: 'db-1',
      page_size: NOTION_LIMITS.MAX_PAGE_SIZE,
      start_cursor: undefined,
      filter: undefined,
      sorts: undefined,
    });
    expect(notionClient.dataSources.query).toHaveBeenNthCalledWith(2, {
      data_source_id: 'db-1',
      page_size: NOTION_LIMITS.MAX_PAGE_SIZE,
      start_cursor: 'next',
      filter: undefined,
      sorts: undefined,
    });
  });

  it('passes raw Notion query options through without interpreting them', async () => {
    const filter = { property: 'isPublished', checkbox: { equals: true } } as const;
    const sorts = [{ property: 'publishedAt', direction: 'descending' as const }];

    vi.mocked(notionClient.dataSources.query).mockResolvedValue(queryResponse([]));

    await fetchPostPages('db-1', { filter, sorts });

    expect(notionClient.dataSources.query).toHaveBeenCalledWith({
      data_source_id: 'db-1',
      page_size: NOTION_LIMITS.MAX_PAGE_SIZE,
      start_cursor: undefined,
      filter,
      sorts,
    });
  });
});

describe('fetchPostPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('fetches a raw post page by id', async () => {
    const page = createMockPostPage();
    vi.mocked(notionClient.pages.retrieve).mockResolvedValue(page as PostRetrieveResponse);

    await expect(fetchPostPage('post-1')).resolves.toEqual(page);
    expect(notionClient.pages.retrieve).toHaveBeenCalledWith({ page_id: 'post-1' });
  });
});
