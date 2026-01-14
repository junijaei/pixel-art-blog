import type { RichTextItem } from '@/types/notion';

/**
 * Notion API의 NumberedListItem 블록 타입
 */
export interface NumberedListItemBlock {
  type: 'numbered_list_item';
  numbered_list_item: {
    rich_text: RichTextItem[];
    color: string;
    children: unknown[];
  };
  has_children: boolean;
}

/**
 * NumberedListItem 컴포넌트 Props
 */
export interface NumberedListItemProps {
  block: NumberedListItemBlock;
  children?: React.ReactNode;
  index?: number; // 리스트 아이템의 순서 (0부터 시작)
}
