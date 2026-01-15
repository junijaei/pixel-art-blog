import type { RichText, ToggleBlock } from '@/types/notion';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { Toggle } from './Toggle';

const meta = {
  title: 'Notion Blocks/Toggle',
  component: Toggle,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

const createRichText = (content: string, bold = false): RichText[] => [
  {
    type: 'text',
    text: { content, link: null },
    annotations: {
      bold,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      color: 'default',
    },
    plain_text: content,
    href: null,
  },
];

const createToggleBlock = (richText: RichText[], has_children = true): ToggleBlock => ({
  object: 'block',
  id: 'toggle-block-1',
  type: 'toggle',
  created_time: '2026-01-14T00:00:00.000Z',
  last_edited_time: '2026-01-14T00:00:00.000Z',
  created_by: { object: 'user', id: 'user-1' },
  last_edited_by: { object: 'user', id: 'user-1' },
  has_children,
  archived: false,
  in_trash: false,
  parent: { type: 'page_id', page_id: 'page-1' },
  toggle: {
    rich_text: richText,
    color: 'default',
  },
});

export const Default: Story = {
  args: {
    block: createToggleBlock(createRichText('Click to expand this section')),
    children: (
      <div className="space-y-2">
        <p>This is the hidden content that appears when you click the toggle.</p>
        <p>You can put any content here!</p>
      </div>
    ),
  },
};

export const WithBoldText: Story = {
  args: {
    block: createToggleBlock(createRichText('Important Information', true)),
    children: <div>This section contains important details you should read.</div>,
  },
};

export const FAQ: Story = {
  render: () => (
    <div className="space-y-2">
      <Toggle block={createToggleBlock(createRichText('What is this project about?', true))}>
        <p>
          This is a personal blog project built with Next.js and Notion as a CMS. It combines
          modern design with retro pixel aesthetics.
        </p>
      </Toggle>

      <Toggle block={createToggleBlock(createRichText('How do I get started?', true))}>
        <div className="space-y-2">
          <p>Follow these steps:</p>
          <ol className="list-inside list-decimal space-y-1">
            <li>Clone the repository</li>
            <li>Install dependencies with pnpm install</li>
            <li>Run pnpm dev to start the development server</li>
          </ol>
        </div>
      </Toggle>

      <Toggle block={createToggleBlock(createRichText('What technologies are used?', true))}>
        <ul className="list-inside list-disc space-y-1">
          <li>Next.js 16</li>
          <li>TypeScript</li>
          <li>Tailwind CSS v4</li>
          <li>Vitest & React Testing Library</li>
          <li>Storybook</li>
        </ul>
      </Toggle>
    </div>
  ),
};

export const NestedToggles: Story = {
  render: () => (
    <Toggle block={createToggleBlock(createRichText('Level 1: Parent Toggle', true))}>
      <div className="space-y-2">
        <p>This is the first level content.</p>

        <Toggle block={createToggleBlock(createRichText('Level 2: Nested Toggle'))}>
          <p>This is nested content inside another toggle.</p>
        </Toggle>
      </div>
    </Toggle>
  ),
};

export const WithoutChildren: Story = {
  args: {
    block: createToggleBlock(createRichText('This toggle has no children'), false),
  },
};

export const CodeExample: Story = {
  args: {
    block: createToggleBlock(createRichText('Show code example')),
    children: (
      <pre className="bg-muted/30 overflow-x-auto rounded-lg p-4">
        <code className="font-mono text-sm">
          {`function example() {
  console.log("Hello, World!");
  return true;
}`}
        </code>
      </pre>
    ),
  },
};
