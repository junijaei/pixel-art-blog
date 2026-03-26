import { uploadImage } from '@/lib/cdn/api';
import { batchSetCachedImages, getCachedImage } from '@/lib/cdn/cache';
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

interface ProcessBlockResult {
  uploadResult: ImageUploadResult;
  cacheEntry?: {
    blockId: string;
    lastEditedTime: string;
    cdnUrl: string;
    originalFilename?: string;
  };
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

async function processImageBlock(imageInfo: ImageBlockInfo, postSlugId: string): Promise<ProcessBlockResult> {
  const { block, blockId, lastEditedTime, imageUrl } = imageInfo;

  const cached = await getCachedImage(blockId, lastEditedTime);
  if (cached) {
    block.image = {
      type: 'external',
      external: { url: cached.cdnUrl },
      name: block.image.name,
      caption: block.image.caption,
    };

    console.debug(`[Processor] Cache hit: ${blockId}`);
    return { uploadResult: { success: true, cdnUrl: cached.cdnUrl, fromCache: true } };
  }

  console.debug(`[Processor] Uploading: ${blockId}`);
  const uploadResult = await uploadImage(imageUrl, blockId, lastEditedTime, postSlugId);

  if (!uploadResult.success || !uploadResult.cdnUrl) {
    console.error(
      `[Processor] Failed: ${blockId} — Notion URL will be used as fallback. ` +
        `WARNING: Notion URLs expire within ~1 hour. If the next build or revalidation ` +
        `does not occur within that window, the image will appear broken for visitors.`,
      uploadResult.error
    );
    return { uploadResult };
  }

  block.image = {
    type: 'external',
    external: { url: uploadResult.cdnUrl },
    name: block.image.name,
    caption: block.image.caption,
  };

  console.debug(`[Processor] Done: ${blockId} -> ${uploadResult.cdnUrl}`);
  return {
    uploadResult,
    cacheEntry: {
      blockId,
      lastEditedTime,
      cdnUrl: uploadResult.cdnUrl,
      originalFilename: block.image.name,
    },
  };
}

// NOTE: ISR 재검증(서버리스 함수) 환경에서는 메모리 캐시와 파일 캐시 모두 무효하다.
// cold start마다 초기화되며 파일 시스템이 읽기 전용이기 때문.
// 이미지가 많은 페이지에서 ISR 재검증 시, 모든 이미지에 대해 Worker HEAD 체크가 발생하여
// Vercel 서버리스 기본 10초 타임아웃을 초과할 수 있다.
// 이미지 수가 많다면 ISR 대신 On-demand Revalidation 사용을 권장한다.
export async function processImageBlocks(imageBlocks: ImageBlock[], postSlugId: string): Promise<ImageProcessingStats> {
  if (isDevelopment()) {
    console.debug('[Processor] Development mode: Using mock processor');
    return mockProcessBlocks(imageBlocks);
  }

  console.debug('[Processor] Starting...');

  const imageInfos = imageBlocks.map(extractImageInfo).filter(Boolean);

  if (imageInfos.length === 0) {
    return { totalImages: 0, uploaded: 0, cached: 0, failed: 0 };
  }

  const processResults = await Promise.all(imageInfos.map((imageInfo) => processImageBlock(imageInfo!, postSlugId)));

  // 캐시 쓰기를 단일 배치로 처리하여 race condition 방지
  // (Promise.all로 병렬 실행된 각 processImageBlock이 개별적으로 saveCache를 호출하면
  //  Next.js 빌드 워커 간 파일 덮어쓰기가 발생할 수 있다)
  const cacheEntries = processResults.map((r) => r.cacheEntry).filter((e) => e !== undefined);
  if (cacheEntries.length > 0) {
    await batchSetCachedImages(cacheEntries);
  }

  const results = processResults.map((r) => r.uploadResult);
  const stats: ImageProcessingStats = {
    totalImages: imageInfos.length,
    uploaded: results.filter((r) => r.success && !r.fromCache).length,
    cached: results.filter((r) => r.success && r.fromCache).length,
    failed: results.filter((r) => !r.success).length,
  };

  console.debug('[Processor] Complete:', stats);

  return stats;
}
