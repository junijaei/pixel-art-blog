import { CategorySidebar } from './CategorySidebar';
import type { CategoryTreeNode } from '@/features/post/model';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { Suspense } from 'react';

const meta: Meta<typeof CategorySidebar> = {
  title: 'Post/CategorySidebar',
  component: CategorySidebar,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      navigation: {
        pathname: '/posts',
      },
    },
  },
  decorators: [
    (Story) => (
      <Suspense fallback={null}>
        <Story />
      </Suspense>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CategorySidebar>;

// ---- Mock Data ----

const baseCategory = {
  isActive: true,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

const sampleCategories: CategoryTreeNode[] = [
  {
    ...baseCategory,
    id: 'frontend',
    label: 'Frontend',
    parentId: null,
    hasChildren: true,
    path: 'frontend',
    postCount: 2,
    cumulativePostCount: 9,
    depth: 0,
    children: [
      {
        ...baseCategory,
        id: 'react',
        label: 'React',
        parentId: 'frontend',
        hasChildren: true,
        path: 'react',
        postCount: 3,
        cumulativePostCount: 5,
        depth: 1,
        children: [
          {
            ...baseCategory,
            id: 'hooks',
            label: 'Hooks',
            parentId: 'react',
            hasChildren: false,
            path: 'hooks',
            postCount: 2,
            cumulativePostCount: 2,
            depth: 2,
            children: [],
          },
        ],
      },
      {
        ...baseCategory,
        id: 'nextjs',
        label: 'Next.js',
        parentId: 'frontend',
        hasChildren: false,
        path: 'nextjs',
        postCount: 2,
        cumulativePostCount: 2,
        depth: 1,
        children: [],
      },
    ],
  },
  {
    ...baseCategory,
    id: 'backend',
    label: 'Backend',
    parentId: null,
    hasChildren: true,
    path: 'backend',
    postCount: 1,
    cumulativePostCount: 4,
    depth: 0,
    children: [
      {
        ...baseCategory,
        id: 'nodejs',
        label: 'Node.js',
        parentId: 'backend',
        hasChildren: false,
        path: 'nodejs',
        postCount: 3,
        cumulativePostCount: 3,
        depth: 1,
        children: [],
      },
    ],
  },
  {
    ...baseCategory,
    id: 'devops',
    label: 'DevOps',
    parentId: null,
    hasChildren: false,
    path: 'devops',
    postCount: 3,
    cumulativePostCount: 3,
    depth: 0,
    children: [],
  },
];

// ---- Stories ----

/**
 * 기본 상태 (접힌 상태)
 * 버튼 클릭으로 펼칠 수 있습니다
 */
export const Collapsed: Story = {
  args: {
    categoriesPromise: Promise.resolve(sampleCategories),
  },
};

/**
 * 펼쳐진 상태
 * 카테고리 트리와 열기/닫기 애니메이션을 확인할 수 있습니다
 */
export const Expanded: Story = {
  args: {
    categoriesPromise: Promise.resolve(sampleCategories),
    defaultCollapsed: false,
  },
};

/**
 * 활성 카테고리가 있는 상태
 * 현재 경로와 일치하는 카테고리가 강조됩니다
 */
export const WithActiveCategory: Story = {
  args: {
    categoriesPromise: Promise.resolve(sampleCategories),
    defaultCollapsed: false,
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/posts/frontend/react',
      },
    },
  },
};

/**
 * 카테고리 없음
 */
export const Empty: Story = {
  args: {
    categoriesPromise: Promise.resolve([]),
    defaultCollapsed: false,
  },
};

/**
 * 깊은 중첩 구조
 */
export const DeepNested: Story = {
  args: {
    defaultCollapsed: false,
    categoriesPromise: Promise.resolve([
      {
        ...baseCategory,
        id: 'root',
        label: 'Programming',
        parentId: null,
        hasChildren: true,
        path: 'programming',
        postCount: 0,
        cumulativePostCount: 15,
        depth: 0,
        children: [
          {
            ...baseCategory,
            id: 'web',
            label: 'Web Development',
            parentId: 'root',
            hasChildren: true,
            path: 'web',
            postCount: 2,
            cumulativePostCount: 10,
            depth: 1,
            children: [
              {
                ...baseCategory,
                id: 'css',
                label: 'CSS',
                parentId: 'web',
                hasChildren: false,
                path: 'css',
                postCount: 4,
                cumulativePostCount: 4,
                depth: 2,
                children: [],
              },
              {
                ...baseCategory,
                id: 'js',
                label: 'JavaScript',
                parentId: 'web',
                hasChildren: false,
                path: 'js',
                postCount: 4,
                cumulativePostCount: 4,
                depth: 2,
                children: [],
              },
            ],
          },
          {
            ...baseCategory,
            id: 'algo',
            label: 'Algorithms',
            parentId: 'root',
            hasChildren: false,
            path: 'algo',
            postCount: 3,
            cumulativePostCount: 3,
            depth: 1,
            children: [],
          },
        ],
      },
    ]),
  },
};
