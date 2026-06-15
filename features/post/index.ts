/**
 * Notion Integration - Public API
 *
 * For SERVER components/pages: import from '@/features/post'
 * For CLIENT components: import from explicit leaf modules like '@/features/post/colors'
 */

// ============================================
// Query Exports (Server Only)
// ============================================

export { getCategories, getPost, getPosts } from './query';
export type {
  CategoriesQueryResult,
  GetCategoriesOptions,
  GetPostContentOptions,
  GetPostOptions,
  GetPostsOptions,
  PostContent,
} from './query';

// ============================================
// Transform Helpers
// ============================================

export { toPostCardData } from './transform';

// ============================================
// Routing & Transform Helpers
// ============================================

export { createPostLink, parsePostLink } from './routing';
export { findCategoryByPath, getAllDescendantIds } from './transform';

// ============================================
// Config (Server Only)
// ============================================

export { ISR_CONFIG } from './constants';

// ============================================
// Code Highlighting (Server Only)
// ============================================

export { getShikiHighlighter, highlightCode } from './highlight';

// ============================================
// Types & Client-safe Utils (re-exported for convenience)
// ============================================

export type { BlockMetadata, BlockProcessResult, BreadcrumbItem, TocItem } from './types';
export { extractBaseColor, getBlockBackgroundClass, getNotionColorClass, isBackgroundColor } from './colors';
export { extractImageUrl } from './images';
