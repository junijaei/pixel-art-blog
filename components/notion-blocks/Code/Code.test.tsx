import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Code } from './Code';
import type { RichTextItem } from '@/types/notion';

describe('Code', () => {
  it('기본 코드 블록을 렌더링한다', () => {
    const richText: RichTextItem[] = [
      {
        type: 'text',
        text: { content: 'console.log("Hello, World!");', link: null },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'console.log("Hello, World!");',
      },
    ];

    render(<Code richText={richText} />);
    expect(screen.getByText('console.log("Hello, World!");')).toBeInTheDocument();
  });

  it('language를 렌더링한다', () => {
    const richText: RichTextItem[] = [
      {
        type: 'text',
        text: { content: 'const x = 42;', link: null },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'const x = 42;',
      },
    ];

    render(<Code richText={richText} language="javascript" />);
    expect(screen.getByText('javascript')).toBeInTheDocument();
    expect(screen.getByText('const x = 42;')).toBeInTheDocument();
  });

  it('caption을 렌더링한다', () => {
    const richText: RichTextItem[] = [
      {
        type: 'text',
        text: { content: 'function example() {}', link: null },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'function example() {}',
      },
    ];

    const caption: RichTextItem[] = [
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
      },
    ];

    render(<Code richText={richText} caption={caption} />);
    expect(screen.getByText('function example() {}')).toBeInTheDocument();
    expect(screen.getByText('Example function')).toBeInTheDocument();
  });

  it('여러 줄 코드를 렌더링한다', () => {
    const richText: RichTextItem[] = [
      {
        type: 'text',
        text: { content: 'function hello() {\n  console.log("Hello");\n}', link: null },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'function hello() {\n  console.log("Hello");\n}',
      },
    ];

    render(<Code richText={richText} language="javascript" />);
    expect(screen.getByText(/function hello\(\)/)).toBeInTheDocument();
  });

  it('language 없이 렌더링한다', () => {
    const richText: RichTextItem[] = [
      {
        type: 'text',
        text: { content: 'plain text code', link: null },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'plain text code',
      },
    ];

    render(<Code richText={richText} />);
    expect(screen.getByText('plain text')).toBeInTheDocument();
    expect(screen.getByText('plain text code')).toBeInTheDocument();
  });

  it('빈 caption을 처리한다', () => {
    const richText: RichTextItem[] = [
      {
        type: 'text',
        text: { content: 'code', link: null },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'code',
      },
    ];

    const { container } = render(<Code richText={richText} caption={[]} />);
    expect(screen.getByText('code')).toBeInTheDocument();
    expect(container.querySelector('.text-muted-foreground.text-center')).not.toBeInTheDocument();
  });
});
