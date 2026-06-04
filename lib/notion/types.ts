/**
 * Shared Types - Safe to import from server or client
 */

import type { Block, ImageBlock } from '@/types/notion';

/**
 * TOC (Table of Contents) item
 */
export interface TocItem {
  /** Unique identifier (used for anchor link) */
  id: string;
  /** Heading text */
  text: string;
  /** Heading level (1, 2, or 3) */
  level: 1 | 2 | 3;
}

/**
 * Breadcrumb item
 */
export interface BreadcrumbItem {
  /** Display label */
  label: string;
  /** URL path segment */
  path: string;
}

/**
 * Block processing metadata
 */
export interface BlockMetadata {
  tocItems: TocItem[];
  plainText: string;
  wordCount: number;
  charCount: number;
  imageBlocks: ImageBlock[];
}

/**
 * Block processing result
 */
export interface BlockProcessResult {
  blocks: Block[];
  metadata: BlockMetadata;
}
