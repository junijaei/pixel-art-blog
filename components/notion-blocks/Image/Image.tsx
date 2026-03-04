'use client';

import type { ImageProps } from '@/components/notion-blocks/Image/index';
import { RichText } from '@/components/notion-blocks/RichText/RichText';
import { ImageModal } from '@/components/ui';
import { useState } from 'react';

/**
 * Notion Image 블록을 렌더링하는 컴포넌트
 * 클릭 시 모달로 확대 보기 가능
 *
 * @param block - Notion API에서 반환된 Image 블록 데이터
 */
export function Image({ block, priority = false }: ImageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { image } = block;

  // Extract URL from either 'file' or 'external' type
  const imageUrl =
    image.type === 'file' && image.file?.url
      ? image.file.url
      : image.type === 'external' && image.external?.url
        ? image.external.url
        : null;

  if (!imageUrl) {
    console.warn(`[Image Block] No URL found for block ${block.id}`);
    return null;
  }

  const altText = image.name || '';
  const hasCaption = image.caption && image.caption.length > 0;
  const captionText = hasCaption ? image.caption!.map((c) => c.plain_text).join('') : undefined;

  return (
    <>
      <figure className="mx-12 my-6 max-w-lg">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="focus:ring-ring w-full cursor-zoom-in rounded-lg focus:ring-2 focus:ring-offset-2 focus:outline-none"
          aria-label={`View ${altText || 'image'} in full size`}
        >
          <img
            src={imageUrl}
            alt={altText}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            className="border-border w-full rounded-lg border transition-opacity hover:opacity-90"
          />
        </button>
        {hasCaption && (
          <figcaption className="text-muted-foreground mt-2 text-center text-sm">
            <RichText richTextArray={image.caption!} />
          </figcaption>
        )}
      </figure>

      <ImageModal
        src={imageUrl}
        alt={altText}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        caption={captionText}
      />
    </>
  );
}
