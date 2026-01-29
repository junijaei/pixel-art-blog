/**
 * Post Data - Entry point for pages
 *
 * Combines core (API) + domain (transforms)
 */

import { fetchBlocks, fetchBlocksChildren } from '@/lib/notion/core/block.api';
import { ISR_CONFIG } from '@/lib/notion/core/config';
import { fetchPost, fetchPosts } from '@/lib/notion/core/post.api';
import { processBlockTree } from '@/lib/notion/domain/block';
import { buildBreadcrumbItems } from '@/lib/notion/domain/category';
import type { BreadcrumbItem, TocItem } from '@/lib/notion/shared/types';
import type {
  Block,
  Category,
  CategoryWithFullPath,
  ImageBlock,
  Post,
  PostCardData,
  PostFilterOptions,
  PostSortOptions,
} from '@/types/notion';
import { calculateReadingTime, formatDateKorean } from '@/utils/utils';
import { getCategoryMaps } from './category.data';
import { memoizeWithArgs } from './utils';

/**
 * Post detail with content
 */
export interface PostWithContent {
  post: Post;
  blocks: Block[];
  metadata: {
    tocItems: TocItem[];
    readingTime: string;
    breadcrumbs: BreadcrumbItem[];
    thumbnail: ImageBlock | null;
  };
  category: CategoryWithFullPath | null;
}

/**
 * Get all posts (memoized)
 */
export const getPosts = memoizeWithArgs(
  async (options?: PostFilterOptions, sortOptions?: PostSortOptions): Promise<Post[]> => {
    return await fetchPosts(ISR_CONFIG.POST_DATABASE_ID, options, sortOptions);
  }
);

/**
 * Get single post by page ID (memoized)
 */
export const getPost = memoizeWithArgs(async (pageId: string): Promise<Post> => {
  return await fetchPost(pageId);
});

/**
 * Get post by slug (memoized)
 */
export const getPostBySlug = memoizeWithArgs(async (slug: string): Promise<Post> => {
  const allPosts = await getPosts();
  return allPosts.find((post) => post.slug === slug)!;
});

/**
 * Get post cards data for UI
 */
export async function getPostCardsData(posts?: Post[]): Promise<PostCardData[]> {
  const [allPosts, categoryMaps] = await Promise.all([posts ? Promise.resolve(posts) : getPosts(), getCategoryMaps()]);

  return allPosts.map((post) => {
    const category = categoryMaps.byId.get(post.categoryId);
    return {
      id: post.id,
      title: post.title,
      description: post.description || '내용이 없습니다.',
      date: formatDateKorean(post.publishedAt),
      slug: post.slug,
      categoryPath: category?.fullPath || '',
      categoryLabel: category?.label || '',
    };
  });
}

/**
 * Get post with full content (for detail page)
 */
export async function getPostWithContent(
  postId: string,
  categoryData: {
    categories: Category[];
    categoryMaps: {
      byId: Map<string, CategoryWithFullPath>;
      byFullPath: Map<string, CategoryWithFullPath>;
    };
  }
): Promise<PostWithContent> {
  // 1. Get post metadata and blocks in parallel
  const post = await getPostBySlug(postId);
  const rawBlocks = await fetchBlocks(post.id).then((blocks) => fetchBlocksChildren(blocks, 10));

  // 2. Process blocks (single pass)
  const { blocks, metadata: blockMetadata } = processBlockTree(rawBlocks);

  // 3. CDN image processing (side effect)
  if (blockMetadata.imageBlocks.length > 0) {
    const { processImageBlocks } = await import('@/lib/cdn');
    const stats = await processImageBlocks(blockMetadata.imageBlocks);
    if (stats.totalImages > 0) {
      console.debug(`[PostData] Images: ${stats.uploaded} uploaded, ${stats.cached} cached, ${stats.failed} failed`);
    }
  }

  // 4. Get category info
  const category = categoryData.categoryMaps.byId.get(post.categoryId) ?? null;

  // 5. Build breadcrumbs
  const fullPath = category?.fullPath ?? '';
  const breadcrumbs = buildBreadcrumbItems(fullPath, categoryData.categoryMaps.byFullPath);

  // 6. Calculate reading time
  const readingTime = calculateReadingTime(blockMetadata.plainText);

  return {
    post,
    blocks,
    metadata: {
      tocItems: blockMetadata.tocItems,
      readingTime,
      breadcrumbs,
      thumbnail: blockMetadata.imageBlocks?.[0] || null,
    },
    category,
  };
}

/**
 * Get posts with reading time (for list with reading time)
 */
export async function getPostsWithReadingTime(posts: Post[]): Promise<Array<Post & { readingTime: string }>> {
  const results = await Promise.all(
    posts.map(async (post) => {
      try {
        const rawBlocks = await fetchBlocks(post.id);
        const enrichedBlocks = await fetchBlocksChildren(rawBlocks, 10);
        const { metadata } = processBlockTree(enrichedBlocks);
        const readingTime = calculateReadingTime(metadata.plainText);
        return { ...post, readingTime };
      } catch (error) {
        console.error(`[PostData] Failed to get reading time for ${post.id}:`, error);
        return { ...post, readingTime: '1 min' };
      }
    })
  );

  return results;
}
