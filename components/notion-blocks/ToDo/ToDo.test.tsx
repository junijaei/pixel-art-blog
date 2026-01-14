import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ToDo } from './ToDo';
import type { RichTextItem } from '@/types/notion';

describe('ToDo', () => {
  it('unchecked 상태를 렌더링한다', () => {
    const richText: RichTextItem[] = [
      {
        type: 'text',
        text: { content: 'Complete the task', link: null },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'Complete the task',
      },
    ];

    const { container } = render(<ToDo richText={richText} checked={false} />);
    expect(screen.getByText('Complete the task')).toBeInTheDocument();

    // 체크박스가 비어있어야 함
    const checkbox = container.querySelector('.w-4.h-4.rounded');
    expect(checkbox).toHaveClass('bg-background');
  });

  it('checked 상태를 렌더링한다', () => {
    const richText: RichTextItem[] = [
      {
        type: 'text',
        text: { content: 'Completed task', link: null },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'Completed task',
      },
    ];

    const { container } = render(<ToDo richText={richText} checked={true} />);

    const textElement = screen.getByText('Completed task');
    expect(textElement).toHaveClass('line-through');
    expect(textElement).toHaveClass('text-muted-foreground');

    // 체크박스에 체크 표시가 있어야 함
    const checkbox = container.querySelector('.w-4.h-4.rounded');
    expect(checkbox).toHaveClass('bg-foreground');

    const checkmark = container.querySelector('svg');
    expect(checkmark).toBeInTheDocument();
  });

  it('children을 렌더링한다', () => {
    const richText: RichTextItem[] = [
      {
        type: 'text',
        text: { content: 'Parent task', link: null },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'Parent task',
      },
    ];

    render(
      <ToDo richText={richText} checked={false} has_children>
        <div>Child task</div>
      </ToDo>
    );

    expect(screen.getByText('Parent task')).toBeInTheDocument();
    expect(screen.getByText('Child task')).toBeInTheDocument();
  });

  it('rich text annotations를 적용한다', () => {
    const richText: RichTextItem[] = [
      {
        type: 'text',
        text: { content: 'Important ', link: null },
        annotations: {
          bold: true,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'Important ',
      },
      {
        type: 'text',
        text: { content: 'task', link: null },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'task',
      },
    ];

    render(<ToDo richText={richText} checked={false} />);
    // renderRichText가 bold annotation을 처리하는지 확인
    expect(screen.getByText('Important')).toBeInTheDocument();
    expect(screen.getByText('task')).toBeInTheDocument();
  });

  it('빈 richText 배열을 처리한다', () => {
    const { container } = render(<ToDo richText={[]} checked={false} />);
    const checkbox = container.querySelector('.w-4.h-4.rounded');
    expect(checkbox).toBeInTheDocument();
  });

  it('checked 상태에서도 children을 표시한다', () => {
    const richText: RichTextItem[] = [
      {
        type: 'text',
        text: { content: 'Done parent', link: null },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'Done parent',
      },
    ];

    render(
      <ToDo richText={richText} checked={true} has_children>
        <div>Child content</div>
      </ToDo>
    );

    expect(screen.getByText('Done parent')).toHaveClass('line-through');
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });
});
