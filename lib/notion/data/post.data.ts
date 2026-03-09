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
import { extractThumbnailUrl } from '@/lib/notion/shared/utils';
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
import { calculateReadingTime, formatRelativeTime } from '@/utils/utils';
import { cache } from 'react';
import { getBlocks, getBlocksWithChildren } from './block.data';
import { getCategoryMaps } from './category.data';

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
    /** Thumbnail URL (first image block's URL after CDN processing) */
    thumbnailUrl: string | null;
  };
  category: CategoryWithFullPath | null;
}

/**
 * Get all posts (memoized)
 */
export const getPosts = cache(async (options?: PostFilterOptions, sortOptions?: PostSortOptions): Promise<Post[]> => {
  return await fetchPosts(ISR_CONFIG.POST_DATABASE_ID, options, sortOptions);
});

/**
 * Get single post by page ID (memoized)
 */
export const getPost = cache(async (pageId: string): Promise<Post> => {
  return await fetchPost(pageId);
});

/**
 * Get post by slug (memoized)
 */
export const getPostBySlug = cache(async (slug: string): Promise<Post | undefined> => {
  const allPosts = await getPosts();
  return allPosts.find((post) => post.slug === slug);
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
      date: formatRelativeTime(post.publishedAt),
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
): Promise<PostWithContent | null> {
  // 1. Get post metadata and blocks
  const post = await getPostBySlug(postId);
  if (!post) return null;
  const rawBlocks = await getBlocksWithChildren(post.id, 10);

  // 2. Process blocks (single pass)
  const { blocks, metadata: blockMetadata } = processBlockTree(rawBlocks);

  // 3. CDN image processing (side effect)
  if (blockMetadata.imageBlocks.length > 0) {
    const { processImageBlocks } = await import('@/lib/cdn');
    const stats = await processImageBlocks(blockMetadata.imageBlocks, post.slug);
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

  // Extract thumbnail URL from first image block (after CDN processing)
  const thumbnailUrl = extractThumbnailUrl(blockMetadata.imageBlocks?.[0]);

  return {
    post,
    blocks,
    metadata: {
      tocItems: blockMetadata.tocItems,
      readingTime,
      breadcrumbs,
      thumbnailUrl,
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

/**
 * Find first image block from blocks (shallow search for performance)
 */
function findFirstImageBlock(blocks: Block[]): ImageBlock | null {
  for (const block of blocks) {
    if (block.type === 'image') {
      return block as ImageBlock;
    }
    // Check children if present (depth-first)
    if ('children' in block && Array.isArray(block.children)) {
      const found = findFirstImageBlock(block.children);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Get thumbnail URL for a post (lightweight, for metadata)
 * Returns CDN-processed URL if available
 *
 * @param slug - Post slug
 * @returns Thumbnail URL or null if no image found
 */
export const getPostThumbnailUrl = cache(async (slug: string): Promise<string | null> => {
  try {
    const post = await getPostBySlug(slug);
    if (!post) return null;
    const blocks = await getBlocks(post.id);

    // Find first image block (shallow search)
    const imageBlock = findFirstImageBlock(blocks);
    if (!imageBlock) return null;

    // Process through CDN if in production
    const { processImageBlocks } = await import('@/lib/cdn');
    await processImageBlocks([imageBlock], slug);

    // Return CDN URL (block.image is mutated by processImageBlocks)
    return extractThumbnailUrl(imageBlock);
  } catch (error) {
    console.error(`[PostData] Failed to get thumbnail for ${slug}:`, error);
    return null;
  }
});

/**
 * Get thumbnails for multiple posts (batch, for list pages)
 *
 * @param posts - Posts to get thumbnails for
 * @returns Map of postId -> thumbnailUrl
 */
export async function getPostsThumbnails(posts: Post[]): Promise<Map<string, string | null>> {
  const results = await Promise.all(
    posts.map(async (post) => {
      const thumbnailUrl = await getPostThumbnailUrl(post.slug);
      return [post.slug, thumbnailUrl] as const;
    })
  );

  return new Map(results);
}
