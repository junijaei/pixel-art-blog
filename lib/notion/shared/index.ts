/**
 * Shared Module - Safe for server/client use
 */

export * from './types';
export * from './utils';

// Re-export highlightCode for client components
export { highlightCode } from '@/lib/notion/core/shiki';

// Re-export pure domain functions for client components
export { createCategoryLink, createPostLink, parsePostLink } from '@/lib/notion/domain/category';
