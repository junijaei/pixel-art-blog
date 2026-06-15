import type { BulletedListBlock } from '@/features/post/model';
import { ReactNode } from 'react';

export type { BulletedListBlock as BulletedListItemBlock } from '@/features/post/model';
export { BulletedListItem } from './BulletedListItem';

export interface BulletedListItemProps {
  block: BulletedListBlock;
  children?: ReactNode;
}
