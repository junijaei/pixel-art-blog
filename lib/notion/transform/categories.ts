/**
 * Category Transform - Pure functions
 *
 * NO I/O, NO SDK - pure data transformation
 */

import { CATEGORY_PROPERTIES, CATEGORY_STATUS } from '@/lib/notion/constants';
import type { BreadcrumbItem } from '@/lib/notion/types';
import type { Category, CategoryPage, CategoryTreeNode, CategoryWithFullPath } from '@/types/notion';

export function toCategory(page: CategoryPage): Category {
  const props = page.properties;

  const labelProp = props[CATEGORY_PROPERTIES.LABEL];
  const label = labelProp?.type === 'title' && labelProp.title.length > 0 ? labelProp.title[0].plain_text : '';

  const parentProp = props[CATEGORY_PROPERTIES.PARENT];
  const parentId = parentProp?.type === 'relation' && parentProp.relation.length > 0 ? parentProp.relation[0].id : null;

  const childrenProp = props[CATEGORY_PROPERTIES.CHILDREN];
  const hasChildren = childrenProp?.type === 'relation' && childrenProp.relation.length > 0;

  const pathProp = props[CATEGORY_PROPERTIES.PATH];
  const path = pathProp?.type === 'rich_text' && pathProp.rich_text.length > 0 ? pathProp.rich_text[0].plain_text : '';

  const isActiveProp = props[CATEGORY_PROPERTIES.IS_ACTIVE];
  const isActive = isActiveProp?.type === 'select' && isActiveProp.select?.name === CATEGORY_STATUS.ACTIVE;

  const postCountProp = props[CATEGORY_PROPERTIES.POST_COUNT];
  const postCount =
    postCountProp?.type === 'rollup' && postCountProp.rollup?.type === 'number'
      ? (postCountProp.rollup?.number ?? 0)
      : 0;

  const createdAtProp = props[CATEGORY_PROPERTIES.CREATED_AT];
  const createdAt = createdAtProp?.type === 'created_time' ? createdAtProp.created_time : '';

  const updatedAtProp = props[CATEGORY_PROPERTIES.UPDATED_AT];
  const updatedAt = updatedAtProp?.type === 'last_edited_time' ? updatedAtProp.last_edited_time : '';

  return {
    id: page.id,
    label,
    parentId,
    hasChildren,
    path,
    isActive,
    postCount,
    createdAt,
    updatedAt,
  };
}

export function toCategories(pages: CategoryPage[]): Category[] {
  return pages.map(toCategory);
}

/**
 * Build fullPath from categoryId
 */
export function buildFullPath(categoryId: string, categoryMap: Map<string, Category>): string {
  const segments: string[] = [];
  let currentId: string | null = categoryId;

  while (currentId) {
    const category = categoryMap.get(currentId);
    if (!category) break;

    if (category.parentId !== null) {
      segments.push(category.path);
    }
    currentId = category.parentId;
  }

  return segments.reverse().join('/');
}

/**
 * Enrich categories with fullPath
 */
export function enrichCategoriesWithFullPath(categories: Category[]): CategoryWithFullPath[] {
  const baseMap = new Map(categories.map((cat) => [cat.id, cat]));

  return categories.map((cat) => ({
    ...cat,
    fullPath: buildFullPath(cat.id, baseMap),
  }));
}

/**
 * Find category by path in tree
 */
export function findCategoryByPath(tree: CategoryTreeNode[], path: string): CategoryTreeNode | null {
  for (const node of tree) {
    if (node.path === path) return node;
    if (node.children.length > 0) {
      const found = findCategoryByPath(node.children, path);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Get all descendant IDs from a category node
 */
export function getAllDescendantIds(node: CategoryTreeNode): string[] {
  const ids = [node.id];
  node.children.forEach((child) => {
    ids.push(...getAllDescendantIds(child));
  });
  return ids;
}

/**
 * Build breadcrumb items from fullPath
 */
export function buildBreadcrumbItems(
  fullPath: string,
  categoryByFullPathMap: Map<string, CategoryWithFullPath>
): BreadcrumbItem[] {
  if (!fullPath) return [];

  const segments = fullPath.split('/');
  const items: BreadcrumbItem[] = [{ label: 'all', path: '' }];

  for (let i = 0; i < segments.length; i++) {
    const partialPath = segments.slice(0, i + 1).join('/');
    const category = categoryByFullPathMap.get(partialPath);
    if (category) {
      items.push({ label: category.label, path: partialPath });
    }
  }

  return items;
}

/**
 * Build category maps for lookup
 */
export function buildCategoryMaps(categories: Category[]): {
  byId: Map<string, CategoryWithFullPath>;
  byFullPath: Map<string, CategoryWithFullPath>;
} {
  const categoriesWithFullPath = enrichCategoriesWithFullPath(categories);

  return {
    byId: new Map(categoriesWithFullPath.map((cat) => [cat.id, cat])),
    byFullPath: new Map(categoriesWithFullPath.map((cat) => [cat.fullPath, cat])),
  };
}

/**
 * Build category tree from flat array
 */
export function buildCategoryTree(categories: Category[]): CategoryTreeNode[] {
  const categoryMap = new Map<string, CategoryTreeNode>();
  const rootCategories: CategoryTreeNode[] = [];

  categories.forEach((category) => {
    categoryMap.set(category.id, {
      ...category,
      children: [],
      depth: 0,
      cumulativePostCount: 0,
    });
  });

  categoryMap.forEach((node) => {
    if (node.parentId) {
      const parent = categoryMap.get(node.parentId);
      if (parent) {
        parent.children.push(node);
        node.depth = parent.depth + 1;
      } else {
        rootCategories.push(node);
      }
    } else {
      rootCategories.push(node);
    }
  });

  // Bottom-up aggregation: compute cumulativePostCount for every node.
  // Post-order DFS — children are fully computed before their parent.
  function computeCumulative(node: CategoryTreeNode): number {
    const childSum = node.children.reduce((sum, child) => sum + computeCumulative(child), 0);
    node.cumulativePostCount = node.postCount + childSum;
    return node.cumulativePostCount;
  }

  rootCategories.forEach(computeCumulative);

  return rootCategories;
}
