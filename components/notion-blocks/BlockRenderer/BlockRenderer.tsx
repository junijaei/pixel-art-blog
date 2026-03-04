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
  ToDo,
  Toggle,
} from '@/components/notion-blocks';
import type { Block } from '@/types/notion';
import dynamic from 'next/dynamic';

// Image 블록은 모달(useState)을 포함한 클라이언트 컴포넌트이므로
// next/dynamic으로 코드 분할하여 초기 번들에서 제외합니다.
const Image = dynamic(() => import('../Image/Image').then((m) => ({ default: m.Image })));

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
  // LCP 최적화: 첫 번째 이미지 블록에 priority 힌트 부여
  let firstImageSeen = false;

  return (
    <div className="notion-content">
      {blocks.map((block, index) => {
        // numbered_list_item인 경우 순번 증가, 아니면 리셋
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

function BlockComponent({ block, numberedListIndex, firstImage = false }: BlockComponentProps) {
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
      return <Quote block={block}>{children}</Quote>;

    case 'callout':
      return <Callout block={block}>{children}</Callout>;

    case 'code':
      return <Code block={block} />;

    case 'image':
      return <Image block={block} priority={firstImage} />;

    case 'to_do':
      return <ToDo block={block}>{children}</ToDo>;

    case 'toggle':
      return <Toggle block={block}>{children}</Toggle>;

    case 'divider':
      return <Divider />;

    case 'bookmark':
      return <BookmarkServer block={block} />;

    default:
      // Unknown block type - gracefully skip or show placeholder
      console.warn(`Unknown block type: ${(block as Block).type}`);
      return null;
  }
}
