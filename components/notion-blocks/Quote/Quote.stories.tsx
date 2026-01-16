import type { Meta, StoryObj } from '@storybook/nextjs';
import { Quote } from './Quote';
import {
  createQuoteBlock,
  createRichText,
  combineRichText,
} from '../__integration__/fixtures';

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
    block: createQuoteBlock(
      createRichText('The only way to do great work is to love what you do.'),
    ),
  },
};

export const WithAuthor: Story = {
  args: {
    block: createQuoteBlock(
      combineRichText(
        createRichText('Stay hungry, stay foolish. '),
        createRichText('— Steve Jobs', { bold: true }),
      ),
    ),
  },
};

export const LongQuote: Story = {
  name: 'Long Multi-line Quote',
  args: {
    block: createQuoteBlock(
      createRichText(
        'In the long history of humankind (and animal kind, too) those who learned to collaborate and improvise most effectively have prevailed. The future depends on what we do in the present.',
      ),
    ),
  },
};

export const WithItalic: Story = {
  args: {
    block: createQuoteBlock(
      createRichText('Innovation distinguishes between a leader and a follower.', {
        italic: true,
      }),
    ),
  },
};

export const WithMultipleStyles: Story = {
  name: 'Multiple Text Styles',
  args: {
    block: createQuoteBlock(
      combineRichText(
        createRichText('Code is like humor. ', { italic: true }),
        createRichText('When you have to explain it, its bad.', { bold: true }),
      ),
    ),
  },
};

export const WithLink: Story = {
  args: {
    block: createQuoteBlock(
      combineRichText(
        createRichText('Read more about design systems at '),
        createRichText('our documentation', { link: 'https://example.com/docs' }),
        createRichText('.'),
      ),
    ),
  },
};

export const WithColor: Story = {
  args: {
    block: createQuoteBlock(
      createRichText('This is a gray background quote.'),
      'gray_background',
    ),
  },
};

export const ColorVariants: Story = {
  name: 'Different Background Colors',
  args: {
    block: createQuoteBlock(createRichText('Gray background quote'), 'gray_background'),
  },
  render: () => (
    <div className="space-y-4">
      <Quote
        block={createQuoteBlock(createRichText('Gray background quote'), 'gray_background')}
      />
      <Quote
        block={createQuoteBlock(createRichText('Blue background quote'), 'blue_background')}
      />
      <Quote
        block={createQuoteBlock(
          createRichText('Yellow background quote'),
          'yellow_background',
        )}
      />
      <Quote
        block={createQuoteBlock(createRichText('Green background quote'), 'green_background')}
      />
    </div>
  ),
};

export const Empty: Story = {
  args: {
    block: createQuoteBlock([]),
  },
};

export const MultipleQuotes: Story = {
  name: 'Multiple Quotes in Sequence',
  args: {
    block: createQuoteBlock(createRichText('Simplicity is the ultimate sophistication.')),
  },
  render: () => (
    <div className="space-y-4">
      <Quote
        block={createQuoteBlock(createRichText('Simplicity is the ultimate sophistication.'))}
      />
      <Quote
        block={createQuoteBlock(
          combineRichText(
            createRichText('Design is not just what it looks like and feels like. '),
            createRichText('Design is how it works.', { bold: true }),
          ),
        )}
      />
      <Quote
        block={createQuoteBlock(
          createRichText('Good design is obvious. Great design is transparent.'),
        )}
      />
    </div>
  ),
};
