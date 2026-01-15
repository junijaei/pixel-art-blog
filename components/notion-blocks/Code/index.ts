import type { CodeBlock } from '@/types/notion';

export { Code } from './Code';
export type { CodeBlock };

export interface CodeProps {
  block: CodeBlock;
}
