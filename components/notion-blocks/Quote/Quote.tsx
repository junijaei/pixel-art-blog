import { getColorClass, renderRichText } from '@/lib/notion/util';
import type { QuoteProps } from './index';

/**
 * Notion Quote 블록을 렌더링하는 컴포넌트
 */
export function Quote({ block }: QuoteProps) {
  const { rich_text, color } = block.quote;
  const colorClass = getColorClass(color);

  return (
    <blockquote className={`border-muted-foreground/30 my-4 border-l-4 py-2 pl-4 italic ${colorClass}`.trim()}>
      {renderRichText(rich_text)}
    </blockquote>
  );
}
