import type { Meta, StoryObj } from '@storybook/react';
import { ToDo } from './ToDo';
import type { RichTextItem } from '@/types/notion';

const meta = {
  title: 'Notion Blocks/ToDo',
  component: ToDo,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ToDo>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleRichText: RichTextItem[] = [
  {
    type: 'text',
    text: { content: 'Complete the project documentation', link: null },
    annotations: {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      color: 'default',
    },
    plain_text: 'Complete the project documentation',
  },
];

export const Unchecked: Story = {
  args: {
    richText: sampleRichText,
    checked: false,
  },
};

export const Checked: Story = {
  args: {
    richText: sampleRichText,
    checked: true,
  },
};

export const WithBoldText: Story = {
  args: {
    richText: [
      {
        type: 'text',
        text: { content: 'Important: ', link: null },
        annotations: {
          bold: true,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'Important: ',
      },
      {
        type: 'text',
        text: { content: 'Review code before merging', link: null },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'Review code before merging',
      },
    ],
    checked: false,
  },
};

export const WithLink: Story = {
  args: {
    richText: [
      {
        type: 'text',
        text: { content: 'Read the ', link: null },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'Read the ',
      },
      {
        type: 'text',
        text: { content: 'documentation', link: { url: 'https://example.com' } },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'documentation',
      },
    ],
    checked: false,
  },
};

export const TaskList: Story = {
  render: () => (
    <div className="space-y-1">
      <ToDo
        richText={[
          {
            type: 'text',
            text: { content: 'Set up development environment', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'Set up development environment',
          },
        ]}
        checked={true}
      />
      <ToDo
        richText={[
          {
            type: 'text',
            text: { content: 'Write unit tests', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'Write unit tests',
          },
        ]}
        checked={true}
      />
      <ToDo
        richText={[
          {
            type: 'text',
            text: { content: 'Deploy to production', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'Deploy to production',
          },
        ]}
        checked={false}
      />
      <ToDo
        richText={[
          {
            type: 'text',
            text: { content: 'Update documentation', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'Update documentation',
          },
        ]}
        checked={false}
      />
    </div>
  ),
};

export const WithChildren: Story = {
  args: {
    richText: [
      {
        type: 'text',
        text: { content: 'Complete frontend tasks', link: null },
        annotations: {
          bold: true,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'Complete frontend tasks',
      },
    ],
    checked: false,
    has_children: true,
    children: (
      <div className="space-y-1">
        <ToDo
          richText={[
            {
              type: 'text',
              text: { content: 'Build component library', link: null },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Build component library',
            },
          ]}
          checked={true}
        />
        <ToDo
          richText={[
            {
              type: 'text',
              text: { content: 'Create responsive layouts', link: null },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Create responsive layouts',
            },
          ]}
          checked={false}
        />
      </div>
    ),
  },
};

export const NestedTasks: Story = {
  render: () => (
    <div>
      <ToDo
        richText={[
          {
            type: 'text',
            text: { content: 'Project Setup', link: null },
            annotations: {
              bold: true,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'Project Setup',
          },
        ]}
        checked={false}
        has_children
      >
        <div className="space-y-1">
          <ToDo
            richText={[
              {
                type: 'text',
                text: { content: 'Install dependencies', link: null },
                annotations: {
                  bold: false,
                  italic: false,
                  strikethrough: false,
                  underline: false,
                  code: false,
                  color: 'default',
                },
                plain_text: 'Install dependencies',
              },
            ]}
            checked={true}
          />
          <ToDo
            richText={[
              {
                type: 'text',
                text: { content: 'Configure linting', link: null },
                annotations: {
                  bold: false,
                  italic: false,
                  strikethrough: false,
                  underline: false,
                  code: false,
                  color: 'default',
                },
                plain_text: 'Configure linting',
              },
            ]}
            checked={true}
          />
          <ToDo
            richText={[
              {
                type: 'text',
                text: { content: 'Set up CI/CD', link: null },
                annotations: {
                  bold: false,
                  italic: false,
                  strikethrough: false,
                  underline: false,
                  code: false,
                  color: 'default',
                },
                plain_text: 'Set up CI/CD',
              },
            ]}
            checked={false}
          />
        </div>
      </ToDo>
    </div>
  ),
};
