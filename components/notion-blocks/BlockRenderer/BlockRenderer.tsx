import {
  BookmarkServer,
  BulletedListItem,
  Callout,
  Code,
  Divider,
  Heading,
  NumberedListItem,
  Paragraph,
  Quote,
  Table,
  ToDo,
  Toggle,
} from '@/components/notion-blocks';
import type { Block } from '@/types/notion';
import dynamic from 'next/dynamic';

const Image = dynamic(() => import('../Image/Image').then((m) => ({ default: m.Image })));

export interface BlockRendererProps {
  blocks: Block[];
}

/**
 * Maps Notion blocks to their matching React components and recursively renders nested children.
 */
export function BlockRenderer({ blocks }: BlockRendererProps) {
  let numberedListIndex = 0;
  let firstImageSeen = false;

  return (
    <div className="notion-content">
      {blocks.map((block, index) => {
        if (block.type === 'numbered_list_item') {
          numberedListIndex++;
        } else {
          numberedListIndex = 0;
        }

        const isFirstImage = block.type === 'image' && !firstImageSeen;
        if (isFirstImage) firstImageSeen = true;

        return (
          <BlockComponent
            key={block.id || index}
            block={block}
            numberedListIndex={numberedListIndex}
            firstImage={isFirstImage}
          />
        );
      })}
    </div>
  );
}

interface BlockComponentProps {
  block: Block;
  numberedListIndex: number;
  firstImage?: boolean;
}

function getRenderableChildren(block: Block): Block[] {
  if (!block.has_children || !block.children) {
    return [];
  }

  if (block.type === 'table') {
    return block.children.filter((child) => child.type !== 'table_row');
  }

  return block.children;
}

function BlockComponent({ block, numberedListIndex, firstImage = false }: BlockComponentProps) {
  const childBlocks = getRenderableChildren(block);
  const children = childBlocks.length > 0 ? <BlockRenderer blocks={childBlocks} /> : undefined;

  switch (block.type) {
    case 'paragraph':
      return <Paragraph block={block}>{children}</Paragraph>;

    case 'heading_1':
    case 'heading_2':
    case 'heading_3':
      return <Heading block={block}>{children}</Heading>;

    case 'bulleted_list_item':
      return <BulletedListItem block={block}>{children}</BulletedListItem>;

    case 'numbered_list_item':
      return (
        <NumberedListItem block={block} index={numberedListIndex - 1}>
          {children}
        </NumberedListItem>
      );

    case 'quote':
      return <Quote block={block}>{children}</Quote>;

    case 'callout':
      return <Callout block={block}>{children}</Callout>;

    case 'code':
      return <Code block={block}>{children}</Code>;

    case 'image':
      return (
        <Image block={block} priority={firstImage}>
          {children}
        </Image>
      );

    case 'to_do':
      return <ToDo block={block}>{children}</ToDo>;

    case 'toggle':
      return <Toggle block={block}>{children}</Toggle>;

    case 'divider':
      return <Divider>{children}</Divider>;

    case 'bookmark':
      return <BookmarkServer block={block}>{children}</BookmarkServer>;

    case 'table':
      return <Table block={block}>{children}</Table>;

    default:
      console.warn(`Unknown block type: ${(block as Block).type}`);
      return null;
  }
}
