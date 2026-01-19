import type { Meta, StoryObj } from '@storybook/nextjs';
import { Heading } from './Heading';
import { createHeadingBlock, createRichText, combineRichText } from '../__integration__/fixtures';

const meta = {
  title: 'Notion Blocks/Heading',
  component: Heading,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Heading1: Story = {
  args: {
    block: createHeadingBlock(1, createRichText('This is a Heading 1')),
  },
};

export const Heading2: Story = {
  args: {
    block: createHeadingBlock(2, createRichText('This is a Heading 2')),
  },
};

export const Heading3: Story = {
  args: {
    block: createHeadingBlock(3, createRichText('This is a Heading 3')),
  },
};

export const WithBold: Story = {
  args: {
    block: createHeadingBlock(2, createRichText('Bold Heading', { bold: true })),
  },
};

export const WithItalic: Story = {
  args: {
    block: createHeadingBlock(2, createRichText('Italic Heading', { italic: true })),
  },
};

export const WithColor: Story = {
  args: {
    block: createHeadingBlock(2, createRichText('Blue Colored Heading', { color: 'blue' }), 'blue'),
  },
};

export const WithMultipleStyles: Story = {
  args: {
    block: createHeadingBlock(
      2,
      combineRichText(
        createRichText('This heading has '),
        createRichText('bold', { bold: true }),
        createRichText(' and '),
        createRichText('italic', { italic: true }),
        createRichText(' styles')
      )
    ),
  },
};

export const AllLevels: Story = {
  args: {
    block: createHeadingBlock(1, createRichText('Heading 1 - text-4xl')),
  },
  render: () => (
    <div className="space-y-4">
      <Heading block={createHeadingBlock(1, createRichText('Heading 1 - text-4xl'))} />
      <Heading block={createHeadingBlock(2, createRichText('Heading 2 - text-3xl'))} />
      <Heading block={createHeadingBlock(3, createRichText('Heading 3 - text-2xl'))} />
    </div>
  ),
};
