import type { NumberedListBlock } from '@/types/notion';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NumberedListItem } from './NumberedListItem';

describe('NumberedListItem', () => {
  it('renders plain text', () => {
    const block: NumberedListBlock = {
      type: 'numbered_list_item',
      numbered_list_item: {
        rich_text: [
          {
            type: 'text',
            text: { content: 'First item', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'First item',
            href: null,
          },
        ],
        color: 'default',
        children: [],
      },
      has_children: false,
    };

    const { container } = render(<NumberedListItem block={block} index={0} />);
    const li = container.querySelector('li');
    expect(li).toBeInTheDocument();
    expect(li?.textContent).toContain('First item');
  });

  it('renders with flex layout and number', () => {
    const block: NumberedListBlock = {
      type: 'numbered_list_item',
      numbered_list_item: {
        rich_text: [
          {
            type: 'text',
            text: { content: 'Numbered item', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'Numbered item',
            href: null,
          },
        ],
        color: 'default',
        children: [],
      },
      has_children: false,
    };

    const { container } = render(<NumberedListItem block={block} index={0} />);
    const li = container.querySelector('li');
    expect(li).toHaveClass('flex');
    expect(li).toHaveClass('items-start');
    expect(li?.textContent).toContain('1');
  });

  it('renders with bold annotation', () => {
    const block: NumberedListBlock = {
      type: 'numbered_list_item',
      numbered_list_item: {
        rich_text: [
          {
            type: 'text',
            text: { content: 'Bold item', link: null },
            annotations: {
              bold: true,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'Bold item',
            href: null,
          },
        ],
        color: 'default',
        children: [],
      },
      has_children: false,
    };

    render(<NumberedListItem block={block} index={0} />);
    const boldElement = screen.getByText('Bold item');
    expect(boldElement).toBeInTheDocument();
    expect(boldElement.tagName).toBe('STRONG');
  });

  it('handles empty rich_text', () => {
    const block: NumberedListBlock = {
      type: 'numbered_list_item',
      numbered_list_item: {
        rich_text: [],
        color: 'default',
        children: [],
      },
      has_children: false,
    };

    const { container } = render(<NumberedListItem block={block} index={0} />);
    const li = container.querySelector('li');
    expect(li).toBeInTheDocument();
  });

  it('applies correct color class', () => {
    const block: NumberedListBlock = {
      type: 'numbered_list_item',
      numbered_list_item: {
        rich_text: [
          {
            type: 'text',
            text: { content: 'Blue item', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'blue',
            },
            plain_text: 'Blue item',
            href: null,
          },
        ],
        color: 'blue',
        children: [],
      },
      has_children: false,
    };

    const { container } = render(<NumberedListItem block={block} index={0} />);
    const li = container.querySelector('li');
    expect(li).toHaveClass('text-blue-700');
  });
});
