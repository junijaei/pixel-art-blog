import { cache } from 'react';

import { enrichBlocksWithChildren, fetchBlockChildren } from '@/lib/notion/api/block.api';
import { getAllCategories as fetchAllCategories } from '@/lib/notion/api/category.api';
import { notionClient } from '@/lib/notion/api/client';
import { getAllPosts as fetchAllPosts, parsePostPage } from '@/lib/notion/api/post.api';
import type {
  Block,
  Category,
  CategoryTreeNode,
  CategoryWithFullPath,
  Post,
  PostCardData,
  PostPage,
} from '@/types/notion';
import { ISR_CONFIG } from '../config';
import { buildCategoryTree, parseCategoryPage } from '../util';

export const getCachedCategories = cache(async (): Promise<Category[]> => {
  const categoryPages = await fetchAllCategories(ISR_CONFIG.CATEGORY_DATABASE_ID, { activeOnly: true });
  return categoryPages.map(parseCategoryPage);
});

export const getCategoryMap = cache(async (): Promise<Map<string, Category>> => {
  const categories = await getCachedCategories();
  return new Map(categories.map((cat) => [cat.id, cat]));
});

function buildFullPath(categoryId: string, categoryMap: Map<string, Category>): string {
  const segments: string[] = [];
  let currentId: string | null = categoryId;

  while (currentId) {
    const category = categoryMap.get(currentId);
    if (!category) break;
    if (category.parentId !== null) {
      segments.unshift(category.path);
    }
    currentId = category.parentId;
  }

  return segments.join('/');
}

export const getCachedCategoriesWithFullPath = cache(async (): Promise<CategoryWithFullPath[]> => {
  const categories = await getCachedCategories();
  const categoryMap = new Map(categories.map((cat) => [cat.id, cat]));

  return categories.map((cat) => ({
    ...cat,
    fullPath: buildFullPath(cat.id, categoryMap),
  }));
});

export const getCategoryByIdMap = cache(async (): Promise<Map<string, CategoryWithFullPath>> => {
  const categories = await getCachedCategoriesWithFullPath();
  return new Map(categories.map((cat) => [cat.id, cat]));
});

export const getCategoryByFullPathMap = cache(async (): Promise<Map<string, CategoryWithFullPath>> => {
  const categories = await getCachedCategoriesWithFullPath();
  return new Map(categories.map((cat) => [cat.fullPath, cat]));
});

export async function getCategoryById(categoryId: string): Promise<CategoryWithFullPath | null> {
  const map = await getCategoryByIdMap();
  return map.get(categoryId) || null;
}

export async function getCategoryByFullPath(fullPath: string): Promise<CategoryWithFullPath | null> {
  const map = await getCategoryByFullPathMap();
  return map.get(fullPath) || null;
}

export const getCachedPosts = cache(async (): Promise<Post[]> => {
  const postPages = await fetchAllPosts(ISR_CONFIG.POST_DATABASE_ID, { publishedOnly: true });
  return postPages.map(parsePostPage);
});

export const getCachedPost = cache(async (pageId: string): Promise<PostPage> => {
  const page = await notionClient.pages.retrieve({ page_id: pageId });
  return page as PostPage;
});

export const getCachedPageBlocks = cache(async (pageId: string): Promise<Block[]> => {
  const topLevelBlocks = await fetchBlockChildren(pageId);
  const enrichedBlocks = await enrichBlocksWithChildren(topLevelBlocks, 10);

  const { processNotionBlocks } = await import('@/lib/cdn');
  const stats = await processNotionBlocks(enrichedBlocks);
  if (stats.totalImages > 0) {
    console.debug(`[BlockAPI] Images: ${stats.uploaded} uploaded, ${stats.cached} cached, ${stats.failed} failed`);
  }

  return enrichedBlocks;
});

export function formatDateKorean(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export async function toPostCardData(post: Post): Promise<PostCardData> {
  const category = await getCategoryById(post.categoryId);

  return {
    id: post.id,
    title: post.title,
    description: post.description || '내용이 없습니다.',
    date: formatDateKorean(post.publishedAt),
    categoryPath: category?.fullPath || '',
    categoryLabel: category?.label || '',
  };
}

export async function getPostCardsData(posts?: Post[]): Promise<PostCardData[]> {
  const allPosts = posts || (await getCachedPosts());
  return Promise.all(allPosts.map(toPostCardData));
}

export const getCachedCategoryTree = cache(async (): Promise<CategoryTreeNode[]> => {
  const categories = await getCachedCategories();
  return buildCategoryTree(categories);
});

export function findCategoryByPath(tree: CategoryTreeNode[], path: string): CategoryTreeNode | null {
  for (const node of tree) {
    if (node.path === path) {
      return node;
    }
    if (node.children.length > 0) {
      const found = findCategoryByPath(node.children, path);
      if (found) return found;
    }
  }
  return null;
}

export function getAllDescendantIds(node: CategoryTreeNode): string[] {
  const ids = [node.id];
  node.children.forEach((child) => {
    ids.push(...getAllDescendantIds(child));
  });
  return ids;
}

export async function getBreadcrumbItems(fullPath: string): Promise<Array<{ label: string; path: string }>> {
  if (!fullPath) return [];

  const segments = fullPath.split('/');
  const items: Array<{ label: string; path: string }> = [{ label: 'all', path: '' }];

  for (let i = 0; i < segments.length; i++) {
    const partialPath = segments.slice(0, i + 1).join('/');
    const category = await getCategoryByFullPath(partialPath);
    if (category) {
      items.push({ label: category.label, path: category.path });
    }
  }

  return items;
}
