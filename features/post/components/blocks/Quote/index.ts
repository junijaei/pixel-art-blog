import type { QuoteBlock } from '@/features/post/model';
import type { ReactNode } from 'react';

export { Quote } from './Quote';
export type { QuoteBlock };

export interface QuoteProps {
  block: QuoteBlock;
  children?: ReactNode;
}
