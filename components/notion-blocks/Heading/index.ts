import type { HeadingBlock } from '@/types/notion';
import type { ReactNode } from 'react';

export { Heading } from './Heading';
export type { HeadingBlock };

export interface HeadingProps {
  block: HeadingBlock;
  children?: ReactNode;
}
