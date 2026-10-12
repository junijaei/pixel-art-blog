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
} from '@/features/post/components/blocks';
import { CommentWrapper } from '@/features/post/components/blocks/InlineComment';
import type { Block, BlockCommentRecord } from '@/features/post/model';
import { cn } from '@/shared/lib/utils';
import dynamic from 'next/dynamic';

const Image = dynamic(() => import('../Image/Image').then((m) => ({ default: m.Image })));

export interface BlockRendererProps {
  blocks: Block[];
  commentMap?: BlockCommentRecord;
  /**
   * 중첩 렌더에서는 래퍼 div를 생략한다.
   * ul/ol은 li 외의 요소를 직접 담을 수 없어서, div로 감싸면 리스트 구조가 깨진다.
   */
  nested?: boolean;
}

const LIST_TAG = {
  bulleted_list_item: 'ul',
  numbered_list_item: 'ol',
} as const;

type ListBlockType = keyof typeof LIST_TAG;

function isListBlock(block: Block): block is Block & { type: ListBlockType } {
  return block.type === 'bulleted_list_item' || block.type === 'numbered_list_item';
}

/**
 * Maps Notion blocks to their matching React components and recursively renders nested children.
 *
 * Notion은 리스트를 "같은 타입 블록의 연속"으로 줄 뿐 묶어주지 않는다.
 * 그대로 펼치면 li가 ul/ol 없이 떨어져 스크린 리더가 리스트로 읽지 못한다.
 * 연속 구간을 찾아 직접 묶는다.
 */
export function BlockRenderer({ blocks, commentMap, nested = false }: BlockRendererProps) {
  const rendered = renderBlocks(blocks, commentMap, nested);

  if (nested) return <>{rendered}</>;
  return <div className="notion-content">{rendered}</div>;
}

function renderBlocks(blocks: Block[], commentMap: BlockCommentRecord | undefined, nested: boolean) {
  const output: React.ReactNode[] = [];
  let firstImageSeen = false;
  let cursor = 0;

  while (cursor < blocks.length) {
    const block = blocks[cursor];

    if (isListBlock(block)) {
      const listType = block.type;
      const run: Block[] = [];
      while (cursor < blocks.length && blocks[cursor].type === listType) {
        run.push(blocks[cursor]);
        cursor++;
      }

      const ListTag = LIST_TAG[listType];
      output.push(
        // 번호와 불릿은 각 항목이 직접 그리므로 기본 마커와 들여쓰기를 끈다.
        // 중첩은 부모 항목에 바싹 붙이고, 최상위는 앞뒤 문단과 떨어뜨린다.
        <ListTag
          key={`${listType}-${run[0].id}`}
          className={cn('list-none space-y-2 pl-0', nested ? 'mt-2' : 'my-4')}
        >
          {run.map((item, indexInRun) => renderListItem(item, indexInRun, commentMap))}
        </ListTag>
      );
      continue;
    }

    const isFirstImage = block.type === 'image' && !firstImageSeen;
    if (isFirstImage) firstImageSeen = true;

    output.push(renderBlock(block, cursor, isFirstImage, commentMap));
    cursor++;
  }

  return output;
}

/** 리스트 항목. 댓글이 있으면 CommentWrapper가 li를 맡고 항목은 div가 된다. */
function renderListItem(block: Block, indexInRun: number, commentMap?: BlockCommentRecord) {
  const comments = commentMap?.[block.id];
  const key = block.id || `item-${indexInRun}`;

  if (comments && comments.length > 0) {
    return (
      <CommentWrapper key={key} comments={comments} as="li">
        <BlockComponent
          block={block}
          numberedListIndex={indexInRun + 1}
          commentMap={commentMap}
          listItemTag="div"
        />
      </CommentWrapper>
    );
  }

  return (
    <BlockComponent
      key={key}
      block={block}
      numberedListIndex={indexInRun + 1}
      commentMap={commentMap}
    />
  );
}

function renderBlock(
  block: Block,
  index: number,
  isFirstImage: boolean,
  commentMap?: BlockCommentRecord
) {
  const comments = commentMap?.[block.id];
  const key = block.id || index;

  const rendered = (
    <BlockComponent
      key={key}
      block={block}
      numberedListIndex={0}
      firstImage={isFirstImage}
      commentMap={commentMap}
    />
  );

  if (comments && comments.length > 0) {
    return (
      <CommentWrapper key={key} comments={comments}>
        {rendered}
      </CommentWrapper>
    );
  }

  return rendered;
}

interface BlockComponentProps {
  block: Block;
  numberedListIndex: number;
  firstImage?: boolean;
  commentMap?: BlockCommentRecord;
  /** CommentWrapper가 li를 맡을 때 항목 자신은 div로 떨어진다. */
  listItemTag?: 'li' | 'div';
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

function BlockComponent({
  block,
  numberedListIndex,
  firstImage = false,
  commentMap,
  listItemTag,
}: BlockComponentProps) {
  const childBlocks = getRenderableChildren(block);
  const children =
    childBlocks.length > 0 ? (
      <BlockRenderer blocks={childBlocks} commentMap={commentMap} nested />
    ) : undefined;

  switch (block.type) {
    case 'paragraph':
      return <Paragraph block={block}>{children}</Paragraph>;

    case 'heading_1':
    case 'heading_2':
    case 'heading_3':
      return <Heading block={block}>{children}</Heading>;

    case 'bulleted_list_item':
      return (
        <BulletedListItem block={block} as={listItemTag}>
          {children}
        </BulletedListItem>
      );

    case 'numbered_list_item':
      return (
        <NumberedListItem block={block} index={numberedListIndex - 1} as={listItemTag}>
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
