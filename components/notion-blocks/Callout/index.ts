import type { CalloutBlock } from '@/types/notion';
import { ReactNode } from 'react';

export { Callout } from './Callout';
export type { CalloutBlock };

export interface CalloutProps {
  block: CalloutBlock;
  children?: ReactNode;
}
