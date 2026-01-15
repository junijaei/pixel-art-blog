import type { NumberedListBlock, RichText } from '@/types/notion';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { NumberedListItem } from './NumberedListItem';

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

const createRichText = (content: string, bold = false): RichText[] => [
  {
    type: 'text',
    text: { content, link: null },
    annotations: {
      bold,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      color: 'default',
    },
    plain_text: content,
    href: null,
  },
];

const createNumberedListBlock = (richText: RichText[], id = 'numbered-1'): NumberedListBlock => ({
  object: 'block',
  id,
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
    rich_text: richText,
    color: 'default',
  },
});

export const Default: Story = {
  args: {
    block: createNumberedListBlock(createRichText('This is a numbered list item')),
    index: 0,
  },
};

export const MultipleItems: Story = {
  args: {
    block: createNumberedListBlock(createRichText(''), 'dummy'),
    index: 0,
  },
  render: () => (
    <ol>
      <NumberedListItem block={createNumberedListBlock(createRichText('First step'), 'num-1')} index={0} />
      <NumberedListItem block={createNumberedListBlock(createRichText('Second step'), 'num-2')} index={1} />
      <NumberedListItem block={createNumberedListBlock(createRichText('Third step'), 'num-3')} index={2} />
    </ol>
  ),
};
