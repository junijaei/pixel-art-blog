'use client';

import type { ImageProps } from '@/components/notion-blocks/Image/index';
import { RichText } from '@/components/notion-blocks/RichText/RichText';
import { ImageModal } from '@/components/ui';
import { cn } from '@/utils/utils';
import { useEffect, useRef, useState } from 'react';
import { ChildBlockContainer } from '../ChildBlockContainer';

/**
 * Notion Image 블록을 렌더링하는 컴포넌트
 * 클릭 시 모달로 확대 보기 가능
 *
 * @param block - Notion API에서 반환된 Image 블록 데이터
 */
const PLACEHOLDER_SRC = '/placeholder-image.png';

export function Image({ block, priority = false, children }: ImageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const { image } = block;

  // 강력 새로고침 시 캐시된 이미지는 onLoad가 발화하지 않으므로
  // 마운트 후 img.complete로 이미 로드된 상태인지 확인
  useEffect(() => {
    if (imgRef.current?.complete) {
      setIsLoaded(true);
    }
  }, []);

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
          aria-label={`${altText || '이미지'} 확대 보기`}
        >
          <div className="relative">
            {!isLoaded && <div className="bg-muted aspect-video w-full animate-pulse rounded-lg" />}
            <img
              ref={imgRef}
              src={isError ? PLACEHOLDER_SRC : imageUrl}
              alt={altText}
              loading={priority ? 'eager' : 'lazy'}
              fetchPriority={priority ? 'high' : 'auto'}
              onLoad={() => setIsLoaded(true)}
              onError={() => {
                setIsError(true);
                setIsLoaded(true);
              }}
              className={cn(
                'border-border w-full rounded-lg border transition-opacity hover:opacity-90',
                !isLoaded && 'absolute inset-0 h-full opacity-0'
              )}
            />
          </div>
        </button>
        {hasCaption && (
          <figcaption className="text-muted-foreground mt-2 text-center text-sm">
            <RichText richTextArray={image.caption!} />
          </figcaption>
        )}
      </figure>
      {children && <ChildBlockContainer>{children}</ChildBlockContainer>}

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
