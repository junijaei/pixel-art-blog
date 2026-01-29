/**
 * Image Utilities
 * Safe for server/client use
 */

import type { NotionFile } from '@/types/notion';

export function extractImageUrl(file: NotionFile): string | null {
  if (file.type === 'file' && file.file?.url) {
    return file.file.url;
  }
  if (file.type === 'external' && file.external?.url) {
    return file.external.url;
  }
  return null;
}
