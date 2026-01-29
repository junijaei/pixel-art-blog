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

import type { Block, HeadingBlock, ImageBlock } from '@/types/notion';
import type { BlockMetadata, BlockProcessResult, TocItem } from '@/lib/notion/shared/types';

/**
 * Internal Collector class
 */
class BlockCollector {
  private tocItems: TocItem[] = [];
  private textParts: string[] = [];
  private imageBlocks: ImageBlock[] = [];

  collectToc(block: Block): void {
    if (!this.isHeadingBlock(block)) return;

    const type = block.type as 'heading_1' | 'heading_2' | 'heading_3';
    const content = block[type];

    if (content?.rich_text) {
      const text = content.rich_text.map((rt) => rt.plain_text).join('');
      const level = parseInt(type.replace('heading_', ''), 10) as 1 | 2 | 3;

      this.tocItems.push({
        id: `heading-${block.id}`,
        text,
        level,
      });
    }
  }

  collectText(block: Block): void {
    const richText = this.extractRichText(block);
    if (richText) {
      const text = richText.map((rt) => rt.plain_text).join('');
      if (text.trim()) {
        this.textParts.push(text);
      }
    }
  }

  collectImage(block: Block): void {
    if (!this.isImageBlock(block)) return;
    this.imageBlocks.push(block as ImageBlock);
  }

  finalize(): BlockMetadata {
    const plainText = this.textParts.join(' ');
    const trimmedText = plainText.trim();

    return {
      tocItems: this.tocItems,
      plainText,
      wordCount: trimmedText ? trimmedText.split(/\s+/).length : 0,
      charCount: plainText.replace(/\s/g, '').length,
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
    collector.collectToc(block);
    collector.collectText(block);
    collector.collectImage(block);

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
