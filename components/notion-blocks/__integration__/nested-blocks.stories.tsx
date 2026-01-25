import {
  calloutWithBulletedListFixture,
  calloutWithParagraphFixture,
  nestedBulletedListFixture,
  nestedNumberedListFixture,
  toggleWithBulletedListFixture,
  toggleWithCodeFixture,
  toggleWithParagraphFixture,
} from '@/components/notion-blocks/__integration__/fixtures/simple-nested';
import type { Block } from '@/types/notion';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { BlockRenderer } from '../BlockRenderer';

const meta = {
  title: 'Integration/Nested Blocks',
  component: BlockRenderer,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BlockRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Phase 1: 기본 중첩 시나리오
 */

// 1. BulletedList Nesting
export const BulletedListNested: Story = {
  name: 'Bulleted List - 2 Depth',
  args: {
    blocks: nestedBulletedListFixture,
  },
};

export const BulletedList3Depth: Story = {
  name: 'Bulleted List - 3 Depth',
  args: {
    blocks: [
      {
        ...nestedBulletedListFixture[0],
        children: [
          {
            ...nestedBulletedListFixture[0].children![0],
            has_children: true,
            children: [
              {
                object: 'block',
                id: 'bulleted-grandchild-1',
                type: 'bulleted_list_item',
                created_time: '2026-01-14T00:00:00.000Z',
                last_edited_time: '2026-01-14T00:00:00.000Z',
                created_by: { object: 'user', id: 'user-1' },
                last_edited_by: { object: 'user', id: 'user-1' },
                has_children: false,
                archived: false,
                in_trash: false,
                parent: { type: 'block_id', block_id: 'bulleted-child-1-1' },
                bulleted_list_item: {
                  rich_text: [
                    {
                      type: 'text',
                      text: { content: 'Grandchild item 1', link: null },
                      annotations: {
                        bold: false,
                        italic: false,
                        strikethrough: false,
                        underline: false,
                        code: false,
                        color: 'default',
                      },
                      plain_text: 'Grandchild item 1',
                      href: null,
                    },
                  ],
                  color: 'default',
                },
              },
            ],
          },
          nestedBulletedListFixture[0].children![1],
        ],
      },
    ] as Block[],
  },
};

// 2. NumberedList Nesting
export const NumberedListNested: Story = {
  name: 'Numbered List - 2 Depth',
  args: {
    blocks: nestedNumberedListFixture,
  },
};

export const NumberedList3Items: Story = {
  name: 'Numbered List - 3 Items with Nested',
  args: {
    blocks: [
      ...nestedNumberedListFixture,
      {
        object: 'block',
        id: 'numbered-parent-3',
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
              text: { content: 'Third item', link: null },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Third item',
              href: null,
            },
          ],
          color: 'default',
        },
      },
    ] as Block[],
  },
};

// 3. Toggle Nesting
export const ToggleWithParagraph: Story = {
  name: 'Toggle with Paragraph',
  args: {
    blocks: toggleWithParagraphFixture,
  },
};

export const ToggleWithBulletedList: Story = {
  name: 'Toggle with Bulleted List',
  args: {
    blocks: toggleWithBulletedListFixture,
  },
};

export const ToggleWithCode: Story = {
  name: 'Toggle with Code',
  args: {
    blocks: toggleWithCodeFixture,
  },
};

export const MultipleToggles: Story = {
  name: 'Multiple Toggles',
  args: {
    blocks: [...toggleWithParagraphFixture, ...toggleWithBulletedListFixture, ...toggleWithCodeFixture] as Block[],
  },
};

// 4. Callout Nesting
export const CalloutWithParagraph: Story = {
  name: 'Callout with Paragraph',
  args: {
    blocks: calloutWithParagraphFixture,
  },
};

export const CalloutWithBulletedList: Story = {
  name: 'Callout with Bulleted List',
  args: {
    blocks: calloutWithBulletedListFixture,
  },
};

export const CalloutWithColorVariants: Story = {
  name: 'Callout - Color Variants',
  args: {
    blocks: [
      calloutWithParagraphFixture[0],
      {
        ...calloutWithParagraphFixture[0],
        id: 'callout-yellow',
        callout: {
          ...calloutWithParagraphFixture[0].callout,
          rich_text: [
            {
              type: 'text',
              text: { content: 'Yellow background callout', link: null },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Yellow background callout',
              href: null,
            },
          ],
          icon: { emoji: '⚠️' },
          color: 'yellow_background',
        },
      },
      {
        ...calloutWithParagraphFixture[0],
        id: 'callout-red',
        callout: {
          ...calloutWithParagraphFixture[0].callout,
          rich_text: [
            {
              type: 'text',
              text: { content: 'Red background callout', link: null },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Red background callout',
              href: null,
            },
          ],
          icon: { emoji: '🚨' },
          color: 'red_background',
        },
      },
    ] as Block[],
  },
};

// 5. Mixed Nesting
export const MixedBulletedAndNumbered: Story = {
  name: 'Mixed - Bulleted → Numbered',
  args: {
    blocks: [
      {
        ...nestedBulletedListFixture[0],
        children: [
          {
            ...nestedNumberedListFixture[0],
            id: 'mixed-numbered-1',
            parent: { type: 'block_id', block_id: nestedBulletedListFixture[0].id },
          },
          {
            ...nestedNumberedListFixture[1],
            id: 'mixed-numbered-2',
            parent: { type: 'block_id', block_id: nestedBulletedListFixture[0].id },
            has_children: false,
            children: undefined,
          },
        ],
      },
    ] as Block[],
  },
};

