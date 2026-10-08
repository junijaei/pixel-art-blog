/**
 * Block Processor - Single Pass Collector
 *
 * Pure function that traverses block tree once to extract:
 * - TOC items
 * - Plain text (for reading time)
 * - Image blocks (for CDN processing)
 *
 * NO I/O, NO SDK, NO cache - pure data transformation
 */

import type { BlockMetadata, BlockProcessResult, TocItem } from '@/features/post/types';
import type { Block, HeadingBlock, ImageBlock } from '@/features/post/model';

/**
 * Internal Collector class
 */
class BlockCollector {
  private tocItems: TocItem[] = [];
  private textParts: string[] = [];
  private imageBlocks: ImageBlock[] = [];

  /** 블록 하나에서 필요한 것을 한 번에 거둔다. rich_text는 블록당 한 번만 펼친다. */
  collect(block: Block): void {
    if (this.isImageBlock(block)) {
      this.imageBlocks.push(block);
      return;
    }

    const richText = this.extractRichText(block);
    if (!richText) return;

    const text = richText.map((rt) => rt.plain_text).join('');

    if (this.isHeadingBlock(block)) {
      this.tocItems.push({
        id: `heading-${block.id}`,
        text,
        level: parseInt(block.type.replace('heading_', ''), 10) as 1 | 2 | 3,
      });
    }

    if (text.trim()) {
      this.textParts.push(text);
    }
  }

  finalize(): BlockMetadata {
    return {
      tocItems: this.tocItems,
      plainText: this.textParts.join(' '),
      imageBlocks: this.imageBlocks,
    };
  }

  private isHeadingBlock(block: Block): block is HeadingBlock {
    return block.type === 'heading_1' || block.type === 'heading_2' || block.type === 'heading_3';
  }

  private isImageBlock(block: Block): block is ImageBlock {
    return block.type === 'image';
  }

  private extractRichText(block: Block): Array<{ plain_text: string }> | null {
    const type = block.type;

    switch (type) {
      case 'paragraph':
        return block.paragraph?.rich_text ?? null;
      case 'heading_1':
        return block.heading_1?.rich_text ?? null;
      case 'heading_2':
        return block.heading_2?.rich_text ?? null;
      case 'heading_3':
        return block.heading_3?.rich_text ?? null;
      case 'bulleted_list_item':
        return block.bulleted_list_item?.rich_text ?? null;
      case 'numbered_list_item':
        return block.numbered_list_item?.rich_text ?? null;
      case 'to_do':
        return block.to_do?.rich_text ?? null;
      case 'toggle':
        return block.toggle?.rich_text ?? null;
      case 'quote':
        return block.quote?.rich_text ?? null;
      case 'callout':
        return block.callout?.rich_text ?? null;
      case 'code':
        return block.code?.rich_text ?? null;
      default:
        return null;
    }
  }
}

function traverseBlocks(blocks: Block[], collector: BlockCollector, maxDepth = 10, currentDepth = 0): void {
  if (currentDepth >= maxDepth) {
    console.warn(`[BlockProcessor] Max depth (${maxDepth}) reached. Stopping recursion.`);
    return;
  }

  for (const block of blocks) {
    collector.collect(block);

    if (block.has_children && 'children' in block && Array.isArray(block.children)) {
      traverseBlocks(block.children, collector, maxDepth, currentDepth + 1);
    }
  }
}

/**
 * Process block tree to extract metadata
 *
 * @param blocks - Notion blocks (with children)
 * @returns Original blocks + extracted metadata
 */
export function processBlockTree(blocks: Block[]): BlockProcessResult {
  const collector = new BlockCollector();
  traverseBlocks(blocks, collector);

  return {
    blocks,
    metadata: collector.finalize(),
  };
}
