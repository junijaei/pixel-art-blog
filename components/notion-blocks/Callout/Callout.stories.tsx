import type { CalloutBlock, NotionColor, RichText } from '@/types/notion';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { Callout } from './Callout';

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

const createCalloutBlock = (
  richText: RichText[],
  icon: { emoji: string } | null = null,
  color: NotionColor = 'default',
): CalloutBlock => ({
  object: 'block',
  id: 'callout-block-1',
  type: 'callout',
  created_time: '2026-01-14T00:00:00.000Z',
  last_edited_time: '2026-01-14T00:00:00.000Z',
  created_by: { object: 'user', id: 'user-1' },
  last_edited_by: { object: 'user', id: 'user-1' },
  has_children: false,
  archived: false,
  in_trash: false,
  parent: { type: 'page_id', page_id: 'page-1' },
  callout: {
    rich_text: richText,
    icon: icon ? { emoji: icon.emoji } : null,
    color,
  },
});

const sampleRichText: RichText[] = [
  {
    type: 'text',
    text: { content: 'This is an important callout message. ', link: null },
    annotations: {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      color: 'default',
    },
    plain_text: 'This is an important callout message. ',
    href: null,
  },
  {
    type: 'text',
    text: { content: 'Pay attention!', link: null },
    annotations: {
      bold: true,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      color: 'default',
    },
    plain_text: 'Pay attention!',
    href: null,
  },
];

export const Default: Story = {
  args: {
    block: createCalloutBlock(sampleRichText),
  },
};

export const WithEmojiIcon: Story = {
  args: {
    block: createCalloutBlock(sampleRichText, { emoji: '💡' }),
  },
};

export const WithDifferentEmojis: Story = {
  args: {
    block: createCalloutBlock(createRichText(''), null),
  },
  render: () => (
    <div className="space-y-4">
      <Callout block={createCalloutBlock(createRichText('Information callout'), { emoji: 'ℹ️' })} />
      <Callout
        block={createCalloutBlock(createRichText('Warning callout'), { emoji: '⚠️' }, 'orange')}
      />
      <Callout
        block={createCalloutBlock(createRichText('Success callout'), { emoji: '✅' }, 'green')}
      />
    </div>
  ),
};

export const ColorVariants: Story = {
  args: {
    block: createCalloutBlock(createRichText(''), null),
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
    block: {
      ...createCalloutBlock(createRichText('Parent callout with nested content'), { emoji: '📦' }),
      has_children: true,
    },
    children: (
      <div className="text-muted-foreground space-y-2 text-sm">
        <p>• Nested item 1</p>
        <p>• Nested item 2</p>
        <p>• Nested item 3</p>
      </div>
    ),
  },
};
