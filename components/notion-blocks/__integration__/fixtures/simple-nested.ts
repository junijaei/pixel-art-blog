import type { BulletedListBlock, CalloutBlock, NumberedListBlock, ToggleBlock } from '@/types/notion';

/**
 * Phase 1: 기본 중첩 시나리오 Fixture
 */

// 1. BulletedListItem 2-depth 중첩
export const nestedBulletedListFixture: BulletedListBlock[] = [
  {
    object: 'block',
    id: 'bulleted-parent-1',
    type: 'bulleted_list_item',
    created_time: '2026-01-14T00:00:00.000Z',
    last_edited_time: '2026-01-14T00:00:00.000Z',
    created_by: { object: 'user', id: 'user-1' },
    last_edited_by: { object: 'user', id: 'user-1' },
    has_children: true,
    archived: false,
    in_trash: false,
    parent: { type: 'page_id', page_id: 'page-1' },
    bulleted_list_item: {
      rich_text: [
        {
          type: 'text',
          text: { content: 'Parent item 1', link: null },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          plain_text: 'Parent item 1',
          href: null,
        },
      ],
      color: 'default',
    },
    children: [
      {
        object: 'block',
        id: 'bulleted-child-1-1',
        type: 'bulleted_list_item',
        created_time: '2026-01-14T00:00:00.000Z',
        last_edited_time: '2026-01-14T00:00:00.000Z',
        created_by: { object: 'user', id: 'user-1' },
        last_edited_by: { object: 'user', id: 'user-1' },
        has_children: false,
        archived: false,
        in_trash: false,
        parent: { type: 'block_id', block_id: 'bulleted-parent-1' },
        bulleted_list_item: {
          rich_text: [
            {
              type: 'text',
              text: { content: 'Child item 1-1', link: null },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Child item 1-1',
              href: null,
            },
          ],
          color: 'default',
        },
      },
      {
        object: 'block',
        id: 'bulleted-child-1-2',
        type: 'bulleted_list_item',
        created_time: '2026-01-14T00:00:00.000Z',
        last_edited_time: '2026-01-14T00:00:00.000Z',
        created_by: { object: 'user', id: 'user-1' },
        last_edited_by: { object: 'user', id: 'user-1' },
        has_children: false,
        archived: false,
        in_trash: false,
        parent: { type: 'block_id', block_id: 'bulleted-parent-1' },
        bulleted_list_item: {
          rich_text: [
            {
              type: 'text',
              text: { content: 'Child item 1-2', link: null },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Child item 1-2',
              href: null,
            },
          ],
          color: 'default',
        },
      },
    ],
  },
];

// 2. NumberedListItem 2-depth 중첩
export const nestedNumberedListFixture: NumberedListBlock[] = [
  {
    object: 'block',
    id: 'numbered-parent-1',
    type: 'numbered_list_item',
    created_time: '2026-01-14T00:00:00.000Z',
    last_edited_time: '2026-01-14T00:00:00.000Z',
    created_by: { object: 'user', id: 'user-1' },
    last_edited_by: { object: 'user', id: 'user-1' },
    has_children: false,
    archived: false,
    in_trash: false,
    parent: { type: 'page_id', page_id: 'page-1' },
    numbered_list_item: {
      rich_text: [
        {
          type: 'text',
          text: { content: 'First item', link: null },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          plain_text: 'First item',
          href: null,
        },
      ],
      color: 'default',
    },
  },
  {
    object: 'block',
    id: 'numbered-parent-2',
    type: 'numbered_list_item',
    created_time: '2026-01-14T00:00:00.000Z',
    last_edited_time: '2026-01-14T00:00:00.000Z',
    created_by: { object: 'user', id: 'user-1' },
    last_edited_by: { object: 'user', id: 'user-1' },
    has_children: true,
    archived: false,
    in_trash: false,
    parent: { type: 'page_id', page_id: 'page-1' },
    numbered_list_item: {
      rich_text: [
        {
          type: 'text',
          text: { content: 'Second item', link: null },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          plain_text: 'Second item',
          href: null,
        },
      ],
      color: 'default',
    },
    children: [
      {
        object: 'block',
        id: 'numbered-child-2-1',
        type: 'numbered_list_item',
        created_time: '2026-01-14T00:00:00.000Z',
        last_edited_time: '2026-01-14T00:00:00.000Z',
        created_by: { object: 'user', id: 'user-1' },
        last_edited_by: { object: 'user', id: 'user-1' },
        has_children: false,
        archived: false,
        in_trash: false,
        parent: { type: 'block_id', block_id: 'numbered-parent-2' },
        numbered_list_item: {
          rich_text: [
            {
              type: 'text',
              text: { content: 'Nested item 1', link: null },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Nested item 1',
              href: null,
            },
          ],
          color: 'default',
        },
      },
      {
        object: 'block',
        id: 'numbered-child-2-2',
        type: 'numbered_list_item',
        created_time: '2026-01-14T00:00:00.000Z',
        last_edited_time: '2026-01-14T00:00:00.000Z',
        created_by: { object: 'user', id: 'user-1' },
        last_edited_by: { object: 'user', id: 'user-1' },
        has_children: false,
        archived: false,
        in_trash: false,
        parent: { type: 'block_id', block_id: 'numbered-parent-2' },
        numbered_list_item: {
          rich_text: [
            {
              type: 'text',
              text: { content: 'Nested item 2', link: null },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Nested item 2',
              href: null,
            },
          ],
          color: 'default',
        },
      },
    ],
  },
];

