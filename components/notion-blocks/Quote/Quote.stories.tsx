import type { Meta, StoryObj } from '@storybook/react';
import { Quote } from './Quote';
import type { QuoteBlock } from './types';

const meta = {
  title: 'Notion Blocks/Quote',
  component: Quote,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Quote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    block: {
      type: 'quote',
      quote: {
        rich_text: [
          {
            type: 'text',
            text: {
              content: 'The only way to do great work is to love what you do.',
              link: null,
            },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'The only way to do great work is to love what you do.',
            href: null,
          },
        ],
        color: 'default',
      },
    } as QuoteBlock,
  },
};

export const WithAuthor: Story = {
  args: {
    block: {
      type: 'quote',
      quote: {
        rich_text: [
          {
            type: 'text',
            text: {
              content: 'Stay hungry, stay foolish. ',
              link: null,
            },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'Stay hungry, stay foolish. ',
            href: null,
          },
          {
            type: 'text',
            text: {
              content: '— Steve Jobs',
              link: null,
            },
            annotations: {
              bold: true,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: '— Steve Jobs',
            href: null,
          },
        ],
        color: 'default',
      },
    } as QuoteBlock,
  },
};
