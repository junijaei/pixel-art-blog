import {
  Bookmark,
  BulletedListItem,
  Callout,
  Code,
  Divider,
  Heading,
  NumberedListItem,
  Paragraph,
  Quote,
  ToDo,
  Toggle,
} from '@/components/notion-blocks';
import type { Block } from '@/types/notion';

export interface BlockRendererProps {
  blocks: Block[];
}

/**
 * Notion Block 배열을 받아서 적절한 컴포넌트로 렌더링하는 컴포넌트
 * 재귀적으로 children을 처리하여 중첩 구조를 지원합니다.
 */
export function BlockRenderer({ blocks }: BlockRendererProps) {
  // numbered_list_item의 순번을 계산하기 위해 연속된 항목들을 추적
  let numberedListIndex = 0;

  return (
    <>
      {blocks.map((block, index) => {
        // numbered_list_item인 경우 순번 증가, 아니면 리셋
        if (block.type === 'numbered_list_item') {
          numberedListIndex++;
        } else {
          numberedListIndex = 0;
        }

        return <BlockComponent key={block.id || index} block={block} numberedListIndex={numberedListIndex} />;
      })}
    </>
  );
}

interface BlockComponentProps {
  block: Block;
  numberedListIndex: number;
}

function BlockComponent({ block, numberedListIndex }: BlockComponentProps) {
  // children이 있는 경우 재귀적으로 렌더링
  const children = block.has_children && block.children ? <BlockRenderer blocks={block.children} /> : undefined;

  switch (block.type) {
    case 'paragraph':
      return <Paragraph block={block} />;

    case 'heading_1':
    case 'heading_2':
    case 'heading_3':
      return <Heading block={block} />;

    case 'bulleted_list_item':
      return <BulletedListItem block={block}>{children}</BulletedListItem>;

    case 'numbered_list_item':
      return (
        <NumberedListItem block={block} index={numberedListIndex - 1}>
          {children}
        </NumberedListItem>
      );

    case 'quote':
      return <Quote block={block} />;

    case 'callout':
      return <Callout block={block}>{children}</Callout>;

    case 'code':
      return <Code block={block} />;

    case 'to_do':
      return <ToDo block={block}>{children}</ToDo>;

    case 'toggle':
      return <Toggle block={block}>{children}</Toggle>;

    case 'divider':
      return <Divider />;

    case 'bookmark':
      return <Bookmark block={block} />;

    default:
      // Unknown block type - gracefully skip or show placeholder
      console.warn(`Unknown block type: ${(block as Block).type}`);
      return null;
  }
}
