/**
 * Block API
 * 블록 데이터 fetching 및 children enrichment 서버 전용 API 함수
 */

import { notionClient } from '@/lib/notion/api/client';
import type { Block } from '@/types/notion';
import { NOTION_LIMITS } from '../config';

export async function fetchBlockChildren(blockId: string): Promise<Block[]> {
  const blocks: Block[] = [];
  let cursor: string | undefined = undefined;
  let hasMore = true;

  while (hasMore) {
    const response = await notionClient.blocks.children.list({
      block_id: blockId,
      page_size: NOTION_LIMITS.MAX_PAGE_SIZE,
      start_cursor: cursor,
    });

    blocks.push(...(response.results as Block[]));
    hasMore = response.has_more;
    cursor = response.next_cursor ?? undefined;
  }

  return blocks;
}

/**
 * 블록 배열을 재귀적으로 순회하며 has_children이 true인 블록의 children을 가져와 주입합니다.
 *
 * @param blocks - 블록 배열 (Notion API 응답)
 * @param maxDepth - 최대 재귀 깊이 (기본값: 10, 무한 루프 방지)
 * @param currentDepth - 현재 깊이 (내부 사용)
 * @returns children이 주입된 블록 배열
 *
 * @example
 * ```ts
 * const topLevelBlocks = await getPageBlocks(pageId);
 * const enrichedBlocks = await enrichBlocksWithChildren(topLevelBlocks);
 * // 이제 enrichedBlocks의 모든 블록은 children이 주입됨
 * ```
 */
export async function enrichBlocksWithChildren(
  blocks: Block[],
  maxDepth: number = 10,
  currentDepth: number = 0
): Promise<Block[]> {
  // 최대 깊이 도달 시 children 없이 반환 (무한 루프 방지)
  if (currentDepth >= maxDepth) {
    console.warn(`[enrichBlocksWithChildren] Max depth (${maxDepth}) reached. Stopping recursion.`);
    return blocks;
  }

  // 병렬로 children이 있는 블록들을 처리
  const enrichedBlocks = await Promise.all(
    blocks.map(async (block) => {
      // has_children이 false면 children 가져오기 불필요
      if (!block.has_children) {
        return block;
      }

      try {
        // 자식 블록 가져오기
        const children = await fetchBlockChildren(block.id);

        // 자식 블록도 재귀적으로 처리
        const enrichedChildren = await enrichBlocksWithChildren(children, maxDepth, currentDepth + 1);

        // children 주입하여 반환
        return {
          ...block,
          children: enrichedChildren,
        };
      } catch (error) {
        console.error(`[enrichBlocksWithChildren] Failed to fetch children for block ${block.id}:`, error);
        // 에러 발생 시 children 없이 원본 블록 반환
        return block;
      }
    })
  );

  return enrichedBlocks;
}