// 3. Toggle > Paragraph 중첩
export const toggleWithParagraphFixture: ToggleBlock[] = [
  {
    object: 'block',
    id: 'toggle-1',
    type: 'toggle',
    created_time: '2026-01-14T00:00:00.000Z',
    last_edited_time: '2026-01-14T00:00:00.000Z',
    created_by: { object: 'user', id: 'user-1' },
    last_edited_by: { object: 'user', id: 'user-1' },
    has_children: true,
    archived: false,
    in_trash: false,
    parent: { type: 'page_id', page_id: 'page-1' },
    toggle: {
      rich_text: [
        {
          type: 'text',
          text: { content: 'Click to expand', link: null },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          plain_text: 'Click to expand',
          href: null,
        },
      ],
      color: 'default',
    },
    children: [
      {
        object: 'block',
        id: 'toggle-paragraph-1',
        type: 'paragraph',
        created_time: '2026-01-14T00:00:00.000Z',
        last_edited_time: '2026-01-14T00:00:00.000Z',
        created_by: { object: 'user', id: 'user-1' },
        last_edited_by: { object: 'user', id: 'user-1' },
        has_children: false,
        archived: false,
        in_trash: false,
        parent: { type: 'block_id', block_id: 'toggle-1' },
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: { content: 'Hidden paragraph content', link: null },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Hidden paragraph content',
              href: null,
            },
          ],
          color: 'default',
        },
      },
    ],
  },
];

// 4. Toggle > BulletedList 중첩
export const toggleWithBulletedListFixture: ToggleBlock[] = [
  {
    object: 'block',
    id: 'toggle-2',
    type: 'toggle',
    created_time: '2026-01-14T00:00:00.000Z',
    last_edited_time: '2026-01-14T00:00:00.000Z',
    created_by: { object: 'user', id: 'user-1' },
    last_edited_by: { object: 'user', id: 'user-1' },
    has_children: true,
    archived: false,
    in_trash: false,
    parent: { type: 'page_id', page_id: 'page-1' },
    toggle: {
      rich_text: [
        {
          type: 'text',
          text: { content: 'Toggle with list', link: null },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          plain_text: 'Toggle with list',
          href: null,
        },
      ],
      color: 'default',
    },
    children: [
      {
        object: 'block',
        id: 'toggle-bullet-1',
        type: 'bulleted_list_item',
        created_time: '2026-01-14T00:00:00.000Z',
        last_edited_time: '2026-01-14T00:00:00.000Z',
        created_by: { object: 'user', id: 'user-1' },
        last_edited_by: { object: 'user', id: 'user-1' },
        has_children: false,
        archived: false,
        in_trash: false,
        parent: { type: 'block_id', block_id: 'toggle-2' },
        bulleted_list_item: {
          rich_text: [
            {
              type: 'text',
              text: { content: 'Bullet item 1', link: null },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Bullet item 1',
              href: null,
            },
          ],
          color: 'default',
        },
      },
      {
        object: 'block',
        id: 'toggle-bullet-2',
        type: 'bulleted_list_item',
        created_time: '2026-01-14T00:00:00.000Z',
        last_edited_time: '2026-01-14T00:00:00.000Z',
        created_by: { object: 'user', id: 'user-1' },
        last_edited_by: { object: 'user', id: 'user-1' },
        has_children: false,
        archived: false,
        in_trash: false,
        parent: { type: 'block_id', block_id: 'toggle-2' },
        bulleted_list_item: {
          rich_text: [
            {
              type: 'text',
              text: { content: 'Bullet item 2', link: null },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Bullet item 2',
              href: null,
            },
          ],
          color: 'default',
        },
      },
    ],
  },
];

