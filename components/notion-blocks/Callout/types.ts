import type { RichTextItem } from '@/types/notion';

export interface CalloutProps {
  richText: RichTextItem[];
  icon?: {
    type: 'emoji' | 'external' | 'file';
    emoji?: string;
    external?: { url: string };
    file?: { url: string };
  };
  color?: string;
  has_children?: boolean;
  children?: React.ReactNode;
}
