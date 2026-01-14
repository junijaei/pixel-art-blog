import type { RichTextItem } from '@/types/notion';

export interface ToDoProps {
  richText: RichTextItem[];
  checked: boolean;
  has_children?: boolean;
  children?: React.ReactNode;
}
