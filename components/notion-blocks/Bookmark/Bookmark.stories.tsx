import type { Meta, StoryObj } from '@storybook/nextjs';
import { Bookmark } from './Bookmark';
import { createBookmarkBlock, createRichText } from '../__integration__/fixtures';

const meta = {
  title: 'Notion Blocks/Bookmark',
  component: Bookmark,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Bookmark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    block: createBookmarkBlock('https://github.com'),
  },
};

export const WithCaption: Story = {
  args: {
    block: createBookmarkBlock('https://github.com', createRichText('GitHub - Where the world builds software')),
  },
};

export const LongURL: Story = {
  args: {
    block: createBookmarkBlock('https://github.com/vercel/next.js/tree/canary/examples/with-typescript-eslint-jest'),
  },
};

export const WithStyledCaption: Story = {
  args: {
    block: createBookmarkBlock('https://nextjs.org', [
      ...createRichText('Next.js by Vercel - ', { bold: true }),
      ...createRichText('The React Framework for Production', { italic: true }),
    ]),
  },
};

export const MultipleBookmarks: Story = {
  args: {
    block: createBookmarkBlock('https://github.com'),
  },
  render: () => (
    <div className="space-y-4">
      <Bookmark block={createBookmarkBlock('https://github.com')} />
      <Bookmark block={createBookmarkBlock('https://nextjs.org', createRichText('Next.js Framework'))} />
      <Bookmark block={createBookmarkBlock('https://vercel.com', createRichText('Vercel Platform'))} />
    </div>
  ),
};

export const DifferentDomains: Story = {
  args: {
    block: createBookmarkBlock('https://react.dev'),
  },
  render: () => (
    <div className="space-y-4">
      <Bookmark block={createBookmarkBlock('https://react.dev', createRichText('React Documentation'))} />
      <Bookmark block={createBookmarkBlock('https://tailwindcss.com', createRichText('Tailwind CSS Framework'))} />
      <Bookmark block={createBookmarkBlock('https://vitejs.dev', createRichText('Vite Build Tool'))} />
    </div>
  ),
};

export const Loading: Story = {
  args: {
    block: createBookmarkBlock('https://example-slow-loading-site.com'),
  },
  parameters: {
    docs: {
      description: {
        story: '스켈레톤 UI를 보려면 네트워크를 느리게 설정하세요.',
      },
    },
  },
};
