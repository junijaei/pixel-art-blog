/**
 * Category Database API
 * 카테고리 데이터베이스 서버 전용 API 함수
 */

import type { Category, CategoryFilterOptions, CategoryPage, CategoryTreeNode } from '@/types/notion';
import { notionClient } from './client';
import { NOTION_LIMITS } from './constants';

/**
 * 카테고리 페이지를 파싱된 Category 객체로 변환
 */
export function parseCategoryPage(page: CategoryPage): Category {
  const properties = page.properties;

  // label (title 타입)
  const labelProp = properties.label;
  const label = labelProp?.type === 'title' && labelProp.title.length > 0 ? labelProp.title[0].plain_text : '';

  // parent (관계형)
  const parentProp = properties.parent;
  const parentId = parentProp?.type === 'relation' && parentProp.relation.length > 0 ? parentProp.relation[0].id : null;

  // path (text 타입)
  const pathProp = properties.path;
  const path = pathProp?.type === 'rich_text' && pathProp.rich_text.length > 0 ? pathProp.rich_text[0].plain_text : '';

  // isActive (select 타입)
  const isActiveProp = properties.isActive;
  const isActive = isActiveProp?.type === 'select' && isActiveProp.select?.name === 'active';

  // createdAt
  const createdAtProp = properties.createdAt;
  const createdAt = createdAtProp?.type === 'created_time' ? createdAtProp.created_time : '';

  // updatedAt
  const updatedAtProp = properties.updatedAt;
  const updatedAt = updatedAtProp?.type === 'last_edited_time' ? updatedAtProp.last_edited_time : '';

  return {
    id: page.id,
    label,
    parentId,
    path,
    isActive,
    createdAt,
    updatedAt,
  };
}

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
 * 모든 카테고리를 트리 구조로 변환
 */
export function buildCategoryTree(categories: Category[]): CategoryTreeNode[] {
  const categoryMap = new Map<string, CategoryTreeNode>();
  const rootCategories: CategoryTreeNode[] = [];

  // 1단계: 모든 카테고리를 TreeNode로 변환하여 Map에 저장
  categories.forEach((category) => {
    categoryMap.set(category.id, {
      ...category,
      children: [],
      depth: 0,
    });
  });

  // 2단계: 부모-자식 관계 설정
  categoryMap.forEach((node) => {
    if (node.parentId) {
      const parent = categoryMap.get(node.parentId);
      if (parent) {
        parent.children.push(node);
        node.depth = parent.depth + 1;
      } else {
        // 부모를 찾을 수 없으면 루트로 처리
        rootCategories.push(node);
      }
    } else {
      rootCategories.push(node);
    }
  });

  // 3단계: 각 레벨에서 label로 정렬
  const sortChildren = (nodes: CategoryTreeNode[]) => {
    nodes.sort((a, b) => a.label.localeCompare(b.label));
    nodes.forEach((node) => {
      if (node.children.length > 0) {
        sortChildren(node.children);
      }
    });
  };

  sortChildren(rootCategories);

  return rootCategories;
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
