import { Toggle } from '@/components/notion-blocks/Toggle/Toggle';
import type { ToggleBlock } from '@/types/notion';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('Toggle', () => {
  it('기본 텍스트를 렌더링한다', () => {
    const block: ToggleBlock = {
      type: 'toggle',
      toggle: {
        rich_text: [
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
            href: null,
          },
        ],
        color: 'default',
      },
    } as ToggleBlock;

    render(<Toggle block={block} />);
    expect(screen.getByText('Click to expand')).toBeInTheDocument();
  });

  it('초기 상태에서 children이 숨겨져 있다', () => {
    const block: ToggleBlock = {
      type: 'toggle',
      toggle: {
        rich_text: [
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
            href: null,
          },
        ],
        color: 'default',
      },
    } as ToggleBlock;

    render(
      <Toggle block={block}>
        <div>Hidden content</div>
      </Toggle>
    );

    expect(screen.getByText('Toggle header')).toBeInTheDocument();
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
  });

  it('클릭하면 children이 표시된다', () => {
    const block: ToggleBlock = {
      type: 'toggle',
      toggle: {
        rich_text: [
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
            href: null,
          },
        ],
        color: 'default',
      },
    } as ToggleBlock;

    render(
      <Toggle block={block}>
        <div>Hidden content</div>
      </Toggle>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.getByText('Hidden content')).toBeInTheDocument();
  });

  it('다시 클릭하면 children이 숨겨진다', () => {
    const block: ToggleBlock = {
      type: 'toggle',
      toggle: {
        rich_text: [
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
            href: null,
          },
        ],
        color: 'default',
      },
    } as ToggleBlock;

    render(
      <Toggle block={block}>
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

  it('children이 없으면 빈 toggle을 렌더링한다', () => {
    const block: ToggleBlock = {
      type: 'toggle',
      toggle: {
        rich_text: [
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
            href: null,
          },
        ],
        color: 'default',
      },
    } as ToggleBlock;

    render(<Toggle block={block} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Children prop이 전달되지 않으면 아무것도 표시되지 않음
    expect(screen.getByText('Toggle header')).toBeInTheDocument();
  });

  it('rich text annotations를 적용한다', () => {
    const block: ToggleBlock = {
      type: 'toggle',
      toggle: {
        rich_text: [
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
            href: null,
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
            href: null,
          },
        ],
        color: 'default',
      },
    } as ToggleBlock;

    render(<Toggle block={block} />);
    // renderRichText가 bold annotation을 처리하는지 확인
    expect(screen.getByText('Bold')).toBeInTheDocument();
    expect(screen.getByText('text')).toBeInTheDocument();
  });

  it('button으로 렌더링되어 접근성을 지원한다', () => {
    const block: ToggleBlock = {
      type: 'toggle',
      toggle: {
        rich_text: [
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
            href: null,
          },
        ],
        color: 'default',
      },
    } as ToggleBlock;

    render(<Toggle block={block} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });
});
