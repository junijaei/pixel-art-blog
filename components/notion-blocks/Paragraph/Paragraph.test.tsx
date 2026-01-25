import { Paragraph } from '@/components/notion-blocks/Paragraph/Paragraph';
import type { ParagraphBlock } from '@/types/notion';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('Paragraph', () => {
  it('renders plain text', () => {
    const block: ParagraphBlock = {
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            type: 'text',
            text: { content: 'Hello World', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'Hello World',
            href: null,
          },
        ],
        color: 'default',
      },
    };

    render(<Paragraph block={block} />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('renders with bold annotation', () => {
    const block: ParagraphBlock = {
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            type: 'text',
            text: { content: 'Bold Text', link: null },
            annotations: {
              bold: true,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'Bold Text',
            href: null,
          },
        ],
        color: 'default',
      },
    };

    render(<Paragraph block={block} />);
    const boldElement = screen.getByText('Bold Text');
    expect(boldElement).toBeInTheDocument();
    expect(boldElement.tagName).toBe('STRONG');
  });

  it('renders with italic annotation', () => {
    const block: ParagraphBlock = {
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            type: 'text',
            text: { content: 'Italic Text', link: null },
            annotations: {
              bold: false,
              italic: true,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'Italic Text',
            href: null,
          },
        ],
        color: 'default',
      },
    };

    render(<Paragraph block={block} />);
    const italicElement = screen.getByText('Italic Text');
    expect(italicElement).toBeInTheDocument();
    expect(italicElement.tagName).toBe('EM');
  });

  it('renders with code annotation', () => {
    const block: ParagraphBlock = {
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            type: 'text',
            text: { content: 'const code = true', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: true,
              color: 'default',
            },
            plain_text: 'const code = true',
            href: null,
          },
        ],
        color: 'default',
      },
    };

    render(<Paragraph block={block} />);
    const codeElement = screen.getByText('const code = true');
    expect(codeElement).toBeInTheDocument();
    expect(codeElement.tagName).toBe('CODE');
  });

  it('renders with link', () => {
    const block: ParagraphBlock = {
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            type: 'text',
            text: { content: 'Click here', link: { url: 'https://example.com' } },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'Click here',
            href: 'https://example.com',
          },
        ],
        color: 'default',
      },
    };

    render(<Paragraph block={block} />);
    const linkElement = screen.getByRole('link', { name: 'Click here' });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', 'https://example.com');
  });

  it('handles empty rich_text array', () => {
    const block: ParagraphBlock = {
      type: 'paragraph',
      paragraph: {
        rich_text: [],
        color: 'default',
      },
    };

    const { container } = render(<Paragraph block={block} />);
    const paragraph = container.querySelector('p');
    expect(paragraph).toBeInTheDocument();
    expect(paragraph?.textContent).toBe('');
  });

  it('applies correct color class', () => {
    const block: ParagraphBlock = {
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            type: 'text',
            text: { content: 'Colored text', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'blue',
            },
            plain_text: 'Colored text',
            href: null,
          },
        ],
        color: 'blue',
      },
    };

    const { container } = render(<Paragraph block={block} />);
    const paragraph = container.querySelector('p');
    expect(paragraph).toHaveClass('text-notion-blue');
  });
});
