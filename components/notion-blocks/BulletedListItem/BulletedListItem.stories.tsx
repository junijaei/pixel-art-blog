import type { BulletedListBlock, NotionColor, RichText } from '@/types/notion';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { BulletedListItem } from './BulletedListItem';

const meta = {
  title: 'Notion Blocks/BulletedListItem',
  component: BulletedListItem,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ul>
        <Story />
      </ul>
    ),
  ],
} satisfies Meta<typeof BulletedListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

const createRichText = (
  content: string,
  bold = false,
  color: NotionColor = 'default',
  linkUrl?: string,
): RichText[] => [
  {
    type: 'text',
    text: { content, link: linkUrl ? { url: linkUrl } : null },
    annotations: {
      bold,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      color,
    },
    plain_text: content,
    href: linkUrl || null,
  },
];

const createBulletedListBlock = (
  richText: RichText[],
  color: NotionColor = 'default',
  has_children = false,
  id = 'bulleted-1',
): BulletedListBlock => ({
  object: 'block',
  id,
  type: 'bulleted_list_item',
  created_time: '2026-01-14T00:00:00.000Z',
  last_edited_time: '2026-01-14T00:00:00.000Z',
  created_by: { object: 'user', id: 'user-1' },
  last_edited_by: { object: 'user', id: 'user-1' },
  has_children,
  archived: false,
  in_trash: false,
  parent: { type: 'page_id', page_id: 'page-1' },
  bulleted_list_item: {
    rich_text: richText,
    color,
  },
});

/**
 * 기본 불릿 리스트 아이템
 */
export const Default: Story = {
  args: {
    block: createBulletedListBlock(createRichText('This is a bulleted list item')),
  },
};

/**
 * Bold 스타일 아이템
 */
export const WithBold: Story = {
  args: {
    block: createBulletedListBlock(createRichText('Bold list item', true)),
  },
};

/**
 * 링크가 포함된 아이템
 */
export const WithLink: Story = {
  args: {
    block: createBulletedListBlock([
      ...createRichText('Check out '),
      ...createRichText('this link', false, 'default', 'https://example.com'),
    ]),
  },
};

/**
 * 색상이 적용된 아이템
 */
export const WithColor: Story = {
  args: {
    block: createBulletedListBlock(createRichText('Blue colored list item', false, 'blue'), 'blue'),
  },
};

/**
 * 여러 아이템이 있는 리스트
 */
export const MultipleItems: Story = {
  args: {
    block: createBulletedListBlock(createRichText('First item'), 'default', false, 'bullet-1'),
  },
  render: (args) => (
    <ul>
      <BulletedListItem {...args} />
      <BulletedListItem
        block={createBulletedListBlock(createRichText('Second item'), 'default', false, 'bullet-2')}
      />
      <BulletedListItem
        block={createBulletedListBlock(createRichText('Third item'), 'default', false, 'bullet-3')}
      />
    </ul>
  ),
};

/**
 * 중첩된 리스트 (Nested List)
 */
export const NestedList: Story = {
  args: {
    block: createBulletedListBlock(createRichText('Parent item'), 'default', true),
    children: (
      <>
        <BulletedListItem
          block={createBulletedListBlock(
            createRichText('Nested item 1'),
            'default',
            false,
            'nested-1',
          )}
        />
        <BulletedListItem
          block={createBulletedListBlock(
            createRichText('Nested item 2'),
            'default',
            false,
            'nested-2',
          )}
        />
      </>
    ),
  },
};
