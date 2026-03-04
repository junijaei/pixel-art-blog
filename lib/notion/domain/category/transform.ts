/**
 * Category Transform - Pure functions
 *
 * NO I/O, NO SDK - pure data transformation
 */

import type { BreadcrumbItem } from '@/lib/notion/shared/types';
import type { Category, CategoryTreeNode, CategoryWithFullPath } from '@/types/notion';

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
      items.push({ label: category.label, path: category.path });
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
    console.log('compute cumulative', node.cumulativePostCount, childSum, node.postCount);
    return node.cumulativePostCount;
  }

  rootCategories.forEach(computeCumulative);

  return rootCategories;
}
