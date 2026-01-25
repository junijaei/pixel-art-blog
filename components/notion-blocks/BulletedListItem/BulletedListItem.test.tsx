import { BulletedListItem } from '@/components/notion-blocks/BulletedListItem/BulletedListItem';
import type { BulletedListBlock, RichText } from '@/types/notion';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

// 테스트용 mock 블록 생성 헬퍼
function createMockBlock(
  richTextContent: string,
  options: {
    bold?: boolean;
    color?: string;
    hasChildren?: boolean;
  } = {}
): BulletedListBlock {
  const { bold = false, color = 'default', hasChildren = false } = options;
  return {
    type: 'bulleted_list_item',
    bulleted_list_item: {
      rich_text: richTextContent
        ? [
            {
              type: 'text',
              text: { content: richTextContent, link: null },
              annotations: {
                bold,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: richTextContent,
              href: null,
            } as RichText,
          ]
        : [],
      color,
    },
    has_children: hasChildren,
  } as BulletedListBlock;
}

describe('BulletedListItem', () => {
  it('renders plain text', () => {
    const block = createMockBlock('First item');

    const { container } = render(<BulletedListItem block={block} />);
    const li = container.querySelector('li');
    expect(li).toBeInTheDocument();
    expect(li?.textContent).toContain('First item');
  });

  it('renders with flex layout and dot icon', () => {
    const block = createMockBlock('Bullet item');

    const { container } = render(<BulletedListItem block={block} />);
    const li = container.querySelector('li');
    expect(li).toHaveClass('flex');
    expect(li).toHaveClass('items-start');
  });

  it('renders with bold annotation', () => {
    const block = createMockBlock('Bold item', { bold: true });

    render(<BulletedListItem block={block} />);
    const boldElement = screen.getByText('Bold item');
    expect(boldElement).toBeInTheDocument();
    expect(boldElement.tagName).toBe('STRONG');
  });

  it('handles empty rich_text', () => {
    const block = createMockBlock('');

    const { container } = render(<BulletedListItem block={block} />);
    const li = container.querySelector('li');
    expect(li).toBeInTheDocument();
  });

  it('handles has_children flag', () => {
    const block = createMockBlock('Parent item', { hasChildren: true });

    const { container } = render(<BulletedListItem block={block} />);
    const li = container.querySelector('li');
    expect(li).toBeInTheDocument();
    expect(li?.textContent).toContain('Parent item');
  });

  it('applies correct color class', () => {
    const block = createMockBlock('Blue item', { color: 'blue' });

    const { container } = render(<BulletedListItem block={block} />);
    const li = container.querySelector('li');
    expect(li).toHaveClass('text-notion-blue');
  });
});
