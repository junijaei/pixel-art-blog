import type { CodeBlock, RichText } from '@/types/notion';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Code } from './Code';

// Helper function to create complete CodeBlock with all required fields
const createCodeBlock = (code: string, language: string, caption: RichText[] = []): CodeBlock => ({
  object: 'block',
  id: 'code-test-1',
  type: 'code',
  created_time: '2026-01-14T00:00:00.000Z',
  last_edited_time: '2026-01-14T00:00:00.000Z',
  created_by: { object: 'user', id: 'user-1' },
  last_edited_by: { object: 'user', id: 'user-1' },
  has_children: false,
  archived: false,
  in_trash: false,
  parent: { type: 'page_id', page_id: 'page-1' },
  code: {
    rich_text: [
      {
        type: 'text',
        text: { content: code, link: null },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: code,
        href: null,
      },
    ],
    language,
    caption,
  },
});

describe('Code', () => {
  it('기본 코드 블록을 렌더링한다', () => {
    const block = createCodeBlock('console.log("Hello, World!");', 'plain text');

    render(<Code block={block} />);
    expect(screen.getByText('console.log("Hello, World!");')).toBeInTheDocument();
  });

  it('language를 렌더링한다', () => {
    const block = createCodeBlock('const x = 42;', 'javascript');

    render(<Code block={block} />);
    expect(screen.getByText('javascript')).toBeInTheDocument();
    expect(screen.getByText('const x = 42;')).toBeInTheDocument();
  });

  it('caption을 렌더링한다', () => {
    const caption: RichText[] = [
      {
        type: 'text',
        text: { content: 'Example function', link: null },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'Example function',
        href: null,
      },
    ];
    const block = createCodeBlock('function example() {}', 'plain text', caption);

    render(<Code block={block} />);
    expect(screen.getByText('function example() {}')).toBeInTheDocument();
    expect(screen.getByText('Example function')).toBeInTheDocument();
  });

  it('여러 줄 코드를 렌더링한다', () => {
    const block = createCodeBlock('function hello() {\n  console.log("Hello");\n}', 'javascript');

    render(<Code block={block} />);
    expect(screen.getByText(/function hello\(\)/)).toBeInTheDocument();
  });

  it('language 없이 렌더링한다', () => {
    const block = createCodeBlock('plain text code', 'plain text');

    render(<Code block={block} />);
    expect(screen.getByText('plain text')).toBeInTheDocument();
    expect(screen.getByText('plain text code')).toBeInTheDocument();
  });

  it('빈 caption을 처리한다', () => {
    const block = createCodeBlock('code', 'plain text');

    const { container } = render(<Code block={block} />);
    expect(screen.getByText('code')).toBeInTheDocument();
    expect(container.querySelector('.text-muted-foreground.text-center')).not.toBeInTheDocument();
  });
});
