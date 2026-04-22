import type { HeadingProps } from '@/components/notion-blocks/Heading/index';
import { getNotionColorClass } from '@/lib/notion/shared';
import type { RichText } from '@/types/notion';
import { cn } from '@/utils/utils';
import { ChildBlockContainer } from '../ChildBlockContainer';
import { RichText as RichTextRenderer } from '../RichText';

/**
 * Renders Notion heading_1, heading_2, and heading_3 blocks.
 */
export function Heading({ block, children }: HeadingProps) {
  const type = block.type;
  const content = block[type] as { rich_text: RichText[]; color: string } | undefined;
  if (!content) return null;

  const { rich_text, color } = content;
  const colorClass = getNotionColorClass(color);
  const headingClasses = {
    heading_1: 'text-4xl',
    heading_2: 'text-3xl',
    heading_3: 'text-2xl',
  };
  const renderedText = <RichTextRenderer richTextArray={rich_text} />;
  const headingId = `heading-${block.id}`;
  const childContent = children ? <ChildBlockContainer>{children}</ChildBlockContainer> : null;

  switch (type) {
    case 'heading_1':
      return (
        <>
          <h1
            id={headingId}
            className={cn('mt-8 mb-4 scroll-mt-24 rounded font-bold', headingClasses[type], colorClass)}
          >
            {renderedText}
          </h1>
          {childContent}
        </>
      );
    case 'heading_2':
      return (
        <>
          <h2
            id={headingId}
            className={cn('mt-8 mb-4 scroll-mt-24 rounded font-bold', headingClasses[type], colorClass)}
          >
            {renderedText}
          </h2>
          {childContent}
        </>
      );
    case 'heading_3':
      return (
        <>
          <h3
            id={headingId}
            className={cn('mt-8 mb-4 scroll-mt-24 rounded font-bold', headingClasses[type], colorClass)}
          >
            {renderedText}
          </h3>
          {childContent}
        </>
      );
    default:
      return null;
  }
}
