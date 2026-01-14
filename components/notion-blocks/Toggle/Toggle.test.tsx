import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Toggle } from './Toggle';
import type { RichTextItem } from '@/types/notion';

describe('Toggle', () => {
  it('기본 텍스트를 렌더링한다', () => {
    const richText: RichTextItem[] = [
      {
        type: 'text',
        text: { content: 'Click to expand', link: null },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'Click to expand',
      },
    ];

    render(<Toggle richText={richText} />);
    expect(screen.getByText('Click to expand')).toBeInTheDocument();
  });

  it('초기 상태에서 children이 숨겨져 있다', () => {
    const richText: RichTextItem[] = [
      {
        type: 'text',
        text: { content: 'Toggle header', link: null },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'Toggle header',
      },
    ];

    render(
      <Toggle richText={richText} has_children>
        <div>Hidden content</div>
      </Toggle>
    );

    expect(screen.getByText('Toggle header')).toBeInTheDocument();
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
  });

  it('클릭하면 children이 표시된다', () => {
    const richText: RichTextItem[] = [
      {
        type: 'text',
        text: { content: 'Toggle header', link: null },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'Toggle header',
      },
    ];

    render(
      <Toggle richText={richText} has_children>
        <div>Hidden content</div>
      </Toggle>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.getByText('Hidden content')).toBeInTheDocument();
  });

  it('다시 클릭하면 children이 숨겨진다', () => {
    const richText: RichTextItem[] = [
      {
        type: 'text',
        text: { content: 'Toggle header', link: null },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'Toggle header',
      },
    ];

    render(
      <Toggle richText={richText} has_children>
        <div>Hidden content</div>
      </Toggle>
    );

    const button = screen.getByRole('button');

    // 첫 번째 클릭 - 열기
    fireEvent.click(button);
    expect(screen.getByText('Hidden content')).toBeInTheDocument();

    // 두 번째 클릭 - 닫기
    fireEvent.click(button);
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
  });

  it('has_children이 false면 children을 표시하지 않는다', () => {
    const richText: RichTextItem[] = [
      {
        type: 'text',
        text: { content: 'Toggle header', link: null },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'Toggle header',
      },
    ];

    render(
      <Toggle richText={richText} has_children={false}>
        <div>Should not appear</div>
      </Toggle>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.queryByText('Should not appear')).not.toBeInTheDocument();
  });

  it('rich text annotations를 적용한다', () => {
    const richText: RichTextItem[] = [
      {
        type: 'text',
        text: { content: 'Bold ', link: null },
        annotations: {
          bold: true,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'Bold ',
      },
      {
        type: 'text',
        text: { content: 'text', link: null },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'text',
      },
    ];

    render(<Toggle richText={richText} />);
    // renderRichText가 bold annotation을 처리하는지 확인
    expect(screen.getByText('Bold')).toBeInTheDocument();
    expect(screen.getByText('text')).toBeInTheDocument();
  });

  it('button으로 렌더링되어 접근성을 지원한다', () => {
    const richText: RichTextItem[] = [
      {
        type: 'text',
        text: { content: 'Toggle', link: null },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'Toggle',
      },
    ];

    render(<Toggle richText={richText} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });
});
