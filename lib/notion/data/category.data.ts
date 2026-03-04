/**
 * Category Data - Entry point for pages
 *
 * Combines core (API) + domain (transforms)
 */

import { fetchAllCategories } from '@/lib/notion/core/category.api';
import { ISR_CONFIG } from '@/lib/notion/core/config';
import { buildCategoryMaps, buildCategoryTree } from '@/lib/notion/domain/category';
import type { Category, CategoryTreeNode, CategoryWithFullPath } from '@/types/notion';
import { cache } from 'react';

/**
 * Get all categories (cached)
 */
export const getCategories = cache(async (): Promise<Category[]> => {
  return await fetchAllCategories(ISR_CONFIG.CATEGORY_DATABASE_ID, { activeOnly: true });
});

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
