/**
 * Category Data - Entry point for pages
 *
 * Combines core (API) + domain (transforms)
 */

import { fetchAllCategories } from '@/lib/notion/core/category.api';
import { ISR_CONFIG } from '@/lib/notion/core/config';
import { buildCategoryMaps, buildCategoryTree } from '@/lib/notion/domain/category';
import type { CategoryTreeNode, CategoryWithFullPath } from '@/types/notion';
import { unstable_cache } from 'next/cache';
import { cache } from 'react';

// 카테고리 데이터는 자주 변경되지 않으므로 요청 간 캐싱 적용 (1시간)
// unstable_cache: ISR 재검증 사이클 전반에 걸쳐 Notion API 호출 최소화
// cache(): 단일 렌더 패스 내 중복 호출 방지
const fetchCategoriesFromNotion = unstable_cache(
  async () => fetchAllCategories(ISR_CONFIG.CATEGORY_DATABASE_ID, { activeOnly: true }),
  ['notion-categories'],
  { revalidate: 3600 }
);

/**
 * Get all categories (cross-request cached)
 */
export const getCategories = cache(fetchCategoriesFromNotion);

/**
 * Get category maps (cached)
 */
export const getCategoryMaps = cache(async () => {
  const categories = await getCategories();
  return buildCategoryMaps(categories);
});

/**
 * Get category tree (cached)
 */
export const getCategoryTree = cache(async (): Promise<CategoryTreeNode[]> => {
  const categories = await getCategories();
  return buildCategoryTree(categories);
});

/**
 * Get category by ID
 */
export async function getCategoryById(categoryId: string): Promise<CategoryWithFullPath | null> {
  const maps = await getCategoryMaps();
  return maps.byId.get(categoryId) ?? null;
}

/**
 * Get category by fullPath
 */
export async function getCategoryByFullPath(fullPath: string): Promise<CategoryWithFullPath | null> {
  const maps = await getCategoryMaps();
  return maps.byFullPath.get(fullPath) ?? null;
}

/**
 * Get bundled category data (for pages that need both)
 */
export async function getCategoryDataBundle() {
  const [categories, categoryMaps] = await Promise.all([getCategories(), getCategoryMaps()]);
  return { categories, categoryMaps };
}