// 5. Toggle > Code 중첩
export const toggleWithCodeFixture: ToggleBlock[] = [
  {
    object: 'block',
    id: 'toggle-3',
    type: 'toggle',
    created_time: '2026-01-14T00:00:00.000Z',
    last_edited_time: '2026-01-14T00:00:00.000Z',
    created_by: { object: 'user', id: 'user-1' },
    last_edited_by: { object: 'user', id: 'user-1' },
    has_children: true,
    archived: false,
    in_trash: false,
    parent: { type: 'page_id', page_id: 'page-1' },
    toggle: {
      rich_text: [
        {
          type: 'text',
          text: { content: 'Toggle with code', link: null },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          plain_text: 'Toggle with code',
          href: null,
        },
      ],
      color: 'default',
    },
    children: [
      {
        object: 'block',
        id: 'toggle-code-1',
        type: 'code',
        created_time: '2026-01-14T00:00:00.000Z',
        last_edited_time: '2026-01-14T00:00:00.000Z',
        created_by: { object: 'user', id: 'user-1' },
        last_edited_by: { object: 'user', id: 'user-1' },
        has_children: false,
        archived: false,
        in_trash: false,
        parent: { type: 'block_id', block_id: 'toggle-3' },
        code: {
          rich_text: [
            {
              type: 'text',
              text: { content: 'console.log("Hello World");', link: null },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'console.log("Hello World");',
              href: null,
            },
          ],
          language: 'javascript',
          caption: [],
        },
      },
    ],
  },
];

// 6. Callout > Paragraph 중첩
export const calloutWithParagraphFixture: CalloutBlock[] = [
  {
    object: 'block',
    id: 'callout-1',
    type: 'callout',
    created_time: '2026-01-14T00:00:00.000Z',
    last_edited_time: '2026-01-14T00:00:00.000Z',
    created_by: { object: 'user', id: 'user-1' },
    last_edited_by: { object: 'user', id: 'user-1' },
    has_children: true,
    archived: false,
    in_trash: false,
    parent: { type: 'page_id', page_id: 'page-1' },
    callout: {
      rich_text: [
        {
          type: 'text',
          text: { content: 'Important information', link: null },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          plain_text: 'Important information',
          href: null,
        },
      ],
      icon: { emoji: '💡' },
      color: 'blue_background',
    },
    children: [
      {
        object: 'block',
        id: 'callout-paragraph-1',
        type: 'paragraph',
        created_time: '2026-01-14T00:00:00.000Z',
        last_edited_time: '2026-01-14T00:00:00.000Z',
        created_by: { object: 'user', id: 'user-1' },
        last_edited_by: { object: 'user', id: 'user-1' },
        has_children: false,
        archived: false,
        in_trash: false,
        parent: { type: 'block_id', block_id: 'callout-1' },
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: { content: 'Details about the callout', link: null },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Details about the callout',
              href: null,
            },
          ],
          color: 'default',
        },
      },
    ],
  },
];

// 7. Callout > BulletedList 중첩
export const calloutWithBulletedListFixture: CalloutBlock[] = [
  {
    object: 'block',
    id: 'callout-2',
    type: 'callout',
    created_time: '2026-01-14T00:00:00.000Z',
    last_edited_time: '2026-01-14T00:00:00.000Z',
    created_by: { object: 'user', id: 'user-1' },
    last_edited_by: { object: 'user', id: 'user-1' },
    has_children: true,
    archived: false,
    in_trash: false,
    parent: { type: 'page_id', page_id: 'page-1' },
    callout: {
      rich_text: [
        {
          type: 'text',
          text: { content: 'Key points', link: null },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          plain_text: 'Key points',
          href: null,
        },
      ],
      icon: { emoji: '📝' },
      color: 'yellow_background',
    },
    children: [
      {
        object: 'block',
        id: 'callout-bullet-1',
        type: 'bulleted_list_item',
        created_time: '2026-01-14T00:00:00.000Z',
        last_edited_time: '2026-01-14T00:00:00.000Z',
        created_by: { object: 'user', id: 'user-1' },
        last_edited_by: { object: 'user', id: 'user-1' },
        has_children: false,
        archived: false,
        in_trash: false,
        parent: { type: 'block_id', block_id: 'callout-2' },
        bulleted_list_item: {
          rich_text: [
            {
              type: 'text',
              text: { content: 'Point 1', link: null },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Point 1',
              href: null,
            },
          ],
          color: 'default',
        },
      },
      {
        object: 'block',
        id: 'callout-bullet-2',
        type: 'bulleted_list_item',
        created_time: '2026-01-14T00:00:00.000Z',
        last_edited_time: '2026-01-14T00:00:00.000Z',
        created_by: { object: 'user', id: 'user-1' },
        last_edited_by: { object: 'user', id: 'user-1' },
        has_children: false,
        archived: false,
        in_trash: false,
        parent: { type: 'block_id', block_id: 'callout-2' },
        bulleted_list_item: {
          rich_text: [
            {
              type: 'text',
              text: { content: 'Point 2', link: null },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Point 2',
              href: null,
            },
          ],
          color: 'default',
        },
      },
    ],
  },
];
