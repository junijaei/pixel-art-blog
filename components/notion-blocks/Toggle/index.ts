import { ToggleBlock } from '@/types/notion';
import { ReactNode } from 'react';

export type { ToggleBlock } from '@/types/notion';
export { Toggle } from './Toggle';

export interface ToggleProps {
  block: ToggleBlock;
  children?: ReactNode;
}
