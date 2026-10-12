import type { NumberedListBlock } from '@/features/post/model';
import { ReactNode } from 'react';

export type { NumberedListBlock as NumberedListBlock } from '@/features/post/model';
export { NumberedListItem } from './NumberedListItem';

export interface NumberedListItemProps {
  block: NumberedListBlock;
  children?: ReactNode;
  index?: number;
  /** BulletedListItem의 as와 같다. */
  as?: 'li' | 'div';
}
