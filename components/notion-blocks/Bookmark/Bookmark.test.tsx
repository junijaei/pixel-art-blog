import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Bookmark } from './Bookmark';
import type { BookmarkBlock } from '@/types/notion';

// Mock fetch API
global.fetch = vi.fn();

describe('Bookmark', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock fetch to return empty preview data
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ url: 'https://example.com' }),
    });
  });

  const createBookmarkBlock = (url: string, caption: any[] = []): BookmarkBlock => ({
    object: 'block',
    id: 'bookmark-test-1',
    type: 'bookmark',
    created_time: '2026-01-19T00:00:00.000Z',
    last_edited_time: '2026-01-19T00:00:00.000Z',
    created_by: { object: 'user', id: 'user-1' },
    last_edited_by: { object: 'user', id: 'user-1' },
    has_children: false,
    archived: false,
    in_trash: false,
    parent: { type: 'page_id', page_id: 'page-1' },
    bookmark: {
      url,
      caption,
    },
  });

  it('URL을 렌더링한다', async () => {
    const block = createBookmarkBlock('https://example.com');

    render(<Bookmark block={block} />);

    // Wait for loading to complete
    await waitFor(() => {
      const urlElements = screen.getAllByText('https://example.com');
      expect(urlElements.length).toBeGreaterThan(0);
    });
  });

  it('링크가 새 탭에서 열린다', () => {
    const block = createBookmarkBlock('https://example.com');

    render(<Bookmark block={block} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('caption을 렌더링한다', async () => {
    const block = createBookmarkBlock('https://example.com', [
      {
        type: 'text',
        text: { content: 'This is a bookmark caption', link: null },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'This is a bookmark caption',
        href: null,
      },
    ]);

    render(<Bookmark block={block} />);

    await waitFor(() => {
      expect(screen.getByText('This is a bookmark caption')).toBeInTheDocument();
    });
  });

  it('caption이 없으면 표시하지 않는다', () => {
    const block = createBookmarkBlock('https://example.com', []);

    const { container } = render(<Bookmark block={block} />);

    // caption 컨테이너가 없어야 함
    const captionElements = container.querySelectorAll('.caption-container');
    expect(captionElements.length).toBe(0);
  });

  it('픽셀 아이콘을 렌더링한다', async () => {
    const block = createBookmarkBlock('https://example.com');

    const { container } = render(<Bookmark block={block} />);

    // Wait for loading to complete
    await waitFor(() => {
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });

  it('카드 스타일을 적용한다', () => {
    const block = createBookmarkBlock('https://example.com');

    const { container } = render(<Bookmark block={block} />);

    const link = container.querySelector('a');
    expect(link).toHaveClass('rounded-xl');
    expect(link).toHaveClass('border');
  });

  it('스켈레톤 UI를 초기에 표시한다', () => {
    const block = createBookmarkBlock('https://example.com');

    const { container } = render(<Bookmark block={block} />);

    // 스켈레톤 요소가 있어야 함 (animate-pulse)
    const skeleton = container.querySelector('.animate-pulse');
    expect(skeleton).toBeInTheDocument();
  });
});
