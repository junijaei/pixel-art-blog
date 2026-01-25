import { Mention } from '@/components/notion-blocks/Mention/Mention';
import type { RichTextMention } from '@/types/notion';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

// 테스트용 mock mention 생성 헬퍼
function createUserMention(name: string): RichTextMention {
  return {
    type: 'mention',
    mention: {
      type: 'user',
      user: {
        object: 'user',
        id: 'user-123',
        name,
      },
    },
    annotations: {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      color: 'default',
    },
    plain_text: `@${name}`,
    href: null,
  };
}

function createPageMention(title: string): RichTextMention {
  return {
    type: 'mention',
    mention: {
      type: 'page',
      page: { id: 'page-123' },
    },
    annotations: {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      color: 'default',
    },
    plain_text: title,
    href: null,
  };
}

function createDateMention(start: string, end?: string): RichTextMention {
  return {
    type: 'mention',
    mention: {
      type: 'date',
      date: { start, end: end || null },
    },
    annotations: {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      color: 'default',
    },
    plain_text: end ? `${start} → ${end}` : start,
    href: null,
  };
}

describe('Mention', () => {
  describe('User Mention', () => {
    it('사용자 이름을 렌더링한다', () => {
      const mention = createUserMention('John Doe');

      render(<Mention richText={mention} />);

      expect(screen.getByText('@John Doe')).toBeInTheDocument();
    });

    it('사용자 아이콘을 표시한다', () => {
      const mention = createUserMention('John Doe');

      const { container } = render(<Mention richText={mention} />);

      // @ 기호와 함께 렌더링되어야 함
      expect(container.textContent).toContain('@');
    });

    it('특별한 스타일을 적용한다', () => {
      const mention = createUserMention('John Doe');

      const { container } = render(<Mention richText={mention} />);
      const span = container.querySelector('span');

      expect(span).toHaveClass('bg-muted');
      expect(span).toHaveClass('rounded');
    });
  });

  describe('Page Mention', () => {
    it('페이지 제목을 렌더링한다', () => {
      const mention = createPageMention('My Document');

      render(<Mention richText={mention} />);

      expect(screen.getByText('My Document')).toBeInTheDocument();
    });

    it('페이지 아이콘을 표시한다', () => {
      const mention = createPageMention('My Document');

      const { container } = render(<Mention richText={mention} />);

      // 링크 또는 페이지 아이콘이 포함되어야 함
      expect(container.querySelector('span')).toBeInTheDocument();
    });
  });

  describe('Date Mention', () => {
    it('단일 날짜를 렌더링한다', () => {
      const mention = createDateMention('2024-01-15');

      render(<Mention richText={mention} />);

      expect(screen.getByText('2024-01-15')).toBeInTheDocument();
    });

    it('날짜 범위를 렌더링한다', () => {
      const mention = createDateMention('2024-01-15', '2024-01-20');

      render(<Mention richText={mention} />);

      expect(screen.getByText('2024-01-15 → 2024-01-20')).toBeInTheDocument();
    });

    it('캘린더 아이콘을 표시한다', () => {
      const mention = createDateMention('2024-01-15');

      const { container } = render(<Mention richText={mention} />);

      // 날짜 컨테이너가 존재해야 함
      expect(container.querySelector('span')).toBeInTheDocument();
    });
  });

  describe('Database Mention', () => {
    it('데이터베이스 제목을 렌더링한다', () => {
      const mention: RichTextMention = {
        type: 'mention',
        mention: {
          type: 'database',
          database: { id: 'db-123' },
        },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'My Database',
        href: null,
      };

      render(<Mention richText={mention} />);

      expect(screen.getByText('My Database')).toBeInTheDocument();
    });
  });

  describe('Link Preview Mention', () => {
    it('도메인을 렌더링하고 링크로 동작한다', () => {
      const mention: RichTextMention = {
        type: 'mention',
        mention: {
          type: 'link_mention',
          link_mention: { href: 'https://example.com/some/path' },
        },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'https://example.com/some/path',
        href: null,
      };

      render(<Mention richText={mention} />);

      expect(screen.getByText('https://example.com/some/path')).toBeInTheDocument();

      // 링크로 렌더링됨
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', 'https://example.com/some/path');
      expect(link).toHaveAttribute('target', '_blank');
    });

    it('title 정보가 있을 시 title이 보여진다.', () => {
      const mention: RichTextMention = {
        type: 'mention',
        mention: {
          type: 'link_mention',
          link_mention: {
            href: 'https://example.com/some/path',
            title: 'Example Link',
          },
        },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'https://example.com/some/path',
        href: null,
      };

      render(<Mention richText={mention} />);

      expect(screen.getByText('Example Link')).toBeInTheDocument();

      // 링크로 렌더링됨
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', 'https://example.com/some/path');
      expect(link).toHaveAttribute('target', '_blank');
    });
  });

  describe('Fallback', () => {
    it('알 수 없는 멘션 타입은 plain_text를 사용한다', () => {
      const mention: RichTextMention = {
        type: 'mention',
        mention: {
          type: 'template_mention',
          template_mention: {},
        },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'Template',
        href: null,
      };

      render(<Mention richText={mention} />);

      expect(screen.getByText('Template')).toBeInTheDocument();
    });
  });
});
