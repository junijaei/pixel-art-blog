import type { RichTextItem } from '@/types/notion';

/**
 * Notion API의 BulletedListItem 블록 타입
 */
export interface BulletedListItemBlock {
  type: 'bulleted_list_item';
  bulleted_list_item: {
    rich_text: RichTextItem[];
    color: string;
    children: unknown[]; // 중첩된 블록들 (재귀 렌더링을 위해)
  };
  has_children: boolean;
}

/**
 * BulletedListItem 컴포넌트 Props
 */
export interface BulletedListItemProps {
  block: BulletedListItemBlock;
  children?: React.ReactNode; // 중첩된 아이템을 위한 children
}
