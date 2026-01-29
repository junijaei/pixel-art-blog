import {
  Block,
  BulletedListBlock,
  Category,
  CategoryPage,
  HeadingBlock,
  ImageBlock,
  NumberedListBlock,
  ParagraphBlock,
  PostPage,
  RichText,
} from '@/types/notion';

// 테스트용 mock 블록 생성 헬퍼
export function createMockBlock(id: string, hasChildren: boolean = false, type: string = 'paragraph'): Block {
  return {
    object: 'block',
    id,
    type,
    has_children: hasChildren,
    archived: false,
    parent: { type: 'page_id', page_id: 'parent-page' },
    created_time: '2024-01-01T00:00:00.000Z',
    last_edited_time: '2024-01-01T00:00:00.000Z',
    paragraph: {
      rich_text: [
        {
          type: 'text',
          text: { content: `Block ${id}`, link: null },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          plain_text: `Block ${id}`,
          href: null,
        },
      ],
      color: 'default',
    },
  } as Block;
}

export function createMockBulletListBlock(
  richTextContent: string,
  options: {
    bold?: boolean;
    color?: string;
    hasChildren?: boolean;
  } = {}
): BulletedListBlock {
  const { bold = false, color = 'default', hasChildren = false } = options;
  return {
    type: 'bulleted_list_item',
    bulleted_list_item: {
      rich_text: richTextContent
        ? [
            {
              type: 'text',
              text: { content: richTextContent, link: null },
              annotations: {
                bold,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: richTextContent,
              href: null,
            } as RichText,
          ]
        : [],
      color,
    },
    has_children: hasChildren,
  } as BulletedListBlock;
}

export function createMockNumberListBlock(
  richTextContent: string,
  options: {
    bold?: boolean;
    color?: string;
    hasChildren?: boolean;
  } = {}
): NumberedListBlock {
  const { bold = false, color = 'default', hasChildren = false } = options;
  return {
    type: 'numbered_list_item',
    numbered_list_item: {
      rich_text: richTextContent
        ? [
            {
              type: 'text',
              text: { content: richTextContent, link: null },
              annotations: {
                bold,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: richTextContent,
              href: null,
            } as RichText,
          ]
        : [],
      color,
    },
    has_children: hasChildren,
  } as NumberedListBlock;
}

export function createMockParagraphBlock(id: string, text: string): ParagraphBlock {
  return {
    object: 'block',
    id,
    type: 'paragraph',
    created_time: '2026-01-14T00:00:00.000Z',
    last_edited_time: '2026-01-14T00:00:00.000Z',
    has_children: false,
    archived: false,
    parent: { type: 'page_id', page_id: 'page-1' },
    paragraph: {
      rich_text: [
        {
          type: 'text',
          text: { content: text, link: null },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          plain_text: text,
          href: null,
        },
      ],
      color: 'default',
    },
  };
}

export function createMockHeadingBlock(id: string, text: string, level: 1 | 2 | 3): HeadingBlock {
  const type = `heading_${level}` as 'heading_1' | 'heading_2' | 'heading_3';
  return {
    object: 'block',
    id,
    type,
    created_time: '2026-01-14T00:00:00.000Z',
    last_edited_time: '2026-01-14T00:00:00.000Z',
    has_children: false,
    archived: false,
    parent: { type: 'page_id', page_id: 'page-1' },
    [type]: {
      rich_text: [
        {
          type: 'text',
          text: { content: text, link: null },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          plain_text: text,
          href: null,
        },
      ],
      color: 'default',
      is_toggleable: false,
    },
  };
}

export function createMockImageBlock(id: string, url: string): ImageBlock {
  return {
    object: 'block',
    id,
    type: 'image',
    created_time: '2026-01-14T00:00:00.000Z',
    last_edited_time: '2026-01-14T00:00:00.000Z',
    has_children: false,
    archived: false,
    parent: { type: 'page_id', page_id: 'page-1' },
    image: {
      type: 'external',
      external: { url },
    },
  };
}

export function createMockCategory(
  overrides: Partial<Category> & { id: string; label: string; path: string }
): Category {
  return {
    parentId: null,
    hasChildren: false,
    isActive: true,
    createdAt: '',
    updatedAt: '',
    ...overrides,
  };
}

// ─── Database Page Fixtures ─────────────────────────────────────────────────

const baseDatabasePage = {
  object: 'page' as const,
  created_by: { object: 'user' as const, id: 'user-1' },
  last_edited_by: { object: 'user' as const, id: 'user-1' },
  cover: null,
  icon: null,
  archived: false,
  url: 'https://www.notion.so/test',
  public_url: null,
};

/**
 * PostPage mock 생성 헬퍼
 * 모든 property를 올바른 Notion API 형식으로 생성합니다.
 */
export function createMockPostPage(
  overrides: {
    id?: { prefix: string | null; number: number };
    title?: string;
    categoryId?: string;
    status?: 'scheduled' | 'draft' | 'completed';
    description?: string;
    isPublished?: boolean;
    publishedAt?: string;
    slug?: string;
    tags?: string[];
    createdAt?: string;
    updatedAt?: string;
  } = {}
): PostPage {
  const {
    id = { prefix: 'post-page', number: 1 },
    title = 'Test Post',
    categoryId = 'cat-1',
    status = 'completed',
    description = 'A test description',
    isPublished = true,
    publishedAt = '2025-01-15',
    slug = 'test-post',
    tags = ['tag1', 'tag2'],
    createdAt = '2025-01-01T00:00:00.000Z',
    updatedAt = '2025-01-15T00:00:00.000Z',
  } = overrides;

  return {
    ...baseDatabasePage,
    created_time: createdAt,
    last_edited_time: updatedAt,
    parent: { type: 'database_id', database_id: 'post-db-1' },
    properties: {
      ID: { id: 'id-prop', type: 'unique_id', unique_id: id },
      title: {
        id: 'title-prop',
        type: 'title',
        title: title
          ? [
              {
                type: 'text',
                text: { content: title, link: null },
                annotations: {
                  bold: false,
                  italic: false,
                  strikethrough: false,
                  underline: false,
                  code: false,
                  color: 'default',
                },
                plain_text: title,
                href: null,
              },
            ]
          : [],
      },
      category: {
        id: 'cat-prop',
        type: 'relation',
        relation: categoryId ? [{ id: categoryId }] : [],
      },
      status: {
        id: 'status-prop',
        type: 'status',
        status: { id: 'status-1', name: status, color: 'default' },
      },
      description: {
        id: 'desc-prop',
        type: 'rich_text',
        rich_text: description
          ? [
              {
                type: 'text',
                text: { content: description, link: null },
                annotations: {
                  bold: false,
                  italic: false,
                  strikethrough: false,
                  underline: false,
                  code: false,
                  color: 'default',
                },
                plain_text: description,
                href: null,
              },
            ]
          : [],
      },
      isPublished: {
        id: 'pub-prop',
        type: 'checkbox',
        checkbox: isPublished,
      },
      publishedAt: {
        id: 'pubat-prop',
        type: 'date',
        date: publishedAt ? { start: publishedAt, end: null, time_zone: null } : null,
      },
      slug: {
        id: 'slug-prop',
        type: 'rich_text',
        rich_text: slug
          ? [
              {
                type: 'text',
                text: { content: slug, link: null },
                annotations: {
                  bold: false,
                  italic: false,
                  strikethrough: false,
                  underline: false,
                  code: false,
                  color: 'default',
                },
                plain_text: slug,
                href: null,
              },
            ]
          : [],
      },
      tag: {
        id: 'tag-prop',
        type: 'multi_select',
        multi_select: tags.map((name, i) => ({ id: `tag-${i}`, name, color: 'default' as const })),
      },
      createdAt: {
        id: 'created-prop',
        type: 'created_time',
        created_time: createdAt,
      },
      updatedAt: {
        id: 'updated-prop',
        type: 'last_edited_time',
        last_edited_time: updatedAt,
      },
    },
  } as PostPage;
}

/**
 * CategoryPage mock 생성 헬퍼
 * 모든 property를 올바른 Notion API 형식으로 생성합니다.
 */
export function createMockCategoryPage(
  overrides: {
    id?: { prefix: string | null; number: number };
    label?: string;
    parentId?: string | null;
    childrenIds?: string[];
    path?: string;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
  } = {}
): CategoryPage {
  const {
    id = { prefix: 'cat-page', number: 1 },
    label = 'Test Category',
    parentId = null,
    childrenIds = [],
    path = '/test',
    isActive = true,
    createdAt = '2025-01-01T00:00:00.000Z',
    updatedAt = '2025-01-15T00:00:00.000Z',
  } = overrides;

  return {
    ...baseDatabasePage,
    created_time: createdAt,
    last_edited_time: updatedAt,
    parent: { type: 'database_id', database_id: 'cat-db-1' },
    properties: {
      ID: { id: 'id-prop', type: 'unique_id', unique_id: id },
      label: {
        id: 'label-prop',
        type: 'title',
        title: label
          ? [
              {
                type: 'text',
                text: { content: label, link: null },
                annotations: {
                  bold: false,
                  italic: false,
                  strikethrough: false,
                  underline: false,
                  code: false,
                  color: 'default',
                },
                plain_text: label,
                href: null,
              },
            ]
          : [],
      },
      parent: {
        id: 'parent-prop',
        type: 'relation',
        relation: parentId ? [{ id: parentId }] : [],
      },
      children: {
        id: 'children-prop',
        type: 'relation',
        relation: childrenIds.map((cid) => ({ id: cid })),
      },
      path: {
        id: 'path-prop',
        type: 'rich_text',
        rich_text: path
          ? [
              {
                type: 'text',
                text: { content: path, link: null },
                annotations: {
                  bold: false,
                  italic: false,
                  strikethrough: false,
                  underline: false,
                  code: false,
                  color: 'default',
                },
                plain_text: path,
                href: null,
              },
            ]
          : [],
      },
      isActive: {
        id: 'active-prop',
        type: 'select',
        select: isActive
          ? { id: 'sel-1', name: 'active', color: 'default' as const }
          : { id: 'sel-2', name: 'deactive', color: 'default' as const },
      },
      createdAt: {
        id: 'created-prop',
        type: 'created_time',
        created_time: createdAt,
      },
      updatedAt: {
        id: 'updated-prop',
        type: 'last_edited_time',
        last_edited_time: updatedAt,
      },
    },
  } as CategoryPage;
}
