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
 * Get blocks with children enriched (memoized)
 */
export const getBlocksWithChildren = memoizeWithArgs(
  async (blockId: string, maxDepth: number = 10): Promise<Block[]> => {
    const blocks = await fetchBlocks(blockId);
    return await fetchBlocksChildren(blocks, maxDepth);
  }
);