export const ComplexNestedStructure: Story = {
  name: 'Complex - Callout → Toggle → List',
  args: {
    blocks: [
      {
        object: 'block',
        id: 'callout-complex',
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
                bold: true,
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
            id: 'toggle-in-callout',
            type: 'toggle',
            created_time: '2026-01-14T00:00:00.000Z',
            last_edited_time: '2026-01-14T00:00:00.000Z',
            created_by: { object: 'user', id: 'user-1' },
            last_edited_by: { object: 'user', id: 'user-1' },
            has_children: true,
            archived: false,
            in_trash: false,
            parent: { type: 'block_id', block_id: 'callout-complex' },
            toggle: {
              rich_text: [
                {
                  type: 'text',
                  text: { content: 'Click to see details', link: null },
                  annotations: {
                    bold: false,
                    italic: false,
                    strikethrough: false,
                    underline: false,
                    code: false,
                    color: 'default',
                  },
                  plain_text: 'Click to see details',
                  href: null,
                },
              ],
              color: 'default',
            },
            children: [
              {
                object: 'block',
                id: 'bullet-in-toggle',
                type: 'bulleted_list_item',
                created_time: '2026-01-14T00:00:00.000Z',
                last_edited_time: '2026-01-14T00:00:00.000Z',
                created_by: { object: 'user', id: 'user-1' },
                last_edited_by: { object: 'user', id: 'user-1' },
                has_children: false,
                archived: false,
                in_trash: false,
                parent: { type: 'block_id', block_id: 'toggle-in-callout' },
                bulleted_list_item: {
                  rich_text: [
                    {
                      type: 'text',
                      text: { content: 'Detail point 1', link: null },
                      annotations: {
                        bold: false,
                        italic: false,
                        strikethrough: false,
                        underline: false,
                        code: false,
                        color: 'default',
                      },
                      plain_text: 'Detail point 1',
                      href: null,
                    },
                  ],
                  color: 'default',
                },
              },
              {
                object: 'block',
                id: 'bullet-in-toggle-2',
                type: 'bulleted_list_item',
                created_time: '2026-01-14T00:00:00.000Z',
                last_edited_time: '2026-01-14T00:00:00.000Z',
                created_by: { object: 'user', id: 'user-1' },
                last_edited_by: { object: 'user', id: 'user-1' },
                has_children: false,
                archived: false,
                in_trash: false,
                parent: { type: 'block_id', block_id: 'toggle-in-callout' },
                bulleted_list_item: {
                  rich_text: [
                    {
                      type: 'text',
                      text: { content: 'Detail point 2', link: null },
                      annotations: {
                        bold: false,
                        italic: false,
                        strikethrough: false,
                        underline: false,
                        code: false,
                        color: 'default',
                      },
                      plain_text: 'Detail point 2',
                      href: null,
                    },
                  ],
                  color: 'default',
                },
              },
            ],
          },
        ],
      },
    ] as Block[],
  },
};

// 6. All Block Types Combined
export const AllBlockTypesCombined: Story = {
  name: 'All Block Types - Combined Document',
  args: {
    blocks: [
      {
        object: 'block',
        id: 'heading-1',
        type: 'heading_2',
        created_time: '2026-01-14T00:00:00.000Z',
        last_edited_time: '2026-01-14T00:00:00.000Z',
        created_by: { object: 'user', id: 'user-1' },
        last_edited_by: { object: 'user', id: 'user-1' },
        has_children: false,
        archived: false,
        in_trash: false,
        parent: { type: 'page_id', page_id: 'page-1' },
        heading_2: {
          rich_text: [
            {
              type: 'text',
              text: { content: 'Sample Document', link: null },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Sample Document',
              href: null,
            },
          ],
          color: 'default',
          is_toggleable: false,
        },
      },
      {
        object: 'block',
        id: 'paragraph-1',
        type: 'paragraph',
        created_time: '2026-01-14T00:00:00.000Z',
        last_edited_time: '2026-01-14T00:00:00.000Z',
        created_by: { object: 'user', id: 'user-1' },
        last_edited_by: { object: 'user', id: 'user-1' },
        has_children: false,
        archived: false,
        in_trash: false,
        parent: { type: 'page_id', page_id: 'page-1' },
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: { content: 'This is a sample document with all block types.', link: null },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'This is a sample document with all block types.',
              href: null,
            },
          ],
          color: 'default',
        },
      },
      {
        object: 'block',
        id: 'quote-1',
        type: 'quote',
        created_time: '2026-01-14T00:00:00.000Z',
        last_edited_time: '2026-01-14T00:00:00.000Z',
        created_by: { object: 'user', id: 'user-1' },
        last_edited_by: { object: 'user', id: 'user-1' },
        has_children: false,
        archived: false,
        in_trash: false,
        parent: { type: 'page_id', page_id: 'page-1' },
        quote: {
          rich_text: [
            {
              type: 'text',
              text: { content: 'A wise quote from someone.', link: null },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'A wise quote from someone.',
              href: null,
            },
          ],
          color: 'default',
        },
      },
      calloutWithBulletedListFixture[0],
      toggleWithCodeFixture[0],
      ...nestedNumberedListFixture,
      {
        object: 'block',
        id: 'divider-1',
        type: 'divider',
        created_time: '2026-01-14T00:00:00.000Z',
        last_edited_time: '2026-01-14T00:00:00.000Z',
        created_by: { object: 'user', id: 'user-1' },
        last_edited_by: { object: 'user', id: 'user-1' },
        has_children: false,
        archived: false,
        in_trash: false,
        parent: { type: 'page_id', page_id: 'page-1' },
        divider: {},
      },
    ] as Block[],
  },
};
