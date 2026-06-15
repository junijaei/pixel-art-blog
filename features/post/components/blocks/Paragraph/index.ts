import type { ParagraphBlock } from '@/features/post/model';
import type { ReactNode } from 'react';

export { Paragraph } from './Paragraph';
export type { ParagraphBlock };

export interface ParagraphProps {
  block: ParagraphBlock;
  children?: ReactNode;
}
