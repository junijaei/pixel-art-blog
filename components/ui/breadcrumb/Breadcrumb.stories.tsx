import type { Meta, StoryObj } from '@storybook/nextjs';
import { Breadcrumb, type BreadcrumbItem } from './Breadcrumb';

const meta: Meta<typeof Breadcrumb> = {
  title: 'UI/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultItems: BreadcrumbItem[] = [
  { label: 'All', path: '' },
  { label: 'Tech', path: 'tech' },
  { label: 'React', path: 'tech/react' },
];

export const Default: Story = {
  args: {
    items: defaultItems,
  },
};

export const WithCurrentPath: Story = {
  args: {
    items: defaultItems,
    currentPath: 'tech',
  },
};

export const SingleItem: Story = {
  args: {
    items: [{ label: 'All', path: '' }],
  },
};

export const TwoItems: Story = {
  args: {
    items: [
      { label: 'All', path: '' },
      { label: 'Log', path: 'log' },
    ],
    currentPath: 'log',
  },
};

export const LongPath: Story = {
  args: {
    items: [
      { label: 'All', path: '' },
      { label: 'Development', path: 'dev' },
      { label: 'Frontend', path: 'dev/frontend' },
      { label: 'React', path: 'dev/frontend/react' },
      { label: 'Hooks', path: 'dev/frontend/react/hooks' },
    ],
    currentPath: 'dev/frontend/react',
  },
};
