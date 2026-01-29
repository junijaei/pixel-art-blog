/**
 * Data Layer - Entry point for pages
 *
 * This is the ONLY layer that pages should import from
 */

// Block data
export { getBlocks, getBlocksWithChildren } from './block.data';

// Category data
export {
  getCategories,
  getCategoryById,
  getCategoryByFullPath,
  getCategoryDataBundle,
  getCategoryMaps,
  getCategoryTree,
} from './category.data';

// Post data
export {
  getPost,
  getPostBySlug,
  getPostCardsData,
  getPosts,
  getPostsWithReadingTime,
  getPostWithContent,
} from './post.data';
export type { PostWithContent } from './post.data';

// Re-export domain functions needed by pages
export { findCategoryByPath, getAllDescendantIds, parsePostLink } from '@/lib/notion/domain/category';

// Re-export shared types
export type { BreadcrumbItem, TocItem } from '@/lib/notion/shared/types';
