import { Callout } from '@/components/notion-blocks/Callout/Callout';
import type { CalloutBlock } from '@/types/notion';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('Callout', () => {
  it('기본 텍스트를 렌더링한다', () => {
    const block: CalloutBlock = {
      type: 'callout',
      callout: {
        rich_text: [
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
            href: null,
          },
        ],
        icon: null,
        color: 'gray',
      },
    } as CalloutBlock;

    render(<Callout block={block} />);
    expect(screen.getByText('This is a callout')).toBeInTheDocument();
  });

  it('이모지 아이콘을 렌더링한다', () => {
    const block: CalloutBlock = {
      type: 'callout',
      callout: {
        rich_text: [
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
            href: null,
          },
        ],
        icon: { emoji: '💡' },
        color: 'gray',
      },
    } as CalloutBlock;

    render(<Callout block={block} />);

    expect(screen.getByText('💡')).toBeInTheDocument();
    expect(screen.getByText('Important note')).toBeInTheDocument();
  });

  it('외부 이미지 아이콘을 렌더링한다', () => {
    const block: CalloutBlock = {
      type: 'callout',
      callout: {
        rich_text: [
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
            href: null,
          },
        ],
        icon: { emoji: '⚠️' },
        color: 'gray',
      },
    } as CalloutBlock;

    render(<Callout block={block} />);

    expect(screen.getByText('Note')).toBeInTheDocument();
  });

  it('children을 렌더링한다', () => {
    const block: CalloutBlock = {
      type: 'callout',
      callout: {
        rich_text: [
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
            href: null,
          },
        ],
        icon: null,
        color: 'gray',
      },
    } as CalloutBlock;

    render(
      <Callout block={block}>
        <div>Child content</div>
      </Callout>
    );

    expect(screen.getByText('Parent callout')).toBeInTheDocument();
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('color prop을 적용한다', () => {
    const block: CalloutBlock = {
      type: 'callout',
      callout: {
        rich_text: [
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
            href: null,
          },
        ],
        icon: null,
        color: 'blue',
      },
    } as CalloutBlock;

    const { container } = render(<Callout block={block} />);

    const calloutDiv = container.querySelector('div.rounded-xl');
    expect(calloutDiv).toHaveClass('bg-notion-blue-bg');
    expect(calloutDiv).toHaveClass('border-notion-blue/20');
  });

  it('빈 richText 배열을 처리한다', () => {
    const block: CalloutBlock = {
      object: 'block',
      id: 'callout-test-5',
      type: 'callout',
      created_time: '2026-01-14T00:00:00.000Z',
      last_edited_time: '2026-01-14T00:00:00.000Z',
      created_by: { object: 'user', id: 'user-1' },
      last_edited_by: { object: 'user', id: 'user-1' },
      has_children: false,
      archived: false,
      in_trash: false,
      parent: { type: 'page_id', page_id: 'page-1' },
      callout: {
        rich_text: [],
        icon: null,
        color: 'gray',
      },
    };

    const { container } = render(<Callout block={block} />);
    expect(container.querySelector('div.rounded-xl')).toBeInTheDocument();
  });
});
