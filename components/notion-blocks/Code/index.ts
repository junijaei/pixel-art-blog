import type { CodeBlock } from '@/types/notion';
import type { ReactNode } from 'react';

export { Code } from './Code';
export type { CodeBlock };

export interface CodeProps {
  block: CodeBlock;
  children?: ReactNode;
}
