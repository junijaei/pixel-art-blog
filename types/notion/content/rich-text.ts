/**
 * Rich Text Types
 */

import type { NotionColor, NotionUser, UUID } from '@/types/notion/base';

export interface RichTextAnnotations {
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  underline: boolean;
  code: boolean;
  color: NotionColor;
}

interface RichTextBase {
  annotations: RichTextAnnotations;
  plain_text: string;
  href: string | null;
}

export interface RichTextText extends RichTextBase {
  type: 'text';
  text: {
    content: string;
    link: { url: string } | null;
  };
}

export interface RichTextEquation extends RichTextBase {
  type: 'equation';
  equation: { expression: string };
}

export interface UserMention {
  type: 'user';
  user: NotionUser;
}
export interface PageMention {
  type: 'page';
  page: { id: UUID };
}
export interface DatabaseMention {
  type: 'database';
  database: { id: UUID };
}
export interface DateMention {
  type: 'date';
  date: { start: string; end: string | null };
}
export interface LinkPreviewMention {
  type: 'link_mention';
  link_mention: {
    href?: string;
    icon_url?: string;
    thumbnail_url?: string;
    title?: string;
    description?: string;
  };
}
export interface TemplateMention {
  type: 'template_mention';
  template_mention: unknown;
}

export interface RichTextMention extends RichTextBase {
  type: 'mention';
  mention:
    | UserMention
    | UserMention
    | PageMention
    | DatabaseMention
    | DateMention
    | LinkPreviewMention
    | TemplateMention;
}

export type RichText = RichTextText | RichTextEquation | RichTextMention;
