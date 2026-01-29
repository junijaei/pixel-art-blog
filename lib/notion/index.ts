/**
 * Notion Integration - Public API
 *
 * For SERVER components/pages: import from '@/lib/notion'
 * For CLIENT components: import from '@/lib/notion/shared'
 */

// ============================================
// Server-only marker (prevents client import of this file)
// ============================================
import './core/_server';

// ============================================
// Data Layer Exports (Server Only)
// ============================================

// Block
export { getBlocks, getBlocksWithChildren } from './data/block.data';

// Category
export {
  getCategories,
  getCategoryById,
  getCategoryByFullPath,
  getCategoryDataBundle,
  getCategoryMaps,
  getCategoryTree,
} from './data/category.data';

// Post
export {
  getPost,
  getPostBySlug,
  getPostCardsData,
  getPosts,
  getPostsWithReadingTime,
  getPostsThumbnails,
  getPostThumbnailUrl,
  getPostWithContent,
} from './data/post.data';
export type { PostWithContent } from './data/post.data';

// ============================================
// Domain Helpers
// ============================================

export { createPostLink, findCategoryByPath, getAllDescendantIds, parsePostLink } from './domain/category';

// ============================================
// Config (Server Only)
// ============================================

export { ISR_CONFIG } from './core/config';

// ============================================
// Code Highlighting (Server Only)
// ============================================

export { getShikiHighlighter, highlightCode } from './core/shiki';

// ============================================
// Shared Types & Utils (re-exported for convenience)
// ============================================

export type { BlockMetadata, BlockProcessResult, BreadcrumbItem, TocItem } from './shared/types';
export {
  extractBaseColor,
  extractImageUrl,
  getBlockBackgroundClass,
  getNotionColorClass,
  isBackgroundColor,
} from './shared/utils';
