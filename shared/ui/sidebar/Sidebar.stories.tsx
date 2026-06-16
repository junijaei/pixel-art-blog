import { Sidebar, type SidebarProps, type SidebarTreeNode } from './Sidebar';
import type { Meta, StoryObj } from '@storybook/nextjs';
import type { ReactNode } from 'react';

interface DemoNode extends SidebarTreeNode {
  label: string;
  children: DemoNode[];
}

type DemoSidebar = (props: SidebarProps<DemoNode>) => ReactNode;

const tree: DemoNode[] = [
  {
    id: 'guides',
    label: 'Guides',
    children: [
      { id: 'getting-started', label: 'Getting Started', children: [] },
      {
        id: 'advanced',
        label: 'Advanced',
        children: [{ id: 'patterns', label: 'Patterns', children: [] }],
      },
    ],
  },
  {
    id: 'reference',
    label: 'Reference',
    children: [{ id: 'api', label: 'API', children: [] }],
  },
  { id: 'changelog', label: 'Changelog', children: [] },
];

const meta: Meta<DemoSidebar> = {
  title: 'UI/Sidebar',
  component: Sidebar as DemoSidebar,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    items: tree,
    title: 'Docs',
    storageKey: 'sb-demo',
    renderItem: ({ node }) => (
      <span className="text-sidebar-foreground flex-1 truncate px-2 py-1.5 text-sm">{node.label}</span>
    ),
  },
};

export default meta;
type Story = StoryObj<DemoSidebar>;

/** 접힌 기본 상태 */
export const Collapsed: Story = {};

/** 펼쳐진 상태 — 제네릭 트리 + renderItem */
export const Expanded: Story = {
  args: { defaultCollapsed: false },
};

/** 빈 상태 */
export const Empty: Story = {
  args: { items: [], defaultCollapsed: false, emptyText: 'No items' },
};
