import type { BulletedListItemProps } from '@/features/post/components/blocks/BulletedListItem/index';
import { PixelDot } from '@/shared/ui/pixel';
import { getNotionColorClass } from '@/features/post/colors';
import { cn } from '@/shared/lib/utils';
import { RichText } from '../RichText';

/**
 * Notion BulletedListItem 블록을 렌더링하는 컴포넌트
 * 픽셀 도트를 사용한 불릿 표시와 함께 렌더링
 *
 * @param block - Notion API에서 반환된 BulletedListItem 블록 데이터
 * @param children - 중첩된 리스트 아이템 (재귀 렌더링)
 */
export function BulletedListItem({ block, children, as: Tag = 'li' }: BulletedListItemProps) {
  const { rich_text, color } = block.bulleted_list_item;
  const colorClass = getNotionColorClass(color) || 'text-foreground/90';

  return (
    <Tag className={cn('mb-2 flex items-start gap-2 rounded', colorClass)}>
      <PixelDot className="text-muted-foreground/60 mt-2.5 h-1.5 w-1.5 shrink-0" />
      {/* 중첩 리스트가 ul로 들어오므로 span이면 안 된다. span은 블록 요소를 담을 수 없다. */}
      <div className="flex-1 leading-relaxed">
        <RichText richTextArray={rich_text} />
        {/* 중첩 리스트의 ul/ol은 BlockRenderer가 만든다 */}
        {children}
      </div>
    </Tag>
  );
}
