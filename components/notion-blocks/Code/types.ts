import type { RichTextItem } from '@/types/notion';

export interface CodeProps {
  richText: RichTextItem[];
  language?: string;
  caption?: RichTextItem[];
}
