import type { Meta, StoryObj } from '@storybook/react';
import { BulletedListItem } from './BulletedListItem';
import type { BulletedListItemBlock } from './types';

const meta = {
  title: 'Notion Blocks/BulletedListItem',
  component: BulletedListItem,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ul>
        <Story />
      </ul>
    ),
  ],
} satisfies Meta<typeof BulletedListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 불릿 리스트 아이템
 */
export const Default: Story = {
  args: {
    block: {
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: [
          {
            type: 'text',
            text: { content: 'This is a bulleted list item', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'This is a bulleted list item',
            href: null,
          },
        ],
        color: 'default',
        children: [],
      },
      has_children: false,
    } as BulletedListItemBlock,
  },
};

/**
 * Bold 스타일 아이템
 */
export const WithBold: Story = {
  args: {
    block: {
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: [
          {
            type: 'text',
            text: { content: 'Bold list item', link: null },
            annotations: {
              bold: true,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'Bold list item',
            href: null,
          },
        ],
        color: 'default',
        children: [],
      },
      has_children: false,
    } as BulletedListItemBlock,
  },
};

/**
 * 링크가 포함된 아이템
 */
export const WithLink: Story = {
  args: {
    block: {
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: [
          {
            type: 'text',
            text: { content: 'Check out ', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'Check out ',
            href: null,
          },
          {
            type: 'text',
            text: { content: 'this link', link: { url: 'https://example.com' } },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'this link',
            href: 'https://example.com',
          },
        ],
        color: 'default',
        children: [],
      },
      has_children: false,
    } as BulletedListItemBlock,
  },
};

/**
 * 색상이 적용된 아이템
 */
export const WithColor: Story = {
  args: {
    block: {
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: [
          {
            type: 'text',
            text: { content: 'Blue colored list item', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'blue',
            },
            plain_text: 'Blue colored list item',
            href: null,
          },
        ],
        color: 'blue',
        children: [],
      },
      has_children: false,
    } as BulletedListItemBlock,
  },
};

/**
 * 여러 아이템이 있는 리스트
 */
export const MultipleItems: Story = {
  render: () => (
    <ul>
      <BulletedListItem
        block={
          {
            type: 'bulleted_list_item',
            bulleted_list_item: {
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
              children: [],
            },
            has_children: false,
          } as BulletedListItemBlock
        }
      />
      <BulletedListItem
        block={
          {
            type: 'bulleted_list_item',
            bulleted_list_item: {
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
              children: [],
            },
            has_children: false,
          } as BulletedListItemBlock
        }
      />
      <BulletedListItem
        block={
          {
            type: 'bulleted_list_item',
            bulleted_list_item: {
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
              children: [],
            },
            has_children: false,
          } as BulletedListItemBlock
        }
      />
    </ul>
  ),
};

/**
 * 중첩된 리스트 (Nested List)
 */
export const NestedList: Story = {
  render: () => (
    <ul>
      <BulletedListItem
        block={
          {
            type: 'bulleted_list_item',
            bulleted_list_item: {
              rich_text: [
                {
                  type: 'text',
                  text: { content: 'Parent item', link: null },
                  annotations: {
                    bold: false,
                    italic: false,
                    strikethrough: false,
                    underline: false,
                    code: false,
                    color: 'default',
                  },
                  plain_text: 'Parent item',
                  href: null,
                },
              ],
              color: 'default',
              children: [],
            },
            has_children: true,
          } as BulletedListItemBlock
        }
      >
        <BulletedListItem
          block={
            {
              type: 'bulleted_list_item',
              bulleted_list_item: {
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
                children: [],
              },
              has_children: false,
            } as BulletedListItemBlock
          }
        />
        <BulletedListItem
          block={
            {
              type: 'bulleted_list_item',
              bulleted_list_item: {
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
                children: [],
              },
              has_children: false,
            } as BulletedListItemBlock
          }
        />
      </BulletedListItem>
    </ul>
  ),
};
