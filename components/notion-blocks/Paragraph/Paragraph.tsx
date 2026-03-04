import type { ParagraphProps } from '@/components/notion-blocks/Paragraph/index';
import { RichText } from '@/components/notion-blocks/RichText/RichText';
import { getNotionColorClass } from '@/lib/notion/shared';
import { cn } from '@/utils/utils';

/**
 * Notion Paragraph 블록을 렌더링하는 컴포넌트
 *
 * @param block - Notion API에서 반환된 Paragraph 블록 데이터
 */
export function Paragraph({ block }: ParagraphProps) {
  const { rich_text, color } = block.paragraph;
  const colorClass = getNotionColorClass(color);

  return (
    <p className={cn('rounded leading-relaxed not-last:mb-4', colorClass)}>
      <RichText richTextArray={rich_text} />
    </p>
  );
}
