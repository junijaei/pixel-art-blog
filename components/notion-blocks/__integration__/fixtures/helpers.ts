import type {
  BlockBase,
  BookmarkBlock,
  BulletedListBlock,
  CalloutBlock,
  CodeBlock,
  HeadingBlock,
  ImageBlock,
  NotionColor,
  NumberedListBlock,
  ParagraphBlock,
  QuoteBlock,
  RichText,
  RichTextAnnotations,
  TableBlock,
  TableRowBlock,
  ToDoBlock,
  ToggleBlock,
} from '@/types/notion';

const DEFAULT_BLOCK_META = {
  object: 'block' as const,
  created_time: '2026-01-14T00:00:00.000Z',
  last_edited_time: '2026-01-14T00:00:00.000Z',
  created_by: { object: 'user' as const, id: 'user-1' },
  last_edited_by: { object: 'user' as const, id: 'user-1' },
  archived: false,
  in_trash: false,
  parent: { type: 'page_id' as const, page_id: 'page-1' },
};

const DEFAULT_ANNOTATIONS: RichTextAnnotations = {
  bold: false,
  italic: false,
  strikethrough: false,
  underline: false,
  code: false,
  color: 'default',
};

interface RichTextOptions {
  bold?: boolean;
  italic?: boolean;
  strikethrough?: boolean;
  underline?: boolean;
  code?: boolean;
  color?: NotionColor;
  link?: string;
}

export function createRichText(content: string, options: RichTextOptions = {}): RichText[] {
  const { bold, italic, strikethrough, underline, code, color, link } = options;

  return [
    {
      type: 'text',
      text: {
        content,
        link: link ? { url: link } : null,
      },
      annotations: {
        ...DEFAULT_ANNOTATIONS,
        ...(bold !== undefined && { bold }),
        ...(italic !== undefined && { italic }),
        ...(strikethrough !== undefined && { strikethrough }),
        ...(underline !== undefined && { underline }),
        ...(code !== undefined && { code }),
        ...(color !== undefined && { color }),
      },
      plain_text: content,
      href: link || null,
    },
  ];
}

export function combineRichText(...richTexts: RichText[][]): RichText[] {
  return richTexts.flat();
}

let blockIdCounter = 0;

function generateBlockId(prefix: string): string {
  return `${prefix}-${++blockIdCounter}`;
}

export function resetBlockIdCounter(): void {
  blockIdCounter = 0;
}

type BlockBaseOptions = Partial<Pick<BlockBase, 'id' | 'has_children' | 'children'>>;

export function createParagraphBlock(
  richText: RichText[],
  color: NotionColor = 'default',
  options: BlockBaseOptions = {}
): ParagraphBlock {
  return {
    ...DEFAULT_BLOCK_META,
    id: options.id ?? generateBlockId('paragraph'),
    type: 'paragraph',
    has_children: options.has_children ?? false,
    children: options.children,
    paragraph: {
      rich_text: richText,
      color,
    },
  };
}

export function createHeadingBlock(
  level: 1 | 2 | 3,
  richText: RichText[],
  color: NotionColor = 'default',
  options: BlockBaseOptions & { is_toggleable?: boolean } = {}
): HeadingBlock {
  const headingKey = `heading_${level}` as const;

  return {
    ...DEFAULT_BLOCK_META,
    id: options.id ?? generateBlockId(`heading-${level}`),
    type: headingKey,
    has_children: options.has_children ?? false,
    children: options.children,
    [headingKey]: {
      rich_text: richText,
      color,
      is_toggleable: options.is_toggleable ?? false,
    },
  } as HeadingBlock;
}

export function createBulletedListBlock(
  richText: RichText[],
  color: NotionColor = 'default',
  options: BlockBaseOptions = {}
): BulletedListBlock {
  return {
    ...DEFAULT_BLOCK_META,
    id: options.id ?? generateBlockId('bulleted'),
    type: 'bulleted_list_item',
    has_children: options.has_children ?? false,
    children: options.children,
    bulleted_list_item: {
      rich_text: richText,
      color,
    },
  };
}

export function createNumberedListBlock(
  richText: RichText[],
  color: NotionColor = 'default',
  options: BlockBaseOptions = {}
): NumberedListBlock {
  return {
    ...DEFAULT_BLOCK_META,
    id: options.id ?? generateBlockId('numbered'),
    type: 'numbered_list_item',
    has_children: options.has_children ?? false,
    children: options.children,
    numbered_list_item: {
      rich_text: richText,
      color,
    },
  };
}

