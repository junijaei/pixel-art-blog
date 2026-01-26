import type { HeadingProps } from '@/components/notion-blocks/Heading/index';
import { getNotionColorClass, renderRichText } from '@/lib/notion/util';
import { cn } from '@/lib/utils';

/**
 * Notion Heading 블록을 렌더링하는 컴포넌트
 * heading_1, heading_2, heading_3를 지원
 * 각 heading에 block.id 기반의 id 속성을 추가하여 TOC 앵커 링크 지원
 *
 * @param block - Notion API에서 반환된 Heading 블록 데이터
 */
export function Heading({ block }: HeadingProps) {
  const type = block.type;

  // 블록 타입에 따라 콘텐츠 추출
  const content = block[type] as { rich_text: Parameters<typeof renderRichText>[0]; color: string } | undefined;
  if (!content) return null;

  const { rich_text, color } = content;
  const colorClass = getNotionColorClass(color);

  // 헤딩 레벨에 따른 스타일
  const headingClasses = {
    heading_1: 'text-4xl',
    heading_2: 'text-3xl',
    heading_3: 'text-2xl',
  };

  const renderedText = renderRichText(rich_text);

  // Use block id for anchor link (TOC integration)
  const headingId = `heading-${block.id}`;

  // 타입에 따라 적절한 헤딩 태그 렌더링
  switch (type) {
    case 'heading_1':
      return (
        <h1 id={headingId} className={cn('font-bold mb-4 mt-8 scroll-mt-24 rounded', headingClasses[type], colorClass)}>
          {renderedText}
        </h1>
      );
    case 'heading_2':
      return (
        <h2 id={headingId} className={cn('font-bold mb-4 mt-8 scroll-mt-24 rounded', headingClasses[type], colorClass)}>
          {renderedText}
        </h2>
      );
    case 'heading_3':
      return (
        <h3 id={headingId} className={cn('font-bold mb-4 mt-8 scroll-mt-24 rounded', headingClasses[type], colorClass)}>
          {renderedText}
        </h3>
      );
    default:
      return null;
  }
}
