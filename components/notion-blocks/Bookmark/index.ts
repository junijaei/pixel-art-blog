import type { BookmarkBlock } from '@/types/notion';

export { Bookmark } from './Bookmark';
export type { BookmarkBlock };

export interface BookmarkProps {
  block: BookmarkBlock;
}
