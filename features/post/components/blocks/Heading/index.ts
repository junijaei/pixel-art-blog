import type { HeadingBlock } from '@/features/post/model';
import type { ReactNode } from 'react';

export { Heading } from './Heading';
export type { HeadingBlock };

export interface HeadingProps {
  block: HeadingBlock;
  children?: ReactNode;
}
