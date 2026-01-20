import type { QuoteBlock } from '@/types/notion';
import type { ReactNode } from 'react';

export { Quote } from './Quote';
export type { QuoteBlock };

export interface QuoteProps {
  block: QuoteBlock;
  children?: ReactNode;
}
