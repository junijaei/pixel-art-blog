import type { NumberedListBlock } from '@/types/notion';
import { ReactNode } from 'react';

export type { NumberedListBlock as NumberedListBlock } from '@/types/notion';
export { NumberedListItem } from './NumberedListItem';

export interface NumberedListItemProps {
  block: NumberedListBlock;
  children?: ReactNode;
  index?: number;
}
