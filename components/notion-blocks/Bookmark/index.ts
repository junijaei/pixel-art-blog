import type { LinkPreviewData } from '@/app/api/link-preview/route';
import type { BookmarkBlock } from '@/types/notion';
import type { ReactNode } from 'react';

export { Bookmark } from './Bookmark';
export { BookmarkServer } from './BookmarkServer';
export type { BookmarkBlock };

export interface BookmarkProps {
  block: BookmarkBlock;
  preview?: LinkPreviewData | null;
  children?: ReactNode;
}
