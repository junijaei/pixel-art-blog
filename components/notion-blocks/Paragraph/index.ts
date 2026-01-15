import type { ParagraphBlock } from '@/types/notion';

export { Paragraph } from './Paragraph';
export type { ParagraphBlock };

export interface ParagraphProps {
  block: ParagraphBlock;
}
