import type { ISODate, NotionColor, NotionFile, NotionParent, NotionUser, RichText, UUID } from '../index';

/* =====================================================
 * Block Base
 ===================================================== */

export interface BlockBase {
  object: 'block';
  id: UUID;
  parent: NotionParent;
  created_time: ISODate;
  last_edited_time: ISODate;
  created_by?: NotionUser;
  last_edited_by?: NotionUser;
  has_children: boolean;
  archived: boolean;
  in_trash?: boolean;
  children?: Block[];
}

/* =====================================================
   * Text Based Block 공통 구조
   ===================================================== */

interface TextBlockContent {
  rich_text: RichText[];
  color: NotionColor;
}

/* =====================================================
   * Block Definitions
   ===================================================== */

export interface ParagraphBlock extends BlockBase {
  type: 'paragraph';
  paragraph: TextBlockContent;
}

export interface HeadingBlock extends BlockBase {
  type: 'heading_1' | 'heading_2' | 'heading_3';
  heading_1?: TextBlockContent & { is_toggleable?: boolean };
  heading_2?: TextBlockContent & { is_toggleable?: boolean };
  heading_3?: TextBlockContent & { is_toggleable?: boolean };
}

export interface BulletedListBlock extends BlockBase {
  type: 'bulleted_list_item';
  bulleted_list_item: TextBlockContent;
}

export interface NumberedListBlock extends BlockBase {
  type: 'numbered_list_item';
  numbered_list_item: TextBlockContent;
}

export interface ToDoBlock extends BlockBase {
  type: 'to_do';
  to_do: TextBlockContent & { checked: boolean };
}

export interface ToggleBlock extends BlockBase {
  type: 'toggle';
  toggle: TextBlockContent;
}

export interface QuoteBlock extends BlockBase {
  type: 'quote';
  quote: TextBlockContent;
}

export interface CalloutBlock extends BlockBase {
  type: 'callout';
  callout: {
    rich_text: RichText[];
    icon: { emoji?: string } | null;
    color: NotionColor;
  };
}

export interface CodeBlock extends BlockBase {
  type: 'code';
  code: {
    caption: RichText[];
    rich_text: RichText[];
    language: string;
  };
}

/* =====================================================
   * Media
   ===================================================== */

export interface ImageBlock extends BlockBase {
  type: 'image';
  image: NotionFile;
}

export interface VideoBlock extends BlockBase {
  type: 'video';
  video: NotionFile;
}

export interface AudioBlock extends BlockBase {
  type: 'audio';
  audio: NotionFile;
}

/* =====================================================
   * DB / Page
   ===================================================== */

export interface ChildPageBlock extends BlockBase {
  type: 'child_page';
  child_page: { title: string };
}

export interface ChildDatabaseBlock extends BlockBase {
  type: 'child_database';
  child_database: { title: string };
}

/* =====================================================
   * Table
   ===================================================== */

export interface TableBlock extends BlockBase {
  type: 'table';
  table: {
    table_width: number;
    has_column_header: boolean;
    has_row_header: boolean;
  };
}

export interface TableRowBlock extends BlockBase {
  type: 'table_row';
  table_row: {
    cells: RichText[][];
  };
}

/* =====================================================
   * Layout
   ===================================================== */

export interface ColumnListBlock extends BlockBase {
  type: 'column_list';
  column_list: never;
}

export interface ColumnBlock extends BlockBase {
  type: 'column';
  column: { width_ratio?: number };
}

/* =====================================================
   * 기타
   ===================================================== */

export interface BookmarkBlock extends BlockBase {
  type: 'bookmark';
  bookmark: { url: string; caption: RichText[] };
}

export interface TableOfContentsBlock extends BlockBase {
  type: 'table_of_contents';
  table_of_contents: { color: NotionColor };
}

export interface BreadcrumbBlock extends BlockBase {
  type: 'breadcrumb';
  breadcrumb: never;
}

export interface SyncedBlock extends BlockBase {
  type: 'synced_block';
  synced_block: unknown;
}

export interface LinkPreviewBlock extends BlockBase {
  type: 'link_preview';
  link_preview: { url: string };
}

export interface TemplateBlock extends BlockBase {
  type: 'template';
  template: { rich_text: RichText[] };
}

export interface DividerBlock extends BlockBase {
  type: 'divider';
  divider: Record<string, never>;
}

export interface UnsupportedBlock extends BlockBase {
  type: 'unsupported';
  unsupported: never;
}

/* =====================================================
   * Union
   ===================================================== */

export type Block =
  | ParagraphBlock
  | HeadingBlock
  | BulletedListBlock
  | NumberedListBlock
  | ToDoBlock
  | ToggleBlock
  | QuoteBlock
  | CalloutBlock
  | CodeBlock
  | DividerBlock
  | ImageBlock
  | VideoBlock
  | AudioBlock
  | ChildPageBlock
  | ChildDatabaseBlock
  | TableBlock
  | TableRowBlock
  | ColumnListBlock
  | ColumnBlock
  | BookmarkBlock
  | TableOfContentsBlock
  | BreadcrumbBlock
  | SyncedBlock
  | LinkPreviewBlock
  | TemplateBlock
  | UnsupportedBlock;
