import { uploadImage } from '@/lib/cdn/api';
import { getCachedImage, setCachedImage } from '@/lib/cdn/cache';
import { isDevelopment, mockProcessBlocks } from '@/lib/cdn/dev-mock';
import type { ImageProcessingStats, ImageUploadResult } from '@/types/cdn';
import type { NotionFile } from '@/types/notion/base';
import type { Block, ImageBlock } from '@/types/notion/content/block';

function isImageBlock(block: Block): block is ImageBlock {
  return block.type === 'image';
}

function extractImageUrl(file: NotionFile): string | null {
  if (file.type === 'file' && file.file?.url) {
    return file.file.url;
  }
  if (file.type === 'external' && file.external?.url) {
    return file.external.url;
  }
  return null;
}

interface ImageBlockInfo {
  block: ImageBlock;
  blockId: string;
  lastEditedTime: string;
  imageUrl: string;
}

function extractImageBlocks(blocks: Block[], maxDepth: number = 10, currentDepth: number = 0): ImageBlockInfo[] {
  if (currentDepth >= maxDepth) {
    console.warn('[Processor] Max recursion depth reached');
    return [];
  }

  const imageBlocks: ImageBlockInfo[] = [];

  for (const block of blocks) {
    if (isImageBlock(block)) {
      const imageUrl = extractImageUrl(block.image);
      if (imageUrl) {
        imageBlocks.push({
          block,
          blockId: block.id,
          lastEditedTime: block.last_edited_time,
          imageUrl,
        });
      }
    }

    if (block.has_children && block.children && block.children.length > 0) {
      const childImages = extractImageBlocks(block.children, maxDepth, currentDepth + 1);
      imageBlocks.push(...childImages);
    }
  }

  return imageBlocks;
}

async function processImageBlock(imageInfo: ImageBlockInfo): Promise<ImageUploadResult> {
  const { block, blockId, lastEditedTime, imageUrl } = imageInfo;

  const cached = await getCachedImage(blockId, lastEditedTime);
  if (cached) {
    block.image = {
      type: 'external',
      external: { url: cached.cdnUrl },
      name: block.image.name,
    };

    console.debug(`[Processor] Cache hit: ${blockId}`);
    return {
      success: true,
      cdnUrl: cached.cdnUrl,
      fromCache: true,
    };
  }

  console.debug(`[Processor] Uploading: ${blockId}`);
  const result = await uploadImage(imageUrl, blockId, lastEditedTime);

  if (!result.success || !result.cdnUrl) {
    console.error(`[Processor] Failed: ${blockId}`, result.error);
    return result;
  }

  block.image = {
    type: 'external',
    external: { url: result.cdnUrl },
    name: block.image.name,
  };

  await setCachedImage(blockId, lastEditedTime, result.cdnUrl, block.image.name);

  console.debug(`[Processor] Done: ${blockId} -> ${result.cdnUrl}`);
  return result;
}

export async function processNotionBlocks(blocks: Block[]): Promise<ImageProcessingStats> {
  if (isDevelopment()) {
    console.debug('[Processor] Development mode: Using mock processor');
    return mockProcessBlocks(blocks);
  }

  console.debug('[Processor] Starting...');

  const imageBlocks = extractImageBlocks(blocks);
  console.debug(`[Processor] Found ${imageBlocks.length} images`);

  if (imageBlocks.length === 0) {
    return { totalImages: 0, uploaded: 0, cached: 0, failed: 0 };
  }

  const results: ImageUploadResult[] = [];
  for (const imageInfo of imageBlocks) {
    const result = await processImageBlock(imageInfo);
    results.push(result);
  }

  const stats: ImageProcessingStats = {
    totalImages: imageBlocks.length,
    uploaded: results.filter((r) => r.success && !r.fromCache).length,
    cached: results.filter((r) => r.success && r.fromCache).length,
    failed: results.filter((r) => !r.success).length,
  };

  console.debug('[Processor] Complete:', stats);

  return stats;
}

export async function processSingleImageBlock(block: Block): Promise<ImageUploadResult | null> {
  if (!isImageBlock(block)) {
    return null;
  }

  const imageUrl = extractImageUrl(block.image);
  if (!imageUrl) {
    return null;
  }

  const imageInfo: ImageBlockInfo = {
    block,
    blockId: block.id,
    lastEditedTime: block.last_edited_time,
    imageUrl,
  };

  return processImageBlock(imageInfo);
}
