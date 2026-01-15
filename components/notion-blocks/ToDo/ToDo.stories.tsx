import type { RichText, ToDoBlock } from '@/types/notion';
import type { Meta, StoryObj } from '@storybook/nextjs';
import type { ReactNode } from 'react';
import { ToDo } from './ToDo';

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

const createToDoBlock = (
  richText: RichText[],
  checked: boolean,
  id = 'todo-1',
): ToDoBlock => ({
  object: 'block',
  id,
  type: 'to_do',
  created_time: '2026-01-14T00:00:00.000Z',
  last_edited_time: '2026-01-14T00:00:00.000Z',
  created_by: { object: 'user', id: 'user-1' },
  last_edited_by: { object: 'user', id: 'user-1' },
  has_children: false,
  archived: false,
  in_trash: false,
  parent: { type: 'page_id', page_id: 'page-1' },
  to_do: {
    rich_text: richText,
    color: 'default',
    checked,
  },
});

export const Unchecked: Story = {
  args: {
    block: createToDoBlock(createRichText('Complete the project documentation'), false),
  },
};

export const Checked: Story = {
  args: {
    block: createToDoBlock(createRichText('Complete the project documentation'), true),
  },
};

export const WithBoldText: Story = {
  args: {
    block: createToDoBlock(
      [
        ...createRichText('Important: ', true),
        ...createRichText('Review code before merging'),
      ],
      false,
    ),
  },
};

export const WithLink: Story = {
  args: {
    block: createToDoBlock(
      [
        ...createRichText('Read the '),
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
          href: 'https://example.com',
        },
      ],
      false,
    ),
  },
};

export const TaskList: Story = {
  args: {
    block: createToDoBlock(createRichText(''), false, 'dummy'),
  },
  render: () => (
    <div className="space-y-1">
      <ToDo
        block={createToDoBlock(createRichText('Set up development environment'), true, 'task-1')}
      />
      <ToDo block={createToDoBlock(createRichText('Write unit tests'), true, 'task-2')} />
      <ToDo block={createToDoBlock(createRichText('Deploy to production'), false, 'task-3')} />
      <ToDo block={createToDoBlock(createRichText('Update documentation'), false, 'task-4')} />
    </div>
  ),
};

export const WithChildren: Story = {
  args: {
    block: {
      ...createToDoBlock(createRichText('Complete frontend tasks', true), false, 'parent'),
      has_children: true,
    },
    children: (
      <div className="space-y-1">
        <ToDo block={createToDoBlock(createRichText('Build component library'), true, 'child-1')} />
        <ToDo
          block={createToDoBlock(createRichText('Create responsive layouts'), false, 'child-2')}
        />
      </div>
    ) as ReactNode,
  },
};

export const NestedTasks: Story = {
  args: {
    block: createToDoBlock(createRichText(''), false, 'dummy'),
  },
  render: () => (
    <div>
      <ToDo
        block={{
          ...createToDoBlock(createRichText('Project Setup', true), false, 'nested-parent'),
          has_children: true,
        }}
      >
        <div className="space-y-1">
          <ToDo
            block={createToDoBlock(createRichText('Install dependencies'), true, 'nested-1')}
          />
          <ToDo block={createToDoBlock(createRichText('Configure linting'), true, 'nested-2')} />
          <ToDo block={createToDoBlock(createRichText('Set up CI/CD'), false, 'nested-3')} />
        </div>
      </ToDo>
    </div>
  ),
};
