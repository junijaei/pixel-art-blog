import type { ParagraphProps } from '@/features/post/components/blocks/Paragraph/index';
import { RichText } from '@/features/post/components/blocks/RichText/RichText';
import { getNotionColorClass } from '@/features/post/colors';
import { cn } from '@/shared/lib/utils';
import { ChildBlockContainer } from '../ChildBlockContainer';

/**
 * Notion Paragraph 블록을 렌더링하는 컴포넌트
 *
 * @param block - Notion API에서 반환된 Paragraph 블록 데이터
 */
export function Paragraph({ block, children }: ParagraphProps) {
  const { rich_text, color } = block.paragraph;
  const colorClass = getNotionColorClass(color);

  return (
    <>
      <p className={cn('rounded leading-relaxed not-last:mb-4', colorClass)}>
        <RichText richTextArray={rich_text} />
      </p>
      {children && <ChildBlockContainer>{children}</ChildBlockContainer>}
    </>
  );
}