export function createToDoBlock(
  richText: RichText[],
  checked: boolean,
  color: NotionColor = 'default',
  options: BlockBaseOptions = {}
): ToDoBlock {
  return {
    ...DEFAULT_BLOCK_META,
    id: options.id ?? generateBlockId('todo'),
    type: 'to_do',
    has_children: options.has_children ?? false,
    children: options.children,
    to_do: {
      rich_text: richText,
      color,
      checked,
    },
  };
}

export function createToggleBlock(
  richText: RichText[],
  color: NotionColor = 'default',
  options: BlockBaseOptions = {}
): ToggleBlock {
  return {
    ...DEFAULT_BLOCK_META,
    id: options.id ?? generateBlockId('toggle'),
    type: 'toggle',
    has_children: options.has_children ?? options.children !== undefined,
    children: options.children,
    toggle: {
      rich_text: richText,
      color,
    },
  };
}

export function createQuoteBlock(
  richText: RichText[],
  color: NotionColor = 'default',
  options: BlockBaseOptions = {}
): QuoteBlock {
  return {
    ...DEFAULT_BLOCK_META,
    id: options.id ?? generateBlockId('quote'),
    type: 'quote',
    has_children: options.has_children ?? false,
    children: options.children,
    quote: {
      rich_text: richText,
      color,
    },
  };
}

export function createCalloutBlock(
  richText: RichText[],
  icon: { emoji: string } | null = null,
  color: NotionColor = 'default',
  options: BlockBaseOptions = {}
): CalloutBlock {
  return {
    ...DEFAULT_BLOCK_META,
    id: options.id ?? generateBlockId('callout'),
    type: 'callout',
    has_children: options.has_children ?? options.children !== undefined,
    children: options.children,
    callout: {
      rich_text: richText,
      icon,
      color,
    },
  };
}

export function createCodeBlock(
  code: string,
  language: string,
  caption: RichText[] = [],
  options: BlockBaseOptions = {}
): CodeBlock {
  return {
    ...DEFAULT_BLOCK_META,
    id: options.id ?? generateBlockId('code'),
    type: 'code',
    has_children: options.has_children ?? false,
    children: options.children,
    code: {
      rich_text: createRichText(code),
      language,
      caption,
    },
  };
}

export function createBookmarkBlock(
  url: string,
  caption: RichText[] = [],
  options: BlockBaseOptions = {}
): BookmarkBlock {
  return {
    ...DEFAULT_BLOCK_META,
    id: options.id ?? generateBlockId('bookmark'),
    type: 'bookmark',
    has_children: options.has_children ?? false,
    children: options.children,
    bookmark: {
      url,
      caption,
    },
  };
}

export function createImageBlock(
  url: string,
  type: 'file' | 'external' = 'external',
  name?: string,
  caption: RichText[] = [],
  options: BlockBaseOptions = {}
): ImageBlock {
  return {
    ...DEFAULT_BLOCK_META,
    id: options.id ?? generateBlockId('image'),
    type: 'image',
    has_children: options.has_children ?? false,
    children: options.children,
    image: {
      type,
      ...(type === 'file' && {
        file: {
          url,
          expiry_time: '2026-12-31T23:59:59.000Z',
        },
      }),
      ...(type === 'external' && {
        external: {
          url,
        },
      }),
      ...(name && { name }),
      ...(caption.length > 0 && { caption }),
    },
  };
}

export function createTableRowBlock(cellTexts: string[], options: BlockBaseOptions = {}): TableRowBlock {
  return {
    ...DEFAULT_BLOCK_META,
    id: options.id ?? generateBlockId('table-row'),
    has_children: false,
    children: options.children,
    type: 'table_row',
    table_row: {
      cells: cellTexts.map((text) => createRichText(text)),
    },
  };
}

export function createTableBlock(
  rows: TableRowBlock[],
  options: BlockBaseOptions & { has_column_header?: boolean; has_row_header?: boolean } = {}
): TableBlock {
  return {
    ...DEFAULT_BLOCK_META,
    id: options.id ?? generateBlockId('table'),
    has_children: rows.length > 0,
    children: rows,
    type: 'table',
    table: {
      table_width: rows[0]?.table_row.cells.length ?? 0,
      has_column_header: options.has_column_header ?? false,
      has_row_header: options.has_row_header ?? false,
    },
  };
}
