import { describe, expect, it } from 'vitest';
import { createPostLink, parsePostLink } from '@/../lib/notion/util/category-link';

describe('createPostLink', () => {
  it('카테고리 경로와 포스트 ID로 링크를 생성한다', () => {
    const result = createPostLink('all/lab/react', 'post-123');

    expect(result).toBe('/all/lab/react/post-123');
  });

  it('카테고리 경로가 없으면 포스트 ID만 반환한다', () => {
    const result = createPostLink('', 'post-123');

    expect(result).toBe('/post-123');
  });
});

describe('parsePostLink', () => {
  it('경로 세그먼트에서 카테고리 경로와 포스트 ID를 추출한다', () => {
    const result = parsePostLink(['all', 'lab', 'react', 'post-123']);

    expect(result).toEqual({
      categoryPath: 'all/lab/react',
      postId: 'post-123',
    });
  });

  it('단일 세그먼트는 포스트 ID로 처리한다', () => {
    const result = parsePostLink(['post-123']);

    expect(result).toEqual({
      categoryPath: '',
      postId: 'post-123',
    });
  });

  it('빈 배열은 null을 반환한다', () => {
    const result = parsePostLink([]);

    expect(result).toBeNull();
  });
});
