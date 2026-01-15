import type { ToDoBlock } from '@/types/notion';
import { ReactNode } from 'react';

export { ToDo } from './ToDo';
export type { ToDoBlock };

export interface ToDoProps {
  block: ToDoBlock;
  children?: ReactNode;
}
