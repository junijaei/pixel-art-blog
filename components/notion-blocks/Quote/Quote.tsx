import type { QuoteProps } from '@/components/notion-blocks/Quote/index';
import { getBlockBackgroundClass } from '@/lib/notion/shared';
import { cn } from '@/utils/utils';
import { RichText } from '../RichText';

/**
 * Notion Quote 블록을 렌더링하는 컴포넌트
 */
export function Quote({ block, children }: QuoteProps) {
  const { rich_text, color } = block.quote;
  const colorClass = getBlockBackgroundClass(color);

  return (
    <blockquote className={cn('bg-muted/50 relative my-4 rounded border-l-4 py-4 pl-6', colorClass)}>
      <div>
        <RichText richTextArray={rich_text} />
      </div>
      {children && <div className="mt-2 space-y-1">{children}</div>}
    </blockquote>
  );
}
