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

import { createMockCategoryPage } from '@/__test__/fixture';
import { fetchAllCategories, fetchCategory } from '@/lib/notion/core/category.api';
import { notionClient } from '@/lib/notion/core/client';
import { NOTION_LIMITS } from '@/lib/notion/core/config';
import type { Category } from '@/types/notion';

// ─── fetchAllCategories ────────────────────────────────────────────────────────

describe('fetchAllCategories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('CategoryPage를 파싱된 Category 객체로 변환하여 반환한다', async () => {
    const mockPage = createMockCategoryPage({
      id: { prefix: 'cat', number: 1 },
      label: 'Frontend',
      parentId: 'cat-root',
      childrenIds: ['cat-child-1', 'cat-child-2'],
      path: '/frontend',
      isActive: true,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-06-15T12:00:00.000Z',
    });

    vi.mocked(notionClient.dataSources.query).mockResolvedValueOnce({
      results: [mockPage],
      has_more: false,
      next_cursor: null,
      object: 'list',
      type: 'page_or_database',
    } as any);

    const result = await fetchAllCategories('db-1');

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual<Category>({
      id: 'cat1',
      label: 'Frontend',
      parentId: 'cat-root',
      hasChildren: true,
      path: '/frontend',
      isActive: true,
      postCount: 0,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-06-15T12:00:00.000Z',
    });
  });

  it('빈 속성값을 올바르게 파싱한다', async () => {
    const mockPage = createMockCategoryPage({
      label: '',
      parentId: null,
      childrenIds: [],
      path: '',
    });

    vi.mocked(notionClient.dataSources.query).mockResolvedValueOnce({
      results: [mockPage],
      has_more: false,
      next_cursor: null,
      object: 'list',
      type: 'page_or_database',
    } as any);

    const result = await fetchAllCategories('db-1');

    expect(result[0].label).toBe('');
    expect(result[0].parentId).toBeNull();
    expect(result[0].hasChildren).toBe(false);
    expect(result[0].path).toBe('');
  });

  it('isActive가 deactive이면 false를 반환한다', async () => {
    const mockPage = createMockCategoryPage({ isActive: false });

    vi.mocked(notionClient.dataSources.query).mockResolvedValueOnce({
      results: [mockPage],
      has_more: false,
      next_cursor: null,
      object: 'list',
      type: 'page_or_database',
    } as any);

    const result = await fetchAllCategories('db-1');
    expect(result[0].isActive).toBe(false);
  });

  it('isActive select가 null이면 false를 반환한다', async () => {
    const mockPage = createMockCategoryPage();
    (mockPage.properties.isActive as any).select = null;

    vi.mocked(notionClient.dataSources.query).mockResolvedValueOnce({
      results: [mockPage],
      has_more: false,
      next_cursor: null,
      object: 'list',
      type: 'page_or_database',
    } as any);

    const result = await fetchAllCategories('db-1');
    expect(result[0].isActive).toBe(false);
  });

  it('prefix가 null인 경우 number만으로 id를 생성한다', async () => {
    const mockPage = createMockCategoryPage({
      id: { prefix: null, number: 42 },
    });

    vi.mocked(notionClient.dataSources.query).mockResolvedValueOnce({
      results: [mockPage],
      has_more: false,
      next_cursor: null,
      object: 'list',
      type: 'page_or_database',
    } as any);

    const result = await fetchAllCategories('db-1');
    expect(result[0].id).toBe('42');
  });

  it('여러 카테고리를 모두 파싱하여 반환한다', async () => {
    const mockPages = [
      createMockCategoryPage({ id: { prefix: 'c', number: 1 }, label: 'Cat 1' }),
      createMockCategoryPage({ id: { prefix: 'c', number: 2 }, label: 'Cat 2' }),
    ];

    vi.mocked(notionClient.dataSources.query).mockResolvedValueOnce({
      results: mockPages,
      has_more: false,
      next_cursor: null,
      object: 'list',
      type: 'page_or_database',
    } as any);

    const result = await fetchAllCategories('db-1');

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('c1');
    expect(result[0].label).toBe('Cat 1');
    expect(result[1].id).toBe('c2');
    expect(result[1].label).toBe('Cat 2');
  });

  it('자동 페이지네이션을 처리하고 파싱된 결과를 합친다', async () => {
    const page1 = [createMockCategoryPage({ id: { prefix: 'c', number: 1 }, label: 'First' })];
    const page2 = [createMockCategoryPage({ id: { prefix: 'c', number: 2 }, label: 'Second' })];

    vi.mocked(notionClient.dataSources.query)
      .mockResolvedValueOnce({
        results: page1,
        has_more: true,
        next_cursor: 'cursor-1',
        object: 'list',
        type: 'page_or_database',
      } as any)
      .mockResolvedValueOnce({
        results: page2,
        has_more: false,
        next_cursor: null,
        object: 'list',
        type: 'page_or_database',
      } as any);

    const result = await fetchAllCategories('db-1');

    expect(result).toHaveLength(2);
    expect(result[0].label).toBe('First');
    expect(result[1].label).toBe('Second');
    expect(notionClient.dataSources.query).toHaveBeenCalledTimes(2);
    expect(notionClient.dataSources.query).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ start_cursor: 'cursor-1' })
    );
  });

  it('기본적으로 activeOnly 필터를 적용한다', async () => {
    vi.mocked(notionClient.dataSources.query).mockResolvedValueOnce({
      results: [],
      has_more: false,
      next_cursor: null,
      object: 'list',
      type: 'page_or_database',
    } as any);

    await fetchAllCategories('db-1');

    expect(notionClient.dataSources.query).toHaveBeenCalledWith(
      expect.objectContaining({
        data_source_id: 'db-1',
        page_size: NOTION_LIMITS.MAX_PAGE_SIZE,
        filter: { property: 'isActive', select: { equals: 'active' } },
      })
    );
  });

  it('activeOnly: false 옵션이면 active 필터를 적용하지 않는다', async () => {
    vi.mocked(notionClient.dataSources.query).mockResolvedValueOnce({
      results: [],
      has_more: false,
      next_cursor: null,
      object: 'list',
      type: 'page_or_database',
    } as any);

    await fetchAllCategories('db-1', { activeOnly: false });

    expect(notionClient.dataSources.query).toHaveBeenCalledWith(
      expect.objectContaining({
        filter: undefined,
      })
    );
  });

  it('parentId 필터를 적용한다', async () => {
    vi.mocked(notionClient.dataSources.query).mockResolvedValueOnce({
      results: [],
      has_more: false,
      next_cursor: null,
      object: 'list',
      type: 'page_or_database',
    } as any);

    await fetchAllCategories('db-1', { parentId: 'parent-1' });

    expect(notionClient.dataSources.query).toHaveBeenCalledWith(
      expect.objectContaining({
        filter: {
          and: [
            { property: 'isActive', select: { equals: 'active' } },
            { property: 'parent', relation: { contains: 'parent-1' } },
          ],
        },
      })
    );
  });

  it('rootOnly 필터를 적용한다', async () => {
    vi.mocked(notionClient.dataSources.query).mockResolvedValueOnce({
      results: [],
      has_more: false,
      next_cursor: null,
      object: 'list',
      type: 'page_or_database',
    } as any);

    await fetchAllCategories('db-1', { rootOnly: true });

    expect(notionClient.dataSources.query).toHaveBeenCalledWith(
      expect.objectContaining({
        filter: {
          and: [
            { property: 'isActive', select: { equals: 'active' } },
            { property: 'parent', relation: { is_empty: true } },
          ],
        },
      })
    );
  });

  it('모든 필터를 동시에 적용한다', async () => {
    vi.mocked(notionClient.dataSources.query).mockResolvedValueOnce({
      results: [],
      has_more: false,
      next_cursor: null,
      object: 'list',
      type: 'page_or_database',
    } as any);

    await fetchAllCategories('db-1', { parentId: 'p-1', rootOnly: true });

    expect(notionClient.dataSources.query).toHaveBeenCalledWith(
      expect.objectContaining({
        filter: {
          and: [
            { property: 'isActive', select: { equals: 'active' } },
            { property: 'parent', relation: { contains: 'p-1' } },
            { property: 'parent', relation: { is_empty: true } },
          ],
        },
      })
    );
  });

  it('createdAt 오름차순으로 정렬한다', async () => {
    vi.mocked(notionClient.dataSources.query).mockResolvedValueOnce({
      results: [],
      has_more: false,
      next_cursor: null,
      object: 'list',
      type: 'page_or_database',
    } as any);

    await fetchAllCategories('db-1');

    expect(notionClient.dataSources.query).toHaveBeenCalledWith(
      expect.objectContaining({
        sorts: [{ property: 'createdAt', direction: 'ascending' }],
      })
    );
  });

  it('빈 결과를 처리한다', async () => {
    vi.mocked(notionClient.dataSources.query).mockResolvedValueOnce({
      results: [],
      has_more: false,
      next_cursor: null,
      object: 'list',
      type: 'page_or_database',
    } as any);

    const result = await fetchAllCategories('db-1');

    expect(result).toEqual([]);
  });
});

// ─── fetchCategory ────────────────────────────────────────────────────────────

describe('fetchCategory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('pageId로 카테고리를 가져와 파싱된 Category를 반환한다', async () => {
    const mockPage = createMockCategoryPage({
      id: { prefix: 'cat', number: 123 },
      label: 'Frontend',
      parentId: 'root-1',
      childrenIds: ['child-1'],
      path: '/frontend',
      isActive: true,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-06-15T00:00:00.000Z',
    });

    vi.mocked(notionClient.pages.retrieve).mockResolvedValueOnce(mockPage as any);

    const result = await fetchCategory('cat-123');

    expect(result).toEqual<Category>({
      id: 'cat123',
      label: 'Frontend',
      parentId: 'root-1',
      hasChildren: true,
      path: '/frontend',
      isActive: true,
      postCount: 0,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-06-15T00:00:00.000Z',
    });
    expect(notionClient.pages.retrieve).toHaveBeenCalledWith({ page_id: 'cat-123' });
  });

  it('API 에러를 전파한다', async () => {
    vi.mocked(notionClient.pages.retrieve).mockRejectedValueOnce(new Error('Not Found'));

    await expect(fetchCategory('invalid-id')).rejects.toThrow('Not Found');
  });
});
