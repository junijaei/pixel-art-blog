import type { HeadingBlock } from '@/types/notion';

export { Heading } from './Heading';
export type { HeadingBlock };

export interface HeadingProps {
  block: HeadingBlock;
}
