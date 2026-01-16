import type { Meta, StoryObj } from '@storybook/nextjs';
import { Paragraph } from './Paragraph';
import {
  createParagraphBlock,
  createRichText,
  combineRichText,
} from '../__integration__/fixtures';

const meta = {
  title: 'Notion Blocks/Paragraph',
  component: Paragraph,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Paragraph>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    block: createParagraphBlock(createRichText('This is a simple paragraph with plain text.')),
  },
};

export const WithBold: Story = {
  args: {
    block: createParagraphBlock(createRichText('This text is bold.', { bold: true })),
  },
};

export const WithItalic: Story = {
  args: {
    block: createParagraphBlock(createRichText('This text is italic.', { italic: true })),
  },
};

export const WithCode: Story = {
  args: {
    block: createParagraphBlock(
      createRichText('const greeting = "Hello World";', { code: true }),
    ),
  },
};

export const WithLink: Story = {
  args: {
    block: createParagraphBlock(
      combineRichText(
        createRichText('Visit our '),
        createRichText('website', { link: 'https://example.com' }),
        createRichText(' for more information.'),
      ),
    ),
  },
};

export const WithMultipleStyles: Story = {
  args: {
    block: createParagraphBlock(
      combineRichText(
        createRichText('This paragraph contains '),
        createRichText('bold', { bold: true }),
        createRichText(', '),
        createRichText('italic', { italic: true }),
        createRichText(', and '),
        createRichText('code', { code: true }),
        createRichText(' styles.'),
      ),
    ),
  },
};

export const WithColor: Story = {
  args: {
    block: createParagraphBlock(
      createRichText('This paragraph has a blue color.', { color: 'blue' }),
      'blue',
    ),
  },
};

export const Empty: Story = {
  args: {
    block: createParagraphBlock([]),
  },
};
