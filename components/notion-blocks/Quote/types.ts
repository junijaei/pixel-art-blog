import type { RichTextItem } from '@/types/notion';

/**
 * Notion API의 Quote 블록 타입
 */
export interface QuoteBlock {
  type: 'quote';
  quote: {
    rich_text: RichTextItem[];
    color: string;
  };
}

/**
 * Quote 컴포넌트 Props
 */
export interface QuoteProps {
  block: QuoteBlock;
}
