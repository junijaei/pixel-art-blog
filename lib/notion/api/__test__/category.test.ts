import { createMockCategoryPage } from '@/__test__/fixture';
import { notionClient } from '@/lib/notion/api/client';
import { fetchCategoryPage, fetchCategoryPages } from '@/lib/notion/api/category';
import { NOTION_LIMITS } from '@/lib/notion/constants';
import type { CategoryPage } from '@/types/notion';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/notion/api/client', () => ({
  notionClient: {
    dataSources: { query: vi.fn() },
    pages: { retrieve: vi.fn() },
  },
}));

type CategoryQueryResponse = Awaited<ReturnType<typeof notionClient.dataSources.query>>;
type CategoryRetrieveResponse = Awaited<ReturnType<typeof notionClient.pages.retrieve>>;

function queryResponse(
  results: CategoryPage[],
  hasMore = false,
  nextCursor: string | null = null
): CategoryQueryResponse {
  return {
    object: 'list',
    results,
    has_more: hasMore,
    next_cursor: nextCursor,
    type: 'page_or_database',
    page_or_database: {},
  } as CategoryQueryResponse;
}

describe('fetchCategoryPages', () => {
  beforeEach(() => vi.clearAllMocks());

  it('fetches raw category pages with pagination', async () => {
    const page1 = createMockCategoryPage({ id: { prefix: 'cat-', number: 1 } });
    const page2 = createMockCategoryPage({ id: { prefix: 'cat-', number: 2 } });

    vi.mocked(notionClient.dataSources.query)
      .mockResolvedValueOnce(queryResponse([page1], true, 'next'))
      .mockResolvedValueOnce(queryResponse([page2]));

    const result = await fetchCategoryPages('db-1');

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
    const filter = { property: 'isActive', select: { equals: 'active' } } as const;
    const sorts = [{ property: 'createdAt', direction: 'ascending' as const }];

    vi.mocked(notionClient.dataSources.query).mockResolvedValue(queryResponse([]));

    await fetchCategoryPages('db-1', { filter, sorts });

    expect(notionClient.dataSources.query).toHaveBeenCalledWith({
      data_source_id: 'db-1',
      page_size: NOTION_LIMITS.MAX_PAGE_SIZE,
      start_cursor: undefined,
      filter,
      sorts,
    });
  });
});

describe('fetchCategoryPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('fetches a raw category page by id', async () => {
    const page = createMockCategoryPage();
    vi.mocked(notionClient.pages.retrieve).mockResolvedValue(page as CategoryRetrieveResponse);

    await expect(fetchCategoryPage('cat-1')).resolves.toEqual(page);
    expect(notionClient.pages.retrieve).toHaveBeenCalledWith({ page_id: 'cat-1' });
  });
});
