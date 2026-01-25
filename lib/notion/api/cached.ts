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

let categoriesCache: Category[] | null = null;
let categoryByIdMap: Map<string, CategoryWithFullPath> | null = null;
let categoryByFullPathMap: Map<string, CategoryWithFullPath> | null = null;
let categoryTreeCache: CategoryTreeNode[] | null = null;
let postsCache: Post[] | null = null;

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

async function ensureCategoriesLoaded(): Promise<Category[]> {
  if (categoriesCache) return categoriesCache;

  const categoryPages = await fetchAllCategories(ISR_CONFIG.CATEGORY_DATABASE_ID, { activeOnly: true });
  categoriesCache = categoryPages.map(parseCategoryPage);
  return categoriesCache;
}

async function ensureCategoryMapsLoaded(): Promise<void> {
  if (categoryByIdMap && categoryByFullPathMap) return;

  const categories = await ensureCategoriesLoaded();
  const baseMap = new Map(categories.map((cat) => [cat.id, cat]));

  const categoriesWithFullPath: CategoryWithFullPath[] = categories.map((cat) => ({
    ...cat,
    fullPath: buildFullPath(cat.id, baseMap),
  }));

  categoryByIdMap = new Map(categoriesWithFullPath.map((cat) => [cat.id, cat]));
  categoryByFullPathMap = new Map(categoriesWithFullPath.map((cat) => [cat.fullPath, cat]));
}

export async function getCachedCategories(): Promise<Category[]> {
  return ensureCategoriesLoaded();
}

export async function getCategoryByIdMap(): Promise<Map<string, CategoryWithFullPath>> {
  await ensureCategoryMapsLoaded();
  return categoryByIdMap!;
}

export async function getCategoryById(categoryId: string): Promise<CategoryWithFullPath | null> {
  await ensureCategoryMapsLoaded();
  return categoryByIdMap!.get(categoryId) || null;
}

export async function getCategoryByFullPath(fullPath: string): Promise<CategoryWithFullPath | null> {
  await ensureCategoryMapsLoaded();
  return categoryByFullPathMap!.get(fullPath) || null;
}

export async function getCachedCategoryTree(): Promise<CategoryTreeNode[]> {
  if (categoryTreeCache) return categoryTreeCache;

  const categories = await ensureCategoriesLoaded();
  categoryTreeCache = buildCategoryTree(categories);
  return categoryTreeCache;
}

export async function getCachedPosts(): Promise<Post[]> {
  if (postsCache) return postsCache;

  const postPages = await fetchAllPosts(ISR_CONFIG.POST_DATABASE_ID, { publishedOnly: true });
  postsCache = postPages.map(parsePostPage);
  return postsCache;
}

export async function getCachedPost(pageId: string): Promise<PostPage> {
  const page = await notionClient.pages.retrieve({ page_id: pageId });
  return page as PostPage;
}

export async function getCachedPageBlocks(pageId: string): Promise<Block[]> {
  const topLevelBlocks = await fetchBlockChildren(pageId);
  const enrichedBlocks = await enrichBlocksWithChildren(topLevelBlocks, 10);

  const { processNotionBlocks } = await import('@/lib/cdn');
  const stats = await processNotionBlocks(enrichedBlocks);
  if (stats.totalImages > 0) {
    console.debug(`[BlockAPI] Images: ${stats.uploaded} uploaded, ${stats.cached} cached, ${stats.failed} failed`);
  }

  return enrichedBlocks;
}

export function formatDateKorean(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export async function getPostCardsData(posts?: Post[]): Promise<PostCardData[]> {
  const [allPosts, catMap] = await Promise.all([
    posts ? Promise.resolve(posts) : getCachedPosts(),
    getCategoryByIdMap(),
  ]);

  return allPosts.map((post) => {
    const category = catMap.get(post.categoryId);
    return {
      id: post.id,
      title: post.title,
      description: post.description || '내용이 없습니다.',
      date: formatDateKorean(post.publishedAt),
      categoryPath: category?.fullPath || '',
      categoryLabel: category?.label || '',
    };
  });
}

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

export function getAllDescendantIds(node: CategoryTreeNode): string[] {
  const ids = [node.id];
  node.children.forEach((child) => {
    ids.push(...getAllDescendantIds(child));
  });
  return ids;
}

export async function getBreadcrumbItems(fullPath: string): Promise<Array<{ label: string; path: string }>> {
  if (!fullPath) return [];

  await ensureCategoryMapsLoaded();

  const segments = fullPath.split('/');
  const items: Array<{ label: string; path: string }> = [{ label: 'all', path: '' }];

  for (let i = 0; i < segments.length; i++) {
    const partialPath = segments.slice(0, i + 1).join('/');
    const category = categoryByFullPathMap!.get(partialPath);
    if (category) {
      items.push({ label: category.label, path: category.path });
    }
  }

  return items;
}
