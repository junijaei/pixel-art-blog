import type { ImageProcessingStats, ImageUploadResult } from '@/types/cdn';
import type { ImageBlock } from '@/types/notion';

const PLACEHOLDER_IMAGE = '/placeholder-image.png';

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

export async function mockUploadImage(
  _imageUrl: string,
  _blockId: string,
  _lastEditedTime: string
): Promise<ImageUploadResult> {
  console.debug('[Dev Mock] Using placeholder image');
  return {
    success: true,
    cdnUrl: PLACEHOLDER_IMAGE,
    fromCache: false,
  };
}

export async function mockProcessBlocks(imageBlocks: ImageBlock[]): Promise<ImageProcessingStats> {
  let imageCount = 0;

  imageBlocks.forEach((imageBlock: ImageBlock) => {
    const originalImage = imageBlock.image;

    imageBlock.image = {
      type: 'external',
      external: { url: PLACEHOLDER_IMAGE },
      name: originalImage.name,
      caption: originalImage.caption,
    };

    imageCount++;
    console.debug(`[Dev Mock] Replaced image ${imageBlock.id} with placeholder`);
  });

  return {
    totalImages: imageCount,
    uploaded: 0,
    cached: imageCount,
    failed: 0,
  };
}

export function mockValidateConfig(): boolean {
  console.debug('[Dev Mock] Skipping CDN config validation in development');
  return true;
}
