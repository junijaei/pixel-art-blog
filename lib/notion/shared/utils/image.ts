/**
 * Image Utilities
 * Safe for server/client use
 */

import type { ImageBlock, NotionFile } from '@/types/notion';

/**
 * Extract URL from NotionFile
 */
export function extractImageUrl(file: NotionFile): string | null {
  if (file.type === 'file' && file.file?.url) {
    return file.file.url;
  }
  if (file.type === 'external' && file.external?.url) {
    return file.external.url;
  }
  return null;
}

/**
 * Extract thumbnail URL from ImageBlock
 * Returns CDN URL if processed, otherwise original URL
 */
export function extractThumbnailUrl(imageBlock: ImageBlock | null | undefined): string | null {
  if (!imageBlock?.image) return null;
  return extractImageUrl(imageBlock.image);
}
