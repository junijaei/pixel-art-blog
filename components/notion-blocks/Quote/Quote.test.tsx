import { Quote } from '@/components/notion-blocks/Quote/Quote';
import type { QuoteBlock } from '@/types/notion';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('Quote', () => {
  it('renders plain text', () => {
    const block: QuoteBlock = {
      type: 'quote',
      quote: {
        rich_text: [
          {
            type: 'text',
            text: { content: 'This is a quote', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'This is a quote',
            href: null,
          },
        ],
        color: 'default',
      },
    };

    render(<Quote block={block} />);
    expect(screen.getByText('This is a quote')).toBeInTheDocument();
  });

  it('renders as blockquote element', () => {
    const block: QuoteBlock = {
      type: 'quote',
      quote: {
        rich_text: [
          {
            type: 'text',
            text: { content: 'Quote text', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'Quote text',
            href: null,
          },
        ],
        color: 'default',
      },
    };

    const { container } = render(<Quote block={block} />);
    const blockquote = container.querySelector('blockquote');
    expect(blockquote).toBeInTheDocument();
  });

  it('has left border styling', () => {
    const block: QuoteBlock = {
      type: 'quote',
      quote: {
        rich_text: [
          {
            type: 'text',
            text: { content: 'Styled quote', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'Styled quote',
            href: null,
          },
        ],
        color: 'default',
      },
    };

    const { container } = render(<Quote block={block} />);
    const blockquote = container.querySelector('blockquote');
    expect(blockquote).toHaveClass('border-l-4');
  });

  it('renders with bold annotation', () => {
    const block: QuoteBlock = {
      type: 'quote',
      quote: {
        rich_text: [
          {
            type: 'text',
            text: { content: 'Bold quote', link: null },
            annotations: {
              bold: true,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'Bold quote',
            href: null,
          },
        ],
        color: 'default',
      },
    };

    render(<Quote block={block} />);
    const boldElement = screen.getByText('Bold quote');
    expect(boldElement.tagName).toBe('STRONG');
  });

  it('handles empty rich_text', () => {
    const block: QuoteBlock = {
      type: 'quote',
      quote: {
        rich_text: [],
        color: 'default',
      },
    };

    const { container } = render(<Quote block={block} />);
    const blockquote = container.querySelector('blockquote');
    expect(blockquote).toBeInTheDocument();
  });
});
