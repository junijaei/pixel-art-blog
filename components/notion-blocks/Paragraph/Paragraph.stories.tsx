import type { Meta, StoryObj } from '@storybook/nextjs';
import { combineRichText, createParagraphBlock, createRichText } from '../__integration__/fixtures';
import { Paragraph } from './Paragraph';

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
    block: createParagraphBlock(createRichText('const greeting = "Hello World";', { code: true })),
  },
};

export const WithLink: Story = {
  args: {
    block: createParagraphBlock(
      combineRichText(
        createRichText('Visit our '),
        createRichText('website', { link: 'https://example.com' }),
        createRichText(' for more information.')
      )
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
        createRichText(' styles.')
      )
    ),
  },
};

export const WithColor: Story = {
  args: {
    block: createParagraphBlock(createRichText('This paragraph has a blue color.', { color: 'blue' }), 'blue'),
  },
  render: () => (
    <div className="space-y-1">
      <Paragraph
        block={createParagraphBlock(createRichText('This paragraph has a gray color.', { color: 'gray' }), 'gray')}
      />
      <Paragraph
        block={createParagraphBlock(createRichText('This paragraph has a brown color.', { color: 'brown' }), 'brown')}
      />
      <Paragraph
        block={createParagraphBlock(
          createRichText('This paragraph has a orange color.', { color: 'orange' }),
          'orange'
        )}
      />
      <Paragraph
        block={createParagraphBlock(
          createRichText('This paragraph has a yellow color.', { color: 'yellow' }),
          'yellow'
        )}
      />
      <Paragraph
        block={createParagraphBlock(createRichText('This paragraph has a green color.', { color: 'green' }), 'green')}
      />
      <Paragraph
        block={createParagraphBlock(createRichText('This paragraph has a blue color.', { color: 'blue' }), 'blue')}
      />
      <Paragraph
        block={createParagraphBlock(
          createRichText('This paragraph has a purple color.', { color: 'purple' }),
          'purple'
        )}
      />
      <Paragraph
        block={createParagraphBlock(createRichText('This paragraph has a pink color.', { color: 'pink' }), 'pink')}
      />
      <Paragraph
        block={createParagraphBlock(createRichText('This paragraph has a red color.', { color: 'red' }), 'red')}
      />
      <Paragraph
        block={createParagraphBlock(
          createRichText('This paragraph has a gray background color.', { color: 'gray_background' }),
          'gray_background'
        )}
      />
      <Paragraph
        block={createParagraphBlock(
          createRichText('This paragraph has a brown background color.', { color: 'brown_background' }),
          'brown_background'
        )}
      />
      <Paragraph
        block={createParagraphBlock(
          createRichText('This paragraph has a orange background color.', { color: 'orange_background' }),
          'orange_background'
        )}
      />
      <Paragraph
        block={createParagraphBlock(
          createRichText('This paragraph has a yellow background color.', { color: 'yellow_background' }),
          'yellow_background'
        )}
      />
      <Paragraph
        block={createParagraphBlock(
          createRichText('This paragraph has a green background color.', { color: 'green_background' }),
          'green_background'
        )}
      />
      <Paragraph
        block={createParagraphBlock(
          createRichText('This paragraph has a blue background color.', { color: 'blue_background' }),
          'blue_background'
        )}
      />
      <Paragraph
        block={createParagraphBlock(
          createRichText('This paragraph has a purple background color.', { color: 'purple_background' }),
          'purple_background'
        )}
      />
      <Paragraph
        block={createParagraphBlock(
          createRichText('This paragraph has a pink background color.', { color: 'pink_background' }),
          'pink_background'
        )}
      />
      <Paragraph
        block={createParagraphBlock(
          createRichText('This paragraph has a red background color.', { color: 'red_background' }),
          'red_background'
        )}
      />
    </div>
  ),
};

export const Empty: Story = {
  args: {
    block: createParagraphBlock([]),
  },
};
