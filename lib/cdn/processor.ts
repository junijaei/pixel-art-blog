import { uploadImage } from '@/lib/cdn/api';
import { getCachedImage, setCachedImage } from '@/lib/cdn/cache';
import { isDevelopment, mockProcessBlocks } from '@/lib/cdn/dev-mock';
import type { ImageProcessingStats, ImageUploadResult } from '@/types/cdn';
import type { ImageBlock } from '@/types/notion/content/block';
import { extractImageUrl } from '../notion';

interface ImageBlockInfo {
  block: ImageBlock;
  blockId: string;
  lastEditedTime: string;
  imageUrl: string;
}

function extractImageInfo(imageBlock: ImageBlock): ImageBlockInfo | undefined {
  const imageUrl = extractImageUrl(imageBlock.image);
  if (imageUrl) {
    return {
      block: imageBlock,
      blockId: imageBlock.id,
      lastEditedTime: imageBlock.last_edited_time,
      imageUrl,
    };
  }
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

export async function processImageBlocks(imageBlocks: ImageBlock[]): Promise<ImageProcessingStats> {
  if (isDevelopment()) {
    console.debug('[Processor] Development mode: Using mock processor');
    return mockProcessBlocks(imageBlocks);
  }

  console.debug('[Processor] Starting...');

  const imageInfos = imageBlocks.map(extractImageInfo).filter(Boolean);

  if (imageInfos.length === 0) {
    return { totalImages: 0, uploaded: 0, cached: 0, failed: 0 };
  }

  const results: ImageUploadResult[] = [];
  for (const imageInfo of imageInfos) {
    const result = await processImageBlock(imageInfo!);
    results.push(result);
  }

  const stats: ImageProcessingStats = {
    totalImages: imageInfos.length,
    uploaded: results.filter((r) => r.success && !r.fromCache).length,
    cached: results.filter((r) => r.success && r.fromCache).length,
    failed: results.filter((r) => !r.success).length,
  };

  console.debug('[Processor] Complete:', stats);

  return stats;
}
