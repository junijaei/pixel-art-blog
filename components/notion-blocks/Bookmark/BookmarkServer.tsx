import { fetchLinkPreview } from '@/lib/link-preview';
import type { BookmarkBlock } from '@/types/notion';
import { Bookmark } from './Bookmark';

interface BookmarkServerProps {
  block: BookmarkBlock;
}

/**
 * Bookmark 블록의 async 서버 컴포넌트 래퍼
 * 빌드/ISR 시점에 OG 메타데이터를 서버에서 페치하여 Bookmark UI 컴포넌트에 전달합니다.
 * 클라이언트 사이드 fetch 없이 링크 미리보기를 제공합니다.
 */
export async function BookmarkServer({ block }: BookmarkServerProps) {
  const preview = await fetchLinkPreview(block.bookmark.url);
  return <Bookmark block={block} preview={preview} />;
}
