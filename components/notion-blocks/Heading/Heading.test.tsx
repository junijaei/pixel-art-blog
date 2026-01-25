import { Heading } from '@/components/notion-blocks/Heading/Heading';
import type { HeadingBlock } from '@/types/notion';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('Heading', () => {
  it('renders h1 for heading_1', () => {
    const block: HeadingBlock = {
      type: 'heading_1',
      heading_1: {
        rich_text: [
          {
            type: 'text',
            text: { content: 'Heading 1', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'Heading 1',
            href: null,
          },
        ],
        color: 'default',
      },
    };

    const { container } = render(<Heading block={block} />);
    const h1 = container.querySelector('h1');
    expect(h1).toBeInTheDocument();
    expect(h1?.textContent).toBe('Heading 1');
  });

  it('renders h2 for heading_2', () => {
    const block: HeadingBlock = {
      type: 'heading_2',
      heading_2: {
        rich_text: [
          {
            type: 'text',
            text: { content: 'Heading 2', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'Heading 2',
            href: null,
          },
        ],
        color: 'default',
      },
    };

    const { container } = render(<Heading block={block} />);
    const h2 = container.querySelector('h2');
    expect(h2).toBeInTheDocument();
    expect(h2?.textContent).toBe('Heading 2');
  });

  it('renders h3 for heading_3', () => {
    const block: HeadingBlock = {
      type: 'heading_3',
      heading_3: {
        rich_text: [
          {
            type: 'text',
            text: { content: 'Heading 3', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'Heading 3',
            href: null,
          },
        ],
        color: 'default',
      },
    };

    const { container } = render(<Heading block={block} />);
    const h3 = container.querySelector('h3');
    expect(h3).toBeInTheDocument();
    expect(h3?.textContent).toBe('Heading 3');
  });

  it('applies correct font sizes', () => {
    const block1: HeadingBlock = {
      type: 'heading_1',
      heading_1: {
        rich_text: [
          {
            type: 'text',
            text: { content: 'H1', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'H1',
            href: null,
          },
        ],
        color: 'default',
      },
    };

    const { container: container1 } = render(<Heading block={block1} />);
    const h1 = container1.querySelector('h1');
    expect(h1).toHaveClass('text-4xl');

    const block2: HeadingBlock = {
      type: 'heading_2',
      heading_2: {
        rich_text: [
          {
            type: 'text',
            text: { content: 'H2', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'H2',
            href: null,
          },
        ],
        color: 'default',
      },
    };

    const { container: container2 } = render(<Heading block={block2} />);
    const h2 = container2.querySelector('h2');
    expect(h2).toHaveClass('text-3xl');

    const block3: HeadingBlock = {
      type: 'heading_3',
      heading_3: {
        rich_text: [
          {
            type: 'text',
            text: { content: 'H3', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'H3',
            href: null,
          },
        ],
        color: 'default',
      },
    };

    const { container: container3 } = render(<Heading block={block3} />);
    const h3 = container3.querySelector('h3');
    expect(h3).toHaveClass('text-2xl');
  });

  it('renders rich text with styles', () => {
    const block: HeadingBlock = {
      type: 'heading_2',
      heading_2: {
        rich_text: [
          {
            type: 'text',
            text: { content: 'Bold Heading', link: null },
            annotations: {
              bold: true,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'Bold Heading',
            href: null,
          },
        ],
        color: 'default',
      },
    };

    render(<Heading block={block} />);
    const boldElement = screen.getByText('Bold Heading');
    expect(boldElement).toBeInTheDocument();
    expect(boldElement.tagName).toBe('STRONG');
  });

  it('handles empty rich_text', () => {
    const block: HeadingBlock = {
      type: 'heading_2',
      heading_2: {
        rich_text: [],
        color: 'default',
      },
    };

    const { container } = render(<Heading block={block} />);
    const h2 = container.querySelector('h2');
    expect(h2).toBeInTheDocument();
    expect(h2?.textContent).toBe('');
  });
});
