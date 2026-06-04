import { createMockCategoryPage } from '@/__test__/fixture';
import { toCategory } from '@/lib/notion/transform/categories';
import { describe, expect, it } from 'vitest';

describe('toCategory', () => {
  it('maps a Notion category page to the app category model', () => {
    const page = createMockCategoryPage({
      id: { prefix: 'cat-', number: 3 },
      label: 'Lab',
      parentId: 'parent-1',
      childrenIds: ['child-1'],
      path: 'lab',
      isActive: true,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-02T00:00:00.000Z',
    });

    expect(toCategory(page)).toMatchObject({
      id: page.id,
      label: 'Lab',
      parentId: 'parent-1',
      hasChildren: true,
      path: 'lab',
      isActive: true,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-02T00:00:00.000Z',
    });
  });
});
