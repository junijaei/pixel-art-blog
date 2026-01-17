/**
 * Category Database API
 * 카테고리 데이터베이스 서버 전용 API 함수
 */

import type { CategoryFilterOptions, CategoryPage } from '@/types/notion';
import { NOTION_LIMITS } from '../config';
import { parseCategoryPage } from '../util';
import { notionClient } from './client';

/**
 * 모든 카테고리 가져오기 (자동 페이지네이션)
 */
export async function getAllCategories(databaseId: string, options?: CategoryFilterOptions): Promise<CategoryPage[]> {
  const categories: CategoryPage[] = [];
  let cursor: string | undefined = undefined;
  let hasMore = true;

  // 필터 구성
  const filters: any[] = [];

  // activeOnly 옵션
  if (options?.activeOnly !== false) {
    filters.push({
      property: 'isActive',
      select: {
        equals: 'active',
      },
    });
  }

  // parentId 옵션
  if (options?.parentId) {
    filters.push({
      property: 'parent',
      relation: {
        contains: options.parentId,
      },
    });
  }

  // rootOnly 옵션
  if (options?.rootOnly) {
    filters.push({
      property: 'parent',
      relation: {
        is_empty: true,
      },
    });
  }

  const filter = filters.length > 0 ? (filters.length === 1 ? filters[0] : { and: filters }) : undefined;

  while (hasMore) {
    const response = await notionClient.dataSources.query({
      data_source_id: databaseId,
      page_size: NOTION_LIMITS.MAX_PAGE_SIZE,
      start_cursor: cursor,
      filter,
      sorts: [
        {
          property: 'createdAt',
          direction: 'ascending',
        },
      ],
    });

    categories.push(...(response.results as CategoryPage[]));
    hasMore = response.has_more;
    cursor = response.next_cursor ?? undefined;
  }

  return categories;
}

/**
 * 특정 카테고리 가져오기
 */
export async function getCategory(pageId: string): Promise<CategoryPage> {
  const page = await notionClient.pages.retrieve({
    page_id: pageId,
  });

  return page as CategoryPage;
}

/**
 * 경로로 카테고리 찾기
 */
export async function getCategoryByPath(databaseId: string, path: string): Promise<CategoryPage | null> {
  const response = await notionClient.dataSources.query({
    data_source_id: databaseId,
    filter: {
      property: 'path',
      rich_text: {
        equals: path,
      },
    },
  });

  const page = response.results[0] as CategoryPage | undefined;
  return page ?? null;
}

/**
 * 카테고리 ID로 전체 경로 가져오기
 */
export async function getCategoryPath(databaseId: string, categoryId: string): Promise<string> {
  const category = await getCategory(categoryId);
  const parsed = parseCategoryPage(category as CategoryPage);

  return parsed.path;
}

/**
 * generateStaticParams용 모든 카테고리 경로 가져오기
 */
export async function getAllCategoryPaths(databaseId: string): Promise<string[]> {
  const categories = await getAllCategories(databaseId, { activeOnly: true });

  return categories
    .map((category) => {
      const parsed = parseCategoryPage(category);
      return parsed.path;
    })
    .filter((path): path is string => path !== '');
}
