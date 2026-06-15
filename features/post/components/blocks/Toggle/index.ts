import { ToggleBlock } from '@/features/post/model';
import { ReactNode } from 'react';

export type { ToggleBlock } from '@/features/post/model';
export { Toggle } from './Toggle';

export interface ToggleProps {
  block: ToggleBlock;
  children?: ReactNode;
}
