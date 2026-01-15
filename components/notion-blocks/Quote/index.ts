import type { QuoteBlock } from '@/types/notion';

export { Quote } from './Quote';
export type { QuoteBlock };

export interface QuoteProps {
  block: QuoteBlock;
}
