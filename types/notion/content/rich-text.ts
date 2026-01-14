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

export interface RichTextMention extends RichTextBase {
  type: 'mention';
  mention:
    | { type: 'user'; user: NotionUser }
    | { type: 'page'; page: { id: UUID } }
    | { type: 'database'; database: { id: UUID } }
    | { type: 'date'; date: { start: string; end: string | null } }
    | { type: 'link_preview'; link_preview: { url: string } }
    | { type: 'template_mention'; template_mention: unknown };
}

export type RichText = RichTextText | RichTextEquation | RichTextMention;
