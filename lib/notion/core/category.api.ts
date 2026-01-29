/**
 * Category Database API
 * 카테고리 데이터베이스 서버 전용 API 함수
 */

import { notionClient } from '@/lib/notion/core/client';
import type { Category, CategoryFilterOptions, CategoryPage } from '@/types/notion';
import { CATEGORY_PROPERTIES, CATEGORY_STATUS, NOTION_LIMITS } from './config';

/**
 * 카테고리 페이지를 파싱된 Category 객체로 변환
 */
function parseCategoryPage(page: CategoryPage): Category {
  const props = page.properties;

  // label (title 타입)
  const labelProp = props[CATEGORY_PROPERTIES.LABEL];
  const label = labelProp?.type === 'title' && labelProp.title.length > 0 ? labelProp.title[0].plain_text : '';

  // parent (관계형)
  const parentProp = props[CATEGORY_PROPERTIES.PARENT];
  const parentId = parentProp?.type === 'relation' && parentProp.relation.length > 0 ? parentProp.relation[0].id : null;

  // children (관계형)
  const childrenProp = props[CATEGORY_PROPERTIES.CHILDREN];
  const hasChildren = childrenProp?.type === 'relation' && childrenProp.relation.length > 0;

  // path (text 타입)
  const pathProp = props[CATEGORY_PROPERTIES.PATH];
  const path = pathProp?.type === 'rich_text' && pathProp.rich_text.length > 0 ? pathProp.rich_text[0].plain_text : '';

  // isActive (select 타입)
  const isActiveProp = props[CATEGORY_PROPERTIES.IS_ACTIVE];
  const isActive = isActiveProp?.type === 'select' && isActiveProp.select?.name === CATEGORY_STATUS.ACTIVE;

  // createdAt
  const createdAtProp = props[CATEGORY_PROPERTIES.CREATED_AT];
  const createdAt = createdAtProp?.type === 'created_time' ? createdAtProp.created_time : '';

  // updatedAt
  const updatedAtProp = props[CATEGORY_PROPERTIES.UPDATED_AT];
  const updatedAt = updatedAtProp?.type === 'last_edited_time' ? updatedAtProp.last_edited_time : '';

  return {
    id: page.id,
    label,
    parentId,
    hasChildren,
    path,
    isActive,
    createdAt,
    updatedAt,
  };
}

/**
 * 모든 카테고리 가져오기 (자동 페이지네이션)
 */
export async function fetchAllCategories(databaseId: string, options?: CategoryFilterOptions): Promise<Category[]> {
  const categories: CategoryPage[] = [];
  let cursor: string | undefined = undefined;
  let hasMore = true;

  // 필터 구성
  const filters: any[] = [];

  // activeOnly 옵션
  if (options?.activeOnly !== false) {
    filters.push({
      property: CATEGORY_PROPERTIES.IS_ACTIVE,
      select: {
        equals: CATEGORY_STATUS.ACTIVE,
      },
    });
  }

  // parentId 옵션
  if (options?.parentId) {
    filters.push({
      property: CATEGORY_PROPERTIES.PARENT,
      relation: {
        contains: options.parentId,
      },
    });
  }

  // rootOnly 옵션
  if (options?.rootOnly) {
    filters.push({
      property: CATEGORY_PROPERTIES.PARENT,
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
          property: CATEGORY_PROPERTIES.CREATED_AT,
          direction: 'ascending',
        },
      ],
    });

    categories.push(...(response.results as CategoryPage[]));
    hasMore = response.has_more;
    cursor = response.next_cursor ?? undefined;
  }

  return categories.map(parseCategoryPage);
}

/**
 * 특정 카테고리 가져오기
 */
export async function fetchCategory(pageId: string): Promise<Category> {
  const page = await notionClient.pages.retrieve({
    page_id: pageId,
  });

  return parseCategoryPage(page as CategoryPage);
}
