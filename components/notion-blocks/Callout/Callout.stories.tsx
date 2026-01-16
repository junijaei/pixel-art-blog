import type { Meta, StoryObj } from '@storybook/nextjs';
import { Callout } from './Callout';
import {
  createCalloutBlock,
  createRichText,
  combineRichText,
} from '../__integration__/fixtures';

const meta = {
  title: 'Notion Blocks/Callout',
  component: Callout,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Callout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    block: createCalloutBlock(
      combineRichText(
        createRichText('This is an important callout message. '),
        createRichText('Pay attention!', { bold: true }),
      ),
    ),
  },
};

export const WithEmojiIcon: Story = {
  args: {
    block: createCalloutBlock(
      combineRichText(
        createRichText('This is an important callout message. '),
        createRichText('Pay attention!', { bold: true }),
      ),
      { emoji: '💡' },
    ),
  },
};

export const WithDifferentEmojis: Story = {
  args: {
    block: createCalloutBlock(createRichText('Information callout'), { emoji: 'ℹ️' }),
  },
  render: () => (
    <div className="space-y-4">
      <Callout
        block={createCalloutBlock(createRichText('Information callout'), { emoji: 'ℹ️' })}
      />
      <Callout
        block={createCalloutBlock(
          createRichText('Warning callout'),
          { emoji: '⚠️' },
          'orange',
        )}
      />
      <Callout
        block={createCalloutBlock(createRichText('Success callout'), { emoji: '✅' }, 'green')}
      />
    </div>
  ),
};

export const ColorVariants: Story = {
  args: {
    block: createCalloutBlock(createRichText('Gray background'), { emoji: '📝' }, 'gray_background'),
  },
  render: () => (
    <div className="space-y-4">
      <Callout
        block={createCalloutBlock(
          createRichText('Gray background'),
          { emoji: '📝' },
          'gray_background',
        )}
      />
      <Callout
        block={createCalloutBlock(
          createRichText('Blue background'),
          { emoji: '💙' },
          'blue_background',
        )}
      />
      <Callout
        block={createCalloutBlock(
          createRichText('Yellow background'),
          { emoji: '💛' },
          'yellow_background',
        )}
      />
    </div>
  ),
};

export const WithChildren: Story = {
  args: {
    block: createCalloutBlock(
      createRichText('Parent callout with nested content'),
      { emoji: '📦' },
      'default',
      { has_children: true },
    ),
    children: (
      <div className="text-muted-foreground space-y-2 text-sm">
        <p>• Nested item 1</p>
        <p>• Nested item 2</p>
        <p>• Nested item 3</p>
      </div>
    ),
  },
};
