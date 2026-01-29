/**
 * Core Layer - Internal only
 *
 * DO NOT import from pages - use data layer instead
 */

// API
export { fetchBlocks, fetchBlocksChildren } from './block.api';
export { fetchAllCategories, fetchCategory } from './category.api';
export { fetchPost, fetchPosts } from './post.api';

// Config
export {
  CATEGORY_PROPERTIES,
  CATEGORY_STATUS,
  ISR_CONFIG,
  NOTION_DATASOURCE_CATEGORY_ID,
  NOTION_DATASOURCE_POST_ID,
  NOTION_LIMITS,
  POST_PROPERTIES,
  POST_STATUS,
} from './config';

// Client
export { notionClient } from './client';

// Shiki
export { getShikiHighlighter, highlightCode } from './shiki';
