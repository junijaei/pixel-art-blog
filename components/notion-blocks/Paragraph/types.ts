import type { RichTextItem } from '@/types/notion';

/**
 * Notion API의 Paragraph 블록 타입
 */
export interface ParagraphBlock {
  type: 'paragraph';
  paragraph: {
    rich_text: RichTextItem[];
    color: string;
  };
}

/**
 * Paragraph 컴포넌트 Props
 */
export interface ParagraphProps {
  block: ParagraphBlock;
}
