import { Mention } from '@/components/notion-blocks/Mention/Mention';
import type { RichTextMention } from '@/types/notion';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta<typeof Mention> = {
  title: 'Notion Blocks/Mention',
  component: Mention,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Mention>;

const baseAnnotations = {
  bold: false,
  italic: false,
  strikethrough: false,
  underline: false,
  code: false,
  color: 'default' as const,
};

export const UserMention: Story = {
  args: {
    richText: {
      type: 'mention',
      mention: {
        type: 'user',
        user: {
          object: 'user',
          id: 'user-123',
          name: 'John Doe',
        },
      },
      annotations: baseAnnotations,
      plain_text: '@John Doe',
      href: null,
    } as RichTextMention,
  },
};

export const PageMention: Story = {
  args: {
    richText: {
      type: 'mention',
      mention: {
        type: 'page',
        page: { id: 'page-123' },
      },
      annotations: baseAnnotations,
      plain_text: 'My Important Document',
      href: null,
    } as RichTextMention,
  },
};

export const DatabaseMention: Story = {
  args: {
    richText: {
      type: 'mention',
      mention: {
        type: 'database',
        database: { id: 'db-123' },
      },
      annotations: baseAnnotations,
      plain_text: 'Project Tasks',
      href: null,
    } as RichTextMention,
  },
};

export const SingleDateMention: Story = {
  args: {
    richText: {
      type: 'mention',
      mention: {
        type: 'date',
        date: { start: '2024-01-15', end: null },
      },
      annotations: baseAnnotations,
      plain_text: '2024-01-15',
      href: null,
    } as RichTextMention,
  },
};

export const DateRangeMention: Story = {
  args: {
    richText: {
      type: 'mention',
      mention: {
        type: 'date',
        date: { start: '2024-01-15', end: '2024-01-20' },
      },
      annotations: baseAnnotations,
      plain_text: '2024-01-15 → 2024-01-20',
      href: null,
    } as RichTextMention,
  },
};

export const LinkPreviewMention: Story = {
  args: {
    richText: {
      type: 'mention',
      mention: {
        type: 'link_mention',
        link_mention: { href: 'https://github.com/example/repo', title: 'GitHub' },
      },
      annotations: baseAnnotations,
      plain_text: 'https://github.com/example/repo',
      href: null,
    } as RichTextMention,
  },
};

export const AllMentionTypes: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-muted-foreground mb-1 text-sm">User Mention:</p>
        <Mention
          richText={{
            type: 'mention',
            mention: {
              type: 'user',
              user: { object: 'user', id: 'user-1', name: 'Jane Smith' },
            },
            annotations: baseAnnotations,
            plain_text: '@Jane Smith',
            href: null,
          }}
        />
      </div>
      <div>
        <p className="text-muted-foreground mb-1 text-sm">Page Mention:</p>
        <Mention
          richText={{
            type: 'mention',
            mention: {
              type: 'page',
              page: { id: 'page-1' },
            },
            annotations: baseAnnotations,
            plain_text: 'Meeting Notes',
            href: null,
          }}
        />
      </div>
      <div>
        <p className="text-muted-foreground mb-1 text-sm">Database Mention:</p>
        <Mention
          richText={{
            type: 'mention',
            mention: {
              type: 'database',
              database: { id: 'db-1' },
            },
            annotations: baseAnnotations,
            plain_text: 'Bug Tracker',
            href: null,
          }}
        />
      </div>
      <div>
        <p className="text-muted-foreground mb-1 text-sm">Date Mention:</p>
        <Mention
          richText={{
            type: 'mention',
            mention: {
              type: 'date',
              date: { start: '2024-03-01', end: '2024-03-15' },
            },
            annotations: baseAnnotations,
            plain_text: '2024-03-01 → 2024-03-15',
            href: null,
          }}
        />
      </div>
    </div>
  ),
};

export const InlineUsage: Story = {
  render: () => (
    <p className="text-foreground">
      Hey{' '}
      <Mention
        richText={{
          type: 'mention',
          mention: {
            type: 'user',
            user: { object: 'user', id: 'user-1', name: 'John' },
          },
          annotations: baseAnnotations,
          plain_text: '@John',
          href: null,
        }}
      />{' '}
      can you check the{' '}
      <Mention
        richText={{
          type: 'mention',
          mention: {
            type: 'page',
            page: { id: 'page-1' },
          },
          annotations: baseAnnotations,
          plain_text: 'Design Specs',
          href: null,
        }}
      />{' '}
      before{' '}
      <Mention
        richText={{
          type: 'mention',
          mention: {
            type: 'date',
            date: { start: '2024-01-20', end: null },
          },
          annotations: baseAnnotations,
          plain_text: '2024-01-20',
          href: null,
        }}
      />
      ?
    </p>
  ),
};
