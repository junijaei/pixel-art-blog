import type { Meta, StoryObj } from '@storybook/react';
import { Callout } from './Callout';
import type { RichTextItem } from '@/types/notion';

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

const sampleRichText: RichTextItem[] = [
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
  },
];

export const Default: Story = {
  args: {
    richText: sampleRichText,
  },
};

export const WithEmojiIcon: Story = {
  args: {
    richText: sampleRichText,
    icon: { type: 'emoji', emoji: '💡' },
  },
};

export const WithDifferentEmojis: Story = {
  render: () => (
    <div className="space-y-4">
      <Callout
        richText={[
          {
            type: 'text',
            text: { content: 'Information callout', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'Information callout',
          },
        ]}
        icon={{ type: 'emoji', emoji: 'ℹ️' }}
      />
      <Callout
        richText={[
          {
            type: 'text',
            text: { content: 'Warning callout', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'Warning callout',
          },
        ]}
        icon={{ type: 'emoji', emoji: '⚠️' }}
        color="orange"
      />
      <Callout
        richText={[
          {
            type: 'text',
            text: { content: 'Success callout', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'Success callout',
          },
        ]}
        icon={{ type: 'emoji', emoji: '✅' }}
        color="green"
      />
    </div>
  ),
};

export const ColorVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Callout
        richText={[
          {
            type: 'text',
            text: { content: 'Gray background', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'Gray background',
          },
        ]}
        color="gray_background"
        icon={{ type: 'emoji', emoji: '📝' }}
      />
      <Callout
        richText={[
          {
            type: 'text',
            text: { content: 'Blue background', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'Blue background',
          },
        ]}
        color="blue_background"
        icon={{ type: 'emoji', emoji: '💙' }}
      />
      <Callout
        richText={[
          {
            type: 'text',
            text: { content: 'Yellow background', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'Yellow background',
          },
        ]}
        color="yellow_background"
        icon={{ type: 'emoji', emoji: '💛' }}
      />
    </div>
  ),
};

export const WithChildren: Story = {
  args: {
    richText: [
      {
        type: 'text',
        text: { content: 'Parent callout with nested content', link: null },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'Parent callout with nested content',
      },
    ],
    icon: { type: 'emoji', emoji: '📦' },
    has_children: true,
    children: (
      <div className="space-y-2 text-sm text-muted-foreground">
        <p>• Nested item 1</p>
        <p>• Nested item 2</p>
        <p>• Nested item 3</p>
      </div>
    ),
  },
};
