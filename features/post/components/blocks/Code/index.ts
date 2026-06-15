import type { CodeBlock } from '@/features/post/model';
import type { ReactNode } from 'react';

export { Code } from './Code';
export type { CodeBlock };

export interface CodeProps {
  block: CodeBlock;
  children?: ReactNode;
}
