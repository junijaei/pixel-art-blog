import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BulletedListItem } from './BulletedListItem';
import type { BulletedListItemBlock } from './types';

describe('BulletedListItem', () => {
  it('renders plain text', () => {
    const block: BulletedListItemBlock = {
      type: 'bulleted_list_item',
      bulleted_list_item: {
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

    const { container } = render(<BulletedListItem block={block} />);
    const li = container.querySelector('li');
    expect(li).toBeInTheDocument();
    expect(li?.textContent).toContain('First item');
  });

  it('renders with flex layout and dot icon', () => {
    const block: BulletedListItemBlock = {
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: [
          {
            type: 'text',
            text: { content: 'Bullet item', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'Bullet item',
            href: null,
          },
        ],
        color: 'default',
        children: [],
      },
      has_children: false,
    };

    const { container } = render(<BulletedListItem block={block} />);
    const li = container.querySelector('li');
    expect(li).toHaveClass('flex');
    expect(li).toHaveClass('items-start');
  });

  it('renders with bold annotation', () => {
    const block: BulletedListItemBlock = {
      type: 'bulleted_list_item',
      bulleted_list_item: {
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

    render(<BulletedListItem block={block} />);
    const boldElement = screen.getByText('Bold item');
    expect(boldElement).toBeInTheDocument();
    expect(boldElement.tagName).toBe('STRONG');
  });

  it('handles empty rich_text', () => {
    const block: BulletedListItemBlock = {
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: [],
        color: 'default',
        children: [],
      },
      has_children: false,
    };

    const { container } = render(<BulletedListItem block={block} />);
    const li = container.querySelector('li');
    expect(li).toBeInTheDocument();
  });

  it('handles has_children flag', () => {
    const block: BulletedListItemBlock = {
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: [
          {
            type: 'text',
            text: { content: 'Parent item', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'Parent item',
            href: null,
          },
        ],
        color: 'default',
        children: [],
      },
      has_children: true,
    };

    const { container } = render(<BulletedListItem block={block} />);
    const li = container.querySelector('li');
    expect(li).toBeInTheDocument();
    expect(li?.textContent).toContain('Parent item');
  });

  it('applies correct color class', () => {
    const block: BulletedListItemBlock = {
      type: 'bulleted_list_item',
      bulleted_list_item: {
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

    const { container } = render(<BulletedListItem block={block} />);
    const li = container.querySelector('li');
    expect(li).toHaveClass('text-blue-600');
  });
});
