import type {
  BlockObjectResponse,
  PageObjectResponse,
  RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints';

// ============================================================================
// Notion API 기본 타입
// ============================================================================

export type NotionBlock = BlockObjectResponse;
export type NotionPage = PageObjectResponse;
export type NotionRichText = RichTextItemResponse;

// ============================================================================
// RichText 관련 타입 (블록 컴포넌트용)
// ============================================================================

/**
 * Notion API의 RichText 타입 정의
 */
export interface RichTextAnnotations {
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  underline: boolean;
  code: boolean;
  color: string;
}

export interface RichTextText {
  content: string;
  link: {
    url: string;
  } | null;
}

export interface RichTextItem {
  type: 'text';
  text: RichTextText;
  annotations: RichTextAnnotations;
  plain_text: string;
  href: string | null;
}

// ============================================================================
// 블로그 포스트 관련 타입
// ============================================================================

export interface BlogPost {
  id: string;
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  published: boolean;
  publishedDate: string;
  lastEditedTime: string;
  slug: string;
  coverImage?: string;
}

export interface BlogPostContent extends BlogPost {
  blocks: NotionBlock[];
}
