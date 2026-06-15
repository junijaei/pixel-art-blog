/**
 * Image Utilities
 * Safe for server/client use
 */

import type { ImageBlock, NotionFile } from '@/features/post/model';

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

/**
 * Extract URL from Notion page cover object
 * Supports both external and file-hosted covers
 */
export function extractCoverUrl(cover: { type: string; [key: string]: unknown } | null): string | null {
  if (!cover) return null;
  if (cover.type === 'external') {
    const external = cover.external as { url?: string } | undefined;
    return external?.url ?? null;
  }
  if (cover.type === 'file') {
    const file = cover.file as { url?: string } | undefined;
    return file?.url ?? null;
  }
  return null;
}
