import { Code } from '@/components/notion-blocks/Code/Code';
import type { CodeBlock, RichText } from '@/types/notion';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

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

  describe('Collapse/Expand 기능', () => {
    // 110줄짜리 코드 생성
    const generateLongCode = (lines: number): string => {
      return Array.from({ length: lines }, (_, i) => `// Line ${i + 1}`).join('\n');
    };

    it('100줄 이하의 코드는 collapse 버튼을 표시하지 않는다', () => {
      const shortCode = generateLongCode(50);
      const block = createCodeBlock(shortCode, 'javascript');

      render(<Code block={block} />);

      expect(screen.queryByText('Expand')).not.toBeInTheDocument();
      expect(screen.queryByText('Collapse')).not.toBeInTheDocument();
      expect(screen.queryByText(/lines/)).not.toBeInTheDocument();
    });

    it('100줄 이상의 코드는 초기에 collapsed 상태이다', () => {
      const longCode = generateLongCode(150);
      const block = createCodeBlock(longCode, 'javascript');

      render(<Code block={block} />);

      // Expand 버튼이 표시됨
      expect(screen.getByText('Expand')).toBeInTheDocument();
      // 줄 수가 표시됨
      expect(screen.getByText('(150 lines)')).toBeInTheDocument();
      // 전체 줄 수 표시 버튼
      expect(screen.getByText('Show all 150 lines')).toBeInTheDocument();
    });

    it('Expand 버튼 클릭 시 코드가 확장된다', () => {
      const longCode = generateLongCode(150);
      const block = createCodeBlock(longCode, 'javascript');

      render(<Code block={block} />);

      // 초기: Expand 버튼
      const expandButton = screen.getByText('Expand');
      expect(expandButton).toBeInTheDocument();

      // 클릭
      fireEvent.click(expandButton);

      // 확장 후: Collapse 버튼
      expect(screen.getByText('Collapse')).toBeInTheDocument();
      // Show all 버튼은 사라짐
      expect(screen.queryByText('Show all 150 lines')).not.toBeInTheDocument();
    });

    it('Collapse 버튼 클릭 시 코드가 다시 접힌다', () => {
      const longCode = generateLongCode(150);
      const block = createCodeBlock(longCode, 'javascript');

      render(<Code block={block} />);

      // Expand
      fireEvent.click(screen.getByText('Expand'));
      expect(screen.getByText('Collapse')).toBeInTheDocument();

      // Collapse
      fireEvent.click(screen.getByText('Collapse'));
      expect(screen.getByText('Expand')).toBeInTheDocument();
      expect(screen.getByText('Show all 150 lines')).toBeInTheDocument();
    });

    it('"Show all X lines" 버튼 클릭 시 코드가 확장된다', () => {
      const longCode = generateLongCode(150);
      const block = createCodeBlock(longCode, 'javascript');

      render(<Code block={block} />);

      // Show all 버튼 클릭
      fireEvent.click(screen.getByText('Show all 150 lines'));

      // 확장됨
      expect(screen.getByText('Collapse')).toBeInTheDocument();
    });
  });
});
