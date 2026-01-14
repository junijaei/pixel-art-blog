import type { Meta, StoryObj } from '@storybook/react';
import { Paragraph } from './Paragraph';
import type { ParagraphBlock } from './types';

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

/**
 * 기본 텍스트 렌더링
 */
export const Default: Story = {
  args: {
    block: {
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            type: 'text',
            text: { content: 'This is a simple paragraph with plain text.', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'This is a simple paragraph with plain text.',
            href: null,
          },
        ],
        color: 'default',
      },
    } as ParagraphBlock,
  },
};

/**
 * Bold 스타일 텍스트
 */
export const WithBold: Story = {
  args: {
    block: {
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            type: 'text',
            text: { content: 'This text is bold.', link: null },
            annotations: {
              bold: true,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'This text is bold.',
            href: null,
          },
        ],
        color: 'default',
      },
    } as ParagraphBlock,
  },
};

/**
 * Italic 스타일 텍스트
 */
export const WithItalic: Story = {
  args: {
    block: {
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            type: 'text',
            text: { content: 'This text is italic.', link: null },
            annotations: {
              bold: false,
              italic: true,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'This text is italic.',
            href: null,
          },
        ],
        color: 'default',
      },
    } as ParagraphBlock,
  },
};

/**
 * Code 스타일 텍스트
 */
export const WithCode: Story = {
  args: {
    block: {
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            type: 'text',
            text: { content: 'const greeting = "Hello World";', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: true,
              color: 'default',
            },
            plain_text: 'const greeting = "Hello World";',
            href: null,
          },
        ],
        color: 'default',
      },
    } as ParagraphBlock,
  },
};

/**
 * 링크가 포함된 텍스트
 */
export const WithLink: Story = {
  args: {
    block: {
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            type: 'text',
            text: { content: 'Visit our ', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'Visit our ',
            href: null,
          },
          {
            type: 'text',
            text: { content: 'website', link: { url: 'https://example.com' } },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'website',
            href: 'https://example.com',
          },
          {
            type: 'text',
            text: { content: ' for more information.', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: ' for more information.',
            href: null,
          },
        ],
        color: 'default',
      },
    } as ParagraphBlock,
  },
};

/**
 * 여러 스타일이 조합된 텍스트
 */
export const WithMultipleStyles: Story = {
  args: {
    block: {
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            type: 'text',
            text: { content: 'This paragraph contains ', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'This paragraph contains ',
            href: null,
          },
          {
            type: 'text',
            text: { content: 'bold', link: null },
            annotations: {
              bold: true,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'bold',
            href: null,
          },
          {
            type: 'text',
            text: { content: ', ', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: ', ',
            href: null,
          },
          {
            type: 'text',
            text: { content: 'italic', link: null },
            annotations: {
              bold: false,
              italic: true,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'italic',
            href: null,
          },
          {
            type: 'text',
            text: { content: ', and ', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: ', and ',
            href: null,
          },
          {
            type: 'text',
            text: { content: 'code', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: true,
              color: 'default',
            },
            plain_text: 'code',
            href: null,
          },
          {
            type: 'text',
            text: { content: ' styles.', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: ' styles.',
            href: null,
          },
        ],
        color: 'default',
      },
    } as ParagraphBlock,
  },
};

/**
 * 색상이 적용된 텍스트
 */
export const WithColor: Story = {
  args: {
    block: {
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            type: 'text',
            text: { content: 'This paragraph has a blue color.', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'blue',
            },
            plain_text: 'This paragraph has a blue color.',
            href: null,
          },
        ],
        color: 'blue',
      },
    } as ParagraphBlock,
  },
};

/**
 * 빈 텍스트 (empty rich_text array)
 */
export const Empty: Story = {
  args: {
    block: {
      type: 'paragraph',
      paragraph: {
        rich_text: [],
        color: 'default',
      },
    } as ParagraphBlock,
  },
};
