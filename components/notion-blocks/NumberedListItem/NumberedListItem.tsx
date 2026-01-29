import type { NumberedListItemProps } from '@/components/notion-blocks/NumberedListItem/index';
import { getNotionColorClass } from '@/lib/notion/shared';
import { cn } from '@/utils/utils';
import { RichText } from '../RichText';

/**
 * Notion NumberedListItem 블록을 렌더링하는 컴포넌트
 * 픽셀 폰트를 사용한 번호 표시와 함께 렌더링
 */
export function NumberedListItem({ block, children, index = 0 }: NumberedListItemProps) {
  const { rich_text, color } = block.numbered_list_item;
  const colorClass = getNotionColorClass(color);

  return (
    <li className={cn('mb-2 flex items-start gap-2 rounded', colorClass)}>
      <span className="text-muted-foreground font-pixel mt-1.5 w-4 text-center text-[10px]">{index + 1}</span>
      <span className="flex-1 leading-relaxed">
        <RichText richTextArray={rich_text} />
        {children && <ol className="mt-2 space-y-2">{children}</ol>}
      </span>
    </li>
  );
}
