import type { Meta, StoryObj } from '@storybook/react';
import { Heading } from './Heading';
import type { HeadingBlock } from './types';

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

/**
 * Heading 1 (가장 큰 헤딩)
 */
export const Heading1: Story = {
  args: {
    block: {
      type: 'heading_1',
      heading_1: {
        rich_text: [
          {
            type: 'text',
            text: { content: 'This is a Heading 1', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'This is a Heading 1',
            href: null,
          },
        ],
        color: 'default',
      },
    } as HeadingBlock,
  },
};

/**
 * Heading 2 (중간 크기 헤딩)
 */
export const Heading2: Story = {
  args: {
    block: {
      type: 'heading_2',
      heading_2: {
        rich_text: [
          {
            type: 'text',
            text: { content: 'This is a Heading 2', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'This is a Heading 2',
            href: null,
          },
        ],
        color: 'default',
      },
    } as HeadingBlock,
  },
};

/**
 * Heading 3 (작은 헤딩)
 */
export const Heading3: Story = {
  args: {
    block: {
      type: 'heading_3',
      heading_3: {
        rich_text: [
          {
            type: 'text',
            text: { content: 'This is a Heading 3', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'This is a Heading 3',
            href: null,
          },
        ],
        color: 'default',
      },
    } as HeadingBlock,
  },
};

/**
 * Bold 스타일이 적용된 Heading
 */
export const WithBold: Story = {
  args: {
    block: {
      type: 'heading_2',
      heading_2: {
        rich_text: [
          {
            type: 'text',
            text: { content: 'Bold Heading', link: null },
            annotations: {
              bold: true,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'Bold Heading',
            href: null,
          },
        ],
        color: 'default',
      },
    } as HeadingBlock,
  },
};

/**
 * Italic 스타일이 적용된 Heading
 */
export const WithItalic: Story = {
  args: {
    block: {
      type: 'heading_2',
      heading_2: {
        rich_text: [
          {
            type: 'text',
            text: { content: 'Italic Heading', link: null },
            annotations: {
              bold: false,
              italic: true,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'Italic Heading',
            href: null,
          },
        ],
        color: 'default',
      },
    } as HeadingBlock,
  },
};

/**
 * 색상이 적용된 Heading
 */
export const WithColor: Story = {
  args: {
    block: {
      type: 'heading_2',
      heading_2: {
        rich_text: [
          {
            type: 'text',
            text: { content: 'Blue Colored Heading', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'blue',
            },
            plain_text: 'Blue Colored Heading',
            href: null,
          },
        ],
        color: 'blue',
      },
    } as HeadingBlock,
  },
};

/**
 * 여러 스타일이 조합된 Heading
 */
export const WithMultipleStyles: Story = {
  args: {
    block: {
      type: 'heading_2',
      heading_2: {
        rich_text: [
          {
            type: 'text',
            text: { content: 'This heading has ', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'This heading has ',
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
            text: { content: ' and ', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: ' and ',
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
            text: { content: ' styles', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: ' styles',
            href: null,
          },
        ],
        color: 'default',
      },
    } as HeadingBlock,
  },
};

/**
 * 모든 헤딩 레벨 비교
 */
export const AllLevels: Story = {
  render: () => (
    <div className="space-y-4">
      <Heading
        block={
          {
            type: 'heading_1',
            heading_1: {
              rich_text: [
                {
                  type: 'text',
                  text: { content: 'Heading 1 - text-4xl', link: null },
                  annotations: {
                    bold: false,
                    italic: false,
                    strikethrough: false,
                    underline: false,
                    code: false,
                    color: 'default',
                  },
                  plain_text: 'Heading 1 - text-4xl',
                  href: null,
                },
              ],
              color: 'default',
            },
          } as HeadingBlock
        }
      />
      <Heading
        block={
          {
            type: 'heading_2',
            heading_2: {
              rich_text: [
                {
                  type: 'text',
                  text: { content: 'Heading 2 - text-3xl', link: null },
                  annotations: {
                    bold: false,
                    italic: false,
                    strikethrough: false,
                    underline: false,
                    code: false,
                    color: 'default',
                  },
                  plain_text: 'Heading 2 - text-3xl',
                  href: null,
                },
              ],
              color: 'default',
            },
          } as HeadingBlock
        }
      />
      <Heading
        block={
          {
            type: 'heading_3',
            heading_3: {
              rich_text: [
                {
                  type: 'text',
                  text: { content: 'Heading 3 - text-2xl', link: null },
                  annotations: {
                    bold: false,
                    italic: false,
                    strikethrough: false,
                    underline: false,
                    code: false,
                    color: 'default',
                  },
                  plain_text: 'Heading 3 - text-2xl',
                  href: null,
                },
              ],
              color: 'default',
            },
          } as HeadingBlock
        }
      />
    </div>
  ),
};
