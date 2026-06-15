import type { BlockCommentRecord, NotionComment } from '@/features/post/model';
import { notionClient } from '@/features/post/api/client';
import { withRetry } from '@/features/post/api/retry';

/** 단일 블록의 댓글을 가져옵니다. */
async function fetchBlockComments(blockId: string): Promise<NotionComment[]> {
  try {
    const response = await withRetry(() => notionClient.comments.list({ block_id: blockId }));
    return response.results as unknown as NotionComment[];
  } catch {
    return [];
  }
}

/**
 * 블록 ID 목록에 대해 댓글을 병렬로 가져와 Record로 반환합니다.
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
