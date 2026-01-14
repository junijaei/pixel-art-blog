import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Callout } from './Callout';
import type { RichTextItem } from '@/types/notion';

describe('Callout', () => {
  it('기본 텍스트를 렌더링한다', () => {
    const richText: RichTextItem[] = [
      {
        type: 'text',
        text: { content: 'This is a callout', link: null },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'This is a callout',
      },
    ];

    render(<Callout richText={richText} />);
    expect(screen.getByText('This is a callout')).toBeInTheDocument();
  });

  it('이모지 아이콘을 렌더링한다', () => {
    const richText: RichTextItem[] = [
      {
        type: 'text',
        text: { content: 'Important note', link: null },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'Important note',
      },
    ];

    render(
      <Callout
        richText={richText}
        icon={{ type: 'emoji', emoji: '💡' }}
      />
    );

    expect(screen.getByText('💡')).toBeInTheDocument();
    expect(screen.getByText('Important note')).toBeInTheDocument();
  });

  it('외부 이미지 아이콘을 렌더링한다', () => {
    const richText: RichTextItem[] = [
      {
        type: 'text',
        text: { content: 'Note', link: null },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'Note',
      },
    ];

    const { container } = render(
      <Callout
        richText={richText}
        icon={{ type: 'external', external: { url: 'https://example.com/icon.png' } }}
      />
    );

    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/icon.png');
  });

  it('children을 렌더링한다', () => {
    const richText: RichTextItem[] = [
      {
        type: 'text',
        text: { content: 'Parent callout', link: null },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'Parent callout',
      },
    ];

    render(
      <Callout richText={richText} has_children>
        <div>Child content</div>
      </Callout>
    );

    expect(screen.getByText('Parent callout')).toBeInTheDocument();
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('color prop을 적용한다', () => {
    const richText: RichTextItem[] = [
      {
        type: 'text',
        text: { content: 'Colored callout', link: null },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'Colored callout',
      },
    ];

    const { container } = render(
      <Callout richText={richText} color="blue" />
    );

    const calloutDiv = container.querySelector('div.rounded-xl');
    expect(calloutDiv).toHaveClass('bg-muted/60');
    expect(calloutDiv).toHaveClass('border-muted-foreground/30');
  });

  it('빈 richText 배열을 처리한다', () => {
    const { container } = render(<Callout richText={[]} />);
    expect(container.querySelector('div.rounded-xl')).toBeInTheDocument();
  });
});
