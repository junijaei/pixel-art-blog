import type { ImageUploadResult, ImageProcessingStats } from '@/types/cdn';
import type { Block, ImageBlock } from '@/types/notion';

const PLACEHOLDER_IMAGE = '/placeholder-image.png';

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

export async function mockUploadImage(_imageUrl: string, _blockId: string): Promise<ImageUploadResult> {
  console.log('[Dev Mock] Using placeholder image');
  return {
    success: true,
    cdnUrl: PLACEHOLDER_IMAGE,
    fromCache: false,
  };
}

export async function mockProcessBlocks(blocks: Block[]): Promise<ImageProcessingStats> {
  let imageCount = 0;

  function processBlock(block: Block) {
    if (block.type === 'image') {
      const imageBlock = block as ImageBlock;

      imageBlock.image = {
        type: 'external',
        external: { url: PLACEHOLDER_IMAGE },
        name: imageBlock.image.name,
        caption: imageBlock.image.caption,
      };

      imageCount++;
      console.log(`[Dev Mock] Replaced image ${imageBlock.id} with placeholder`);
    }

    if (block.has_children && block.children) {
      block.children.forEach(processBlock);
    }
  }

  blocks.forEach(processBlock);

  return {
    totalImages: imageCount,
    uploaded: 0,
    cached: imageCount,
    failed: 0,
  };
}

export function mockValidateConfig(): boolean {
  console.log('[Dev Mock] Skipping CDN config validation in development');
  return true;
}
