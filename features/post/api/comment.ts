import type { BlockCommentRecord, NotionComment } from '@/features/post/model';
import { notionClient } from '@/features/post/api/client';
import { notionRequest } from '@/features/post/api/request';

/**
 * Notion 댓글 조회 — 인덱스를 채우는 쪽에서만 씁니다.
 *
 * 블록당 1회라 글 하나에 약 95회가 나간다. 렌더 경로에서 부르면 429가 난다.
 * 호출자는 sync 스크립트와 웹훅뿐이고, 렌더는 comment-index의 getCommentMap을 쓴다.
 */

/** 단일 블록의 댓글을 가져옵니다. */
export async function fetchBlockComments(blockId: string): Promise<NotionComment[]> {
  try {
    const response = await notionRequest(() => notionClient.comments.list({ block_id: blockId }));
    return response.results as unknown as NotionComment[];
  } catch {
    return [];
  }
}

/**
 * 블록 ID 목록에 대해 댓글을 가져와 Record로 반환합니다.
 * 댓글이 없는 블록은 결과에 포함되지 않습니다.
 */
export async function fetchCommentsForBlocks(blockIds: string[]): Promise<BlockCommentRecord> {
  if (blockIds.length === 0) return {};

  const entries = await Promise.all(
    blockIds.map(async (id) => {
      const comments = await fetchBlockComments(id);
      return [id, comments] as [string, NotionComment[]];
    })
  );

  return Object.fromEntries(entries.filter(([, comments]) => comments.length > 0));
}
