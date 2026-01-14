import type { RichTextItem } from '@/types/notion';

/**
 * Notion API의 Heading 블록 공통 속성
 */
interface HeadingContent {
  rich_text: RichTextItem[];
  color: string;
}

/**
 * Heading 1 블록 타입
 */
export interface Heading1Block {
  type: 'heading_1';
  heading_1: HeadingContent;
}

/**
 * Heading 2 블록 타입
 */
export interface Heading2Block {
  type: 'heading_2';
  heading_2: HeadingContent;
}

/**
 * Heading 3 블록 타입
 */
export interface Heading3Block {
  type: 'heading_3';
  heading_3: HeadingContent;
}

/**
 * 모든 Heading 블록 타입의 Union
 */
export type HeadingBlock = Heading1Block | Heading2Block | Heading3Block;

/**
 * Heading 컴포넌트 Props
 */
export interface HeadingProps {
  block: HeadingBlock;
}
