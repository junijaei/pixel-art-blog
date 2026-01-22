import type { Block, HeadingBlock } from '@/types/notion';
import type { TocItem } from '@/components/ui';

/**
 * Notion 블록 배열에서 heading들을 추출하여 TOC 아이템으로 변환
 *
 * @param blocks - Notion 블록 배열
 * @returns TOC 아이템 배열
 */
export function extractTocItems(blocks: Block[]): TocItem[] {
  const tocItems: TocItem[] = [];

  for (const block of blocks) {
    if (block.type === 'heading_1' || block.type === 'heading_2' || block.type === 'heading_3') {
      const headingBlock = block as HeadingBlock;
      const type = headingBlock.type;
      const content = headingBlock[type];

      if (content && content.rich_text) {
        const text = content.rich_text.map((rt) => rt.plain_text).join('');
        const level = parseInt(type.replace('heading_', ''), 10) as 1 | 2 | 3;

        tocItems.push({
          id: `heading-${block.id}`,
          text,
          level,
        });
      }
    }

    // Recursively check children (for toggleable headings, etc.)
    if (block.has_children && 'children' in block && Array.isArray(block.children)) {
      tocItems.push(...extractTocItems(block.children));
    }
  }

  return tocItems;
}
