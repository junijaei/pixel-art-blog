import type { NotionColor, QuoteBlock, RichText } from '@/types/notion';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { Quote } from './Quote';

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

// Helper 함수: RichText 생성
const createRichText = (
  content: string,
  bold = false,
  italic = false,
  color: NotionColor = 'default',
  linkUrl?: string
): RichText[] => [
  {
    type: 'text',
    text: { content, link: linkUrl ? { url: linkUrl } : null },
    annotations: {
      bold,
      italic,
      strikethrough: false,
      underline: false,
      code: false,
      color,
    },
    plain_text: content,
    href: linkUrl || null,
  },
];

// Helper 함수: QuoteBlock 생성
const createQuoteBlock = (richText: RichText[], color: NotionColor = 'default'): QuoteBlock => ({
  object: 'block',
  id: 'quote-block-1',
  type: 'quote',
  created_time: '2026-01-14T00:00:00.000Z',
  last_edited_time: '2026-01-14T00:00:00.000Z',
  created_by: { object: 'user', id: 'user-1' },
  last_edited_by: { object: 'user', id: 'user-1' },
  has_children: false,
  archived: false,
  in_trash: false,
  parent: { type: 'page_id', page_id: 'page-1' },
  quote: {
    rich_text: richText,
    color,
  },
});

/**
 * 기본 인용문
 */
export const Default: Story = {
  args: {
    block: createQuoteBlock(createRichText('The only way to do great work is to love what you do.')),
  },
};

/**
 * 저자 정보가 포함된 인용문 (Bold 처리)
 */
export const WithAuthor: Story = {
  args: {
    block: createQuoteBlock([
      ...createRichText('Stay hungry, stay foolish. '),
      ...createRichText('— Steve Jobs', true),
    ]),
  },
};

/**
 * 여러 줄로 구성된 긴 인용문
 */
export const LongQuote: Story = {
  name: 'Long Multi-line Quote',
  args: {
    block: createQuoteBlock(
      createRichText(
        'In the long history of humankind (and animal kind, too) those who learned to collaborate and improvise most effectively have prevailed. The future depends on what we do in the present.'
      )
    ),
  },
};

/**
 * 이탤릭 스타일이 적용된 인용문
 */
export const WithItalic: Story = {
  args: {
    block: createQuoteBlock(createRichText('Innovation distinguishes between a leader and a follower.', false, true)),
  },
};

/**
 * Bold와 Italic이 조합된 인용문
 */
export const WithMultipleStyles: Story = {
  name: 'Multiple Text Styles',
  args: {
    block: createQuoteBlock([
      ...createRichText('Code is like humor. ', false, true),
      ...createRichText('When you have to explain it, its bad.', true, false),
    ]),
  },
};

/**
 * 링크가 포함된 인용문
 */
export const WithLink: Story = {
  args: {
    block: createQuoteBlock([
      ...createRichText('Read more about design systems at '),
      ...createRichText('our documentation', false, false, 'default', 'https://example.com/docs'),
      ...createRichText('.'),
    ]),
  },
};

/**
 * 색상이 적용된 인용문 (Gray background)
 */
export const WithColor: Story = {
  args: {
    block: createQuoteBlock(createRichText('This is a gray background quote.'), 'gray_background'),
  },
};

/**
 * 다양한 색상 배경 인용문
 */
export const ColorVariants: Story = {
  name: 'Different Background Colors',
  render: () => (
    <div className="space-y-4">
      <Quote block={createQuoteBlock(createRichText('Gray background quote'), 'gray_background')} />
      <Quote block={createQuoteBlock(createRichText('Blue background quote'), 'blue_background')} />
      <Quote block={createQuoteBlock(createRichText('Yellow background quote'), 'yellow_background')} />
      <Quote block={createQuoteBlock(createRichText('Green background quote'), 'green_background')} />
    </div>
  ),
};

/**
 * 빈 인용문 (Edge case)
 */
export const Empty: Story = {
  args: {
    block: createQuoteBlock([]),
  },
};

/**
 * 여러 인용문이 나열된 예시
 */
export const MultipleQuotes: Story = {
  name: 'Multiple Quotes in Sequence',
  render: () => (
    <div className="space-y-4">
      <Quote block={createQuoteBlock(createRichText('Simplicity is the ultimate sophistication.'))} />
      <Quote
        block={createQuoteBlock([
          ...createRichText('Design is not just what it looks like and feels like. '),
          ...createRichText('Design is how it works.', true),
        ])}
      />
      <Quote block={createQuoteBlock(createRichText('Good design is obvious. Great design is transparent.'))} />
    </div>
  ),
};
