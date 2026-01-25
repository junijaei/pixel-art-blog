import { NumberedListItem } from '@/components/notion-blocks/NumberedListItem/NumberedListItem';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { combineRichText, createNumberedListBlock, createRichText } from '../__integration__/fixtures';

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
    block: createNumberedListBlock(createRichText('This is a numbered list item')),
    index: 0,
  },
};

export const WithBold: Story = {
  args: {
    block: createNumberedListBlock(createRichText('Bold numbered item', { bold: true })),
    index: 0,
  },
};

export const WithLink: Story = {
  args: {
    block: createNumberedListBlock(
      combineRichText(createRichText('Check out '), createRichText('this link', { link: 'https://example.com' }))
    ),
    index: 0,
  },
};

export const WithColor: Story = {
  args: {
    block: createNumberedListBlock(createRichText('Blue colored item', { color: 'blue' }), 'blue'),
    index: 0,
  },
};

export const MultipleItems: Story = {
  args: {
    block: createNumberedListBlock(createRichText('First step')),
    index: 0,
  },
  decorators: [],
  render: () => (
    <ol>
      <NumberedListItem
        block={createNumberedListBlock(createRichText('First step'), 'default', { id: 'num-1' })}
        index={0}
      />
      <NumberedListItem
        block={createNumberedListBlock(createRichText('Second step'), 'default', { id: 'num-2' })}
        index={1}
      />
      <NumberedListItem
        block={createNumberedListBlock(createRichText('Third step'), 'default', { id: 'num-3' })}
        index={2}
      />
      <NumberedListItem
        block={createNumberedListBlock(createRichText('Forth step'), 'default', { id: 'num-3' })}
        index={3}
      />
      <NumberedListItem
        block={createNumberedListBlock(createRichText('Fifth step'), 'default', { id: 'num-3' })}
        index={4}
      />
      <NumberedListItem
        block={createNumberedListBlock(createRichText('Sixth step'), 'default', { id: 'num-3' })}
        index={5}
      />
      <NumberedListItem
        block={createNumberedListBlock(createRichText('Seventh step'), 'default', { id: 'num-3' })}
        index={6}
      />
    </ol>
  ),
};

export const NestedList: Story = {
  args: {
    block: createNumberedListBlock(createRichText('Parent item'), 'default', {
      id: 'parent',
      has_children: true,
    }),
    index: 0,
    children: (
      <ol>
        <NumberedListItem
          block={createNumberedListBlock(createRichText('Nested item 1'), 'default', { id: 'nested-1' })}
          index={0}
        />
        <NumberedListItem
          block={createNumberedListBlock(createRichText('Nested item 2'), 'default', { id: 'nested-2' })}
          index={1}
        />
      </ol>
    ),
  },
};
