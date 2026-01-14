import type { Meta, StoryObj } from '@storybook/react';
import { NumberedListItem } from './NumberedListItem';
import type { NumberedListItemBlock } from './types';

const meta = {
  title: 'Notion Blocks/NumberedListItem',
  component: NumberedListItem,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ol>
        <Story />
      </ol>
    ),
  ],
} satisfies Meta<typeof NumberedListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    block: {
      type: 'numbered_list_item',
      numbered_list_item: {
        rich_text: [
          {
            type: 'text',
            text: { content: 'This is a numbered list item', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'This is a numbered list item',
            href: null,
          },
        ],
        color: 'default',
        children: [],
      },
      has_children: false,
    } as NumberedListItemBlock,
  },
};

export const MultipleItems: Story = {
  render: () => (
    <ol>
      <NumberedListItem
        block={
          {
            type: 'numbered_list_item',
            numbered_list_item: {
              rich_text: [
                {
                  type: 'text',
                  text: { content: 'First step', link: null },
                  annotations: {
                    bold: false,
                    italic: false,
                    strikethrough: false,
                    underline: false,
                    code: false,
                    color: 'default',
                  },
                  plain_text: 'First step',
                  href: null,
                },
              ],
              color: 'default',
              children: [],
            },
            has_children: false,
          } as NumberedListItemBlock
        }
      />
      <NumberedListItem
        block={
          {
            type: 'numbered_list_item',
            numbered_list_item: {
              rich_text: [
                {
                  type: 'text',
                  text: { content: 'Second step', link: null },
                  annotations: {
                    bold: false,
                    italic: false,
                    strikethrough: false,
                    underline: false,
                    code: false,
                    color: 'default',
                  },
                  plain_text: 'Second step',
                  href: null,
                },
              ],
              color: 'default',
              children: [],
            },
            has_children: false,
          } as NumberedListItemBlock
        }
      />
      <NumberedListItem
        block={
          {
            type: 'numbered_list_item',
            numbered_list_item: {
              rich_text: [
                {
                  type: 'text',
                  text: { content: 'Third step', link: null },
                  annotations: {
                    bold: false,
                    italic: false,
                    strikethrough: false,
                    underline: false,
                    code: false,
                    color: 'default',
                  },
                  plain_text: 'Third step',
                  href: null,
                },
              ],
              color: 'default',
              children: [],
            },
            has_children: false,
          } as NumberedListItemBlock
        }
      />
    </ol>
  ),
};
