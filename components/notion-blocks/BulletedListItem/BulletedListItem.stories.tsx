import type { Meta, StoryObj } from '@storybook/nextjs';
import { BulletedListItem } from './BulletedListItem';
import {
  createBulletedListBlock,
  createRichText,
  combineRichText,
} from '../__integration__/fixtures';

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

export const Default: Story = {
  args: {
    block: createBulletedListBlock(createRichText('This is a bulleted list item')),
  },
};

export const WithBold: Story = {
  args: {
    block: createBulletedListBlock(createRichText('Bold list item', { bold: true })),
  },
};

export const WithLink: Story = {
  args: {
    block: createBulletedListBlock(
      combineRichText(
        createRichText('Check out '),
        createRichText('this link', { link: 'https://example.com' }),
      ),
    ),
  },
};

export const WithColor: Story = {
  args: {
    block: createBulletedListBlock(
      createRichText('Blue colored list item', { color: 'blue' }),
      'blue',
    ),
  },
};

export const MultipleItems: Story = {
  args: {
    block: createBulletedListBlock(createRichText('First item')),
  },
  decorators: [],
  render: () => (
    <ul>
      <BulletedListItem
        block={createBulletedListBlock(createRichText('First item'), 'default', { id: 'bullet-1' })}
      />
      <BulletedListItem
        block={createBulletedListBlock(createRichText('Second item'), 'default', { id: 'bullet-2' })}
      />
      <BulletedListItem
        block={createBulletedListBlock(createRichText('Third item'), 'default', { id: 'bullet-3' })}
      />
    </ul>
  ),
};

export const NestedList: Story = {
  args: {
    block: createBulletedListBlock(createRichText('Parent item'), 'default', {
      id: 'parent',
      has_children: true,
    }),
    children: (
      <>
        <BulletedListItem
          block={createBulletedListBlock(createRichText('Nested item 1'), 'default', { id: 'nested-1' })}
        />
        <BulletedListItem
          block={createBulletedListBlock(createRichText('Nested item 2'), 'default', { id: 'nested-2' })}
        />
      </>
    ),
  },
};
