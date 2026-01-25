import type { Category } from '@/types/notion';
import { describe, expect, it } from 'vitest';

function createMockCategory(overrides: Partial<Category> & { id: string; label: string; path: string }): Category {
  return {
    parentId: null,
    hasChildren: false,
    isActive: true,
    createdAt: '',
    updatedAt: '',
    ...overrides,
  };
}

function buildFullPath(categoryId: string, categoryMap: Map<string, Category>): string {
  const segments: string[] = [];
  let currentId: string | null = categoryId;

  while (currentId) {
    const category = categoryMap.get(currentId);
    if (!category) break;
    if (category.parentId !== null) {
      segments.unshift(category.path);
    }
    currentId = category.parentId;
  }

  return segments.join('/');
}

describe('buildFullPath', () => {
  it('루트 카테고리는 빈 문자열을 반환한다', () => {
    const categoryMap = new Map<string, Category>();
    categoryMap.set('cat-1', createMockCategory({ id: 'cat-1', label: 'All', path: 'all' }));

    const result = buildFullPath('cat-1', categoryMap);

    expect(result).toBe('');
  });

  it('2단계 계층의 fullPath를 생성한다 (루트 제외)', () => {
    const categoryMap = new Map<string, Category>();
    categoryMap.set('cat-1', createMockCategory({ id: 'cat-1', label: 'All', path: 'all' }));
    categoryMap.set('cat-2', createMockCategory({ id: 'cat-2', label: '랩', path: 'lab', parentId: 'cat-1' }));

    const result = buildFullPath('cat-2', categoryMap);

    expect(result).toBe('lab');
  });

  it('3단계 계층의 fullPath를 생성한다 (루트 제외)', () => {
    const categoryMap = new Map<string, Category>();
    categoryMap.set('cat-1', createMockCategory({ id: 'cat-1', label: 'All', path: 'all' }));
    categoryMap.set('cat-2', createMockCategory({ id: 'cat-2', label: '랩', path: 'lab', parentId: 'cat-1' }));
    categoryMap.set('cat-3', createMockCategory({ id: 'cat-3', label: '리액트', path: 'react', parentId: 'cat-2' }));

    const result = buildFullPath('cat-3', categoryMap);

    expect(result).toBe('lab/react');
  });

  it('존재하지 않는 카테고리 ID는 빈 문자열을 반환한다', () => {
    const categoryMap = new Map<string, Category>();

    const result = buildFullPath('non-existent', categoryMap);

    expect(result).toBe('');
  });

  it('label이 아닌 path 속성을 사용한다', () => {
    const categoryMap = new Map<string, Category>();
    categoryMap.set('cat-1', createMockCategory({ id: 'cat-1', label: 'All', path: 'all' }));
    categoryMap.set(
      'cat-2',
      createMockCategory({ id: 'cat-2', label: '학점-은행제', path: 'academic', parentId: 'cat-1' })
    );

    const result = buildFullPath('cat-2', categoryMap);

    expect(result).toBe('academic');
  });
});

describe('getBreadcrumbItems logic', () => {
  it('fullPath를 분리하여 각 세그먼트의 경로를 생성할 수 있다', () => {
    const fullPath = 'lab/react';
    const segments = fullPath.split('/');

    const paths = segments.map((_, i) => segments.slice(0, i + 1).join('/'));

    expect(paths).toEqual(['lab', 'lab/react']);
  });

  it('빈 fullPath는 빈 배열을 반환해야 한다', () => {
    const fullPath: string = '';
    const segments = fullPath.length > 0 ? fullPath.split('/') : [];

    expect(segments).toEqual([]);
  });
});
