import { renderRichText } from '@/lib/notion/util/rich-text-renderer';
import type { ImageProps } from './index';

/**
 * Notion Image 블록을 렌더링하는 컴포넌트
 *
 * @param block - Notion API에서 반환된 Image 블록 데이터
 */
export function Image({ block }: ImageProps) {
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

  return (
    <figure className="my-6">
      <img
        src={imageUrl}
        alt={altText}
        loading="lazy"
        className="w-full rounded-lg border border-border"
      />
      {hasCaption && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {renderRichText(image.caption!)}
        </figcaption>
      )}
    </figure>
  );
}
