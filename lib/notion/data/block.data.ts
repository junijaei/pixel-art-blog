/**
 * Block Data - Entry point for pages
 */

import { fetchBlocks, fetchBlocksChildren } from '@/lib/notion/core/block.api';
import type { Block } from '@/types/notion';
import { memoizeWithArgs } from './utils';

/**
 * Get blocks for a page/block (memoized)
 */
export const getBlocks = memoizeWithArgs(async (blockId: string): Promise<Block[]> => {
  return await fetchBlocks(blockId);
});

/**
 * Get blocks with children enriched by blockId (memoized)
 * Fetches blocks and enriches with children in one call
 */
export const getBlocksWithChildren = memoizeWithArgs(
  async (blockId: string, maxDepth: number = 10): Promise<Block[]> => {
    const blocks = await fetchBlocks(blockId);
    return await fetchBlocksChildren(blocks, maxDepth);
  }
);

/**
 * Enrich existing blocks with children (not memoized, use sparingly)
 */
export async function enrichBlocksWithChildren(blocks: Block[], maxDepth: number = 10): Promise<Block[]> {
  return await fetchBlocksChildren(blocks, maxDepth);
}
