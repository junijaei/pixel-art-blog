import { createMockPostPage } from '@/shared/testing/fixture';
import { toPost } from '@/features/post/transform/posts';
import { describe, expect, it } from 'vitest';

describe('toPost', () => {
  it('maps a Notion post page to the app post model', () => {
    const page = createMockPostPage({
      id: { prefix: 'post-', number: 7 },
      title: 'Hello',
      categoryId: 'cat-1',
      status: 'completed',
      description: 'Desc',
      isPublished: true,
      publishedAt: '2026-01-01',
      tags: ['react', 'notion'],
      createdAt: '2025-12-31T00:00:00.000Z',
      updatedAt: '2026-01-02T00:00:00.000Z',
    });

    expect(toPost(page)).toMatchObject({
      id: page.id,
      title: 'Hello',
      categoryId: 'cat-1',
      status: 'completed',
      description: 'Desc',
      isPublished: true,
      publishedAt: '2026-01-01',
      slug: 'post-7',
      tags: ['react', 'notion'],
      createdAt: '2025-12-31T00:00:00.000Z',
      updatedAt: '2026-01-02T00:00:00.000Z',
    });
  });
});
