import type { BulletedListItemProps } from '@/components/notion-blocks/BulletedListItem/index';
import { PixelDot } from '@/components/ui/pixel-icons';
import { getNotionColorClass, renderRichText } from '@/lib/notion/util';

/**
 * Notion BulletedListItem 블록을 렌더링하는 컴포넌트
 * 픽셀 도트를 사용한 불릿 표시와 함께 렌더링
 *
 * @param block - Notion API에서 반환된 BulletedListItem 블록 데이터
 * @param children - 중첩된 리스트 아이템 (재귀 렌더링)
 */
export function BulletedListItem({ block, children }: BulletedListItemProps) {
  const { rich_text, color } = block.bulleted_list_item;
  const colorClass = getNotionColorClass(color) || 'text-foreground/90';

  return (
    <li className={`mb-2 flex items-start gap-2 ${colorClass}`.trim()}>
      <PixelDot className="text-muted-foreground/60 mt-2.5 h-1.5 w-1.5 shrink-0" />
      <span className="flex-1 leading-relaxed">
        {renderRichText(rich_text)}
        {/* 중첩된 리스트가 있을 경우 렌더링 */}
        {children && <ul className="mt-2 space-y-2">{children}</ul>}
      </span>
    </li>
  );
}
