import type { RichTextItem } from '@/types/notion';

export interface ToggleProps {
  richText: RichTextItem[];
  has_children?: boolean;
  children?: React.ReactNode;
}
