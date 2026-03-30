/**
 * Block Data - Entry point for pages
 */

import { fetchBlocks, fetchBlocksChildren } from '@/lib/notion/core/block.api';
import type { Block } from '@/types/notion';
import { cache } from 'react';

/**
 * Get blocks for a page/block (memoized)
 */
export const getBlocks = cache(async (blockId: string): Promise<Block[]> => {
  return await fetchBlocks(blockId);
});

/**
 * Get blocks with children enriched by blockId (memoized)
 * Fetches blocks and enriches with children in one call
 */
export const getBlocksWithChildren = cache(async (blockId: string, maxDepth: number = 10): Promise<Block[]> => {
  // getBlocks의 캐시 결과를 재사용해 Notion API 중복 호출을 방지한다.
  // fetchBlocksChildren은 spread로 새 객체를 생성하므로 캐시된 블록을 변형하지 않는다.
  const blocks = await getBlocks(blockId);
  return await fetchBlocksChildren(blocks, maxDepth);
});

/**
 * Enrich existing blocks with children (not memoized, use sparingly)
 */
export async function enrichBlocksWithChildren(blocks: Block[], maxDepth: number = 10): Promise<Block[]> {
  return await fetchBlocksChildren(blocks, maxDepth);
}
