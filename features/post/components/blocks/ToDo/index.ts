import type { ToDoBlock } from '@/features/post/model';
import { ReactNode } from 'react';

export { ToDo } from './ToDo';
export type { ToDoBlock };

export interface ToDoProps {
  block: ToDoBlock;
  children?: ReactNode;
}
