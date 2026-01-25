import type { QuoteProps } from '@/components/notion-blocks/Quote/index';
import { getNotionColorClass, renderRichText } from '@/lib/notion/util';

/**
 * Notion Quote 블록을 렌더링하는 컴포넌트
 */
export function Quote({ block, children }: QuoteProps) {
  const { rich_text, color } = block.quote;
  const colorClass = getNotionColorClass(color);

  return (
    <blockquote className={`border-muted-foreground/30 my-4 border-l-4 py-2 pl-4 italic ${colorClass}`.trim()}>
      <div>{renderRichText(rich_text)}</div>
      {children && <div className="mt-2 space-y-1 not-italic">{children}</div>}
    </blockquote>
  );
}
