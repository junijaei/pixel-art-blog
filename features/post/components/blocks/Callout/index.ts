import type { CalloutBlock } from '@/features/post/model';
import { ReactNode } from 'react';

export { Callout } from './Callout';
export type { CalloutBlock };

export interface CalloutProps {
  block: CalloutBlock;
  children?: ReactNode;
}
