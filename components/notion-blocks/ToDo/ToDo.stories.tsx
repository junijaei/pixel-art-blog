import { ToDo } from '@/components/notion-blocks/ToDo/ToDo';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { combineRichText, createRichText, createToDoBlock } from '../__integration__/fixtures';

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
      combineRichText(createRichText('Important: ', { bold: true }), createRichText('Review code before merging')),
      false
    ),
  },
};

export const WithLink: Story = {
  args: {
    block: createToDoBlock(
      combineRichText(createRichText('Read the '), createRichText('documentation', { link: 'https://example.com' })),
      false
    ),
  },
};

export const TaskList: Story = {
  args: {
    block: createToDoBlock(createRichText('Set up development environment'), true, 'default', { id: 'task-1' }),
  },
  render: () => (
    <div className="space-y-1">
      <ToDo
        block={createToDoBlock(createRichText('Set up development environment'), true, 'default', { id: 'task-1' })}
      />
      <ToDo block={createToDoBlock(createRichText('Write unit tests'), true, 'default', { id: 'task-2' })} />
      <ToDo block={createToDoBlock(createRichText('Deploy to production'), false, 'default', { id: 'task-3' })} />
      <ToDo block={createToDoBlock(createRichText('Update documentation'), false, 'default', { id: 'task-4' })} />
    </div>
  ),
};

export const WithChildren: Story = {
  args: {
    block: createToDoBlock(createRichText('Complete frontend tasks', { bold: true }), false, 'default', {
      id: 'parent',
      has_children: true,
    }),
    children: (
      <div className="space-y-1">
        <ToDo block={createToDoBlock(createRichText('Build component library'), true, 'default', { id: 'child-1' })} />
        <ToDo
          block={createToDoBlock(createRichText('Create responsive layouts'), false, 'default', { id: 'child-2' })}
        />
      </div>
    ),
  },
};

export const NestedTasks: Story = {
  args: {
    block: createToDoBlock(createRichText('Project Setup', { bold: true }), false, 'default', {
      id: 'nested-parent',
      has_children: true,
    }),
  },
  render: () => (
    <div>
      <ToDo
        block={createToDoBlock(createRichText('Project Setup', { bold: true }), false, 'default', {
          id: 'nested-parent',
          has_children: true,
        })}
      >
        <div className="space-y-1">
          <ToDo block={createToDoBlock(createRichText('Install dependencies'), true, 'default', { id: 'nested-1' })} />
          <ToDo block={createToDoBlock(createRichText('Configure linting'), true, 'default', { id: 'nested-2' })} />
          <ToDo block={createToDoBlock(createRichText('Set up CI/CD'), false, 'default', { id: 'nested-3' })} />
        </div>
      </ToDo>
    </div>
  ),
};
