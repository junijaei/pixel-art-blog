import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from './Toggle';
import type { RichTextItem } from '@/types/notion';

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

const sampleRichText: RichTextItem[] = [
  {
    type: 'text',
    text: { content: 'Click to expand this section', link: null },
    annotations: {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      color: 'default',
    },
    plain_text: 'Click to expand this section',
  },
];

export const Default: Story = {
  args: {
    richText: sampleRichText,
    has_children: true,
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
    richText: [
      {
        type: 'text',
        text: { content: 'Important Information', link: null },
        annotations: {
          bold: true,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'Important Information',
      },
    ],
    has_children: true,
    children: <div>This section contains important details you should read.</div>,
  },
};

export const FAQ: Story = {
  render: () => (
    <div className="space-y-2">
      <Toggle
        richText={[
          {
            type: 'text',
            text: { content: 'What is this project about?', link: null },
            annotations: {
              bold: true,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'What is this project about?',
          },
        ]}
        has_children
      >
        <p>
          This is a personal blog project built with Next.js and Notion as a CMS.
          It combines modern design with retro pixel aesthetics.
        </p>
      </Toggle>

      <Toggle
        richText={[
          {
            type: 'text',
            text: { content: 'How do I get started?', link: null },
            annotations: {
              bold: true,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'How do I get started?',
          },
        ]}
        has_children
      >
        <div className="space-y-2">
          <p>Follow these steps:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Clone the repository</li>
            <li>Install dependencies with pnpm install</li>
            <li>Run pnpm dev to start the development server</li>
          </ol>
        </div>
      </Toggle>

      <Toggle
        richText={[
          {
            type: 'text',
            text: { content: 'What technologies are used?', link: null },
            annotations: {
              bold: true,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'What technologies are used?',
          },
        ]}
        has_children
      >
        <ul className="list-disc list-inside space-y-1">
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
    <Toggle
      richText={[
        {
          type: 'text',
          text: { content: 'Level 1: Parent Toggle', link: null },
          annotations: {
            bold: true,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          plain_text: 'Level 1: Parent Toggle',
        },
      ]}
      has_children
    >
      <div className="space-y-2">
        <p>This is the first level content.</p>

        <Toggle
          richText={[
            {
              type: 'text',
              text: { content: 'Level 2: Nested Toggle', link: null },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Level 2: Nested Toggle',
            },
          ]}
          has_children
        >
          <p>This is nested content inside another toggle.</p>
        </Toggle>
      </div>
    </Toggle>
  ),
};

export const WithoutChildren: Story = {
  args: {
    richText: [
      {
        type: 'text',
        text: { content: 'This toggle has no children', link: null },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'This toggle has no children',
      },
    ],
    has_children: false,
  },
};

export const CodeExample: Story = {
  args: {
    richText: [
      {
        type: 'text',
        text: { content: 'Show code example', link: null },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'Show code example',
      },
    ],
    has_children: true,
    children: (
      <pre className="p-4 bg-muted/30 rounded-lg overflow-x-auto">
        <code className="text-sm font-mono">
          {`function example() {
  console.log("Hello, World!");
  return true;
}`}
        </code>
      </pre>
    ),
  },
};
