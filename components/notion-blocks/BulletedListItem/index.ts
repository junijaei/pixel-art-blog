import type { BulletedListBlock } from '@/types/notion';
import { ReactNode } from 'react';

export type { BulletedListBlock as BulletedListItemBlock } from '@/types/notion';
export { BulletedListItem } from './BulletedListItem';

export interface BulletedListItemProps {
  block: BulletedListBlock;
  children?: ReactNode;
}
