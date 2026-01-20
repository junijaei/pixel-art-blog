import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Image } from './Image';
import type { ImageBlock } from '@/types/notion';

describe('Image', () => {
  it('renders image from external URL', () => {
    const block: ImageBlock = {
      object: 'block',
      id: 'test-image-1',
      type: 'image',
      image: {
        type: 'external',
        external: {
          url: 'https://example.com/image.png',
        },
        name: 'Test image',
      },
      parent: {
        type: 'page_id',
        page_id: 'test-page',
      },
      created_time: '2024-01-01T00:00:00.000Z',
      last_edited_time: '2024-01-01T00:00:00.000Z',
      has_children: false,
      archived: false,
    };

    render(<Image block={block} />);

    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/image.png');
    expect(img).toHaveAttribute('alt', 'Test image');
  });

  it('renders image from file URL', () => {
    const block: ImageBlock = {
      object: 'block',
      id: 'test-image-2',
      type: 'image',
      image: {
        type: 'file',
        file: {
          url: 'https://s3.amazonaws.com/notion/image.png',
          expiry_time: '2024-12-31T23:59:59.000Z',
        },
        name: 'Notion file',
      },
      parent: {
        type: 'page_id',
        page_id: 'test-page',
      },
      created_time: '2024-01-01T00:00:00.000Z',
      last_edited_time: '2024-01-01T00:00:00.000Z',
      has_children: false,
      archived: false,
    };

    render(<Image block={block} />);

    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://s3.amazonaws.com/notion/image.png');
  });

  it('renders with caption', () => {
    const block: ImageBlock = {
      object: 'block',
      id: 'test-image-3',
      type: 'image',
      image: {
        type: 'external',
        external: {
          url: 'https://example.com/image.png',
        },
        name: 'Test image',
        caption: [
          {
            type: 'text',
            text: { content: 'This is a caption', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'This is a caption',
            href: null,
          },
        ],
      },
      parent: {
        type: 'page_id',
        page_id: 'test-page',
      },
      created_time: '2024-01-01T00:00:00.000Z',
      last_edited_time: '2024-01-01T00:00:00.000Z',
      has_children: false,
      archived: false,
    };

    render(<Image block={block} />);

    expect(screen.getByText('This is a caption')).toBeInTheDocument();
  });

  it('renders without caption if caption array is empty', () => {
    const block: ImageBlock = {
      object: 'block',
      id: 'test-image-4',
      type: 'image',
      image: {
        type: 'external',
        external: {
          url: 'https://example.com/image.png',
        },
        name: 'Test image',
        caption: [],
      },
      parent: {
        type: 'page_id',
        page_id: 'test-page',
      },
      created_time: '2024-01-01T00:00:00.000Z',
      last_edited_time: '2024-01-01T00:00:00.000Z',
      has_children: false,
      archived: false,
    };

    const { container } = render(<Image block={block} />);

    const figcaption = container.querySelector('figcaption');
    expect(figcaption).not.toBeInTheDocument();
  });

  it('uses empty string as alt text when name is not provided', () => {
    const block: ImageBlock = {
      object: 'block',
      id: 'test-image-5',
      type: 'image',
      image: {
        type: 'external',
        external: {
          url: 'https://example.com/image.png',
        },
      },
      parent: {
        type: 'page_id',
        page_id: 'test-page',
      },
      created_time: '2024-01-01T00:00:00.000Z',
      last_edited_time: '2024-01-01T00:00:00.000Z',
      has_children: false,
      archived: false,
    };

    const { container } = render(<Image block={block} />);

    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('alt', '');
  });

  it('applies loading="lazy" attribute', () => {
    const block: ImageBlock = {
      object: 'block',
      id: 'test-image-6',
      type: 'image',
      image: {
        type: 'external',
        external: {
          url: 'https://example.com/image.png',
        },
        name: 'Test image',
      },
      parent: {
        type: 'page_id',
        page_id: 'test-page',
      },
      created_time: '2024-01-01T00:00:00.000Z',
      last_edited_time: '2024-01-01T00:00:00.000Z',
      has_children: false,
      archived: false,
    };

    render(<Image block={block} />);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('loading', 'lazy');
  });

  it('renders figure element with proper structure', () => {
    const block: ImageBlock = {
      object: 'block',
      id: 'test-image-7',
      type: 'image',
      image: {
        type: 'external',
        external: {
          url: 'https://example.com/image.png',
        },
        name: 'Test image',
      },
      parent: {
        type: 'page_id',
        page_id: 'test-page',
      },
      created_time: '2024-01-01T00:00:00.000Z',
      last_edited_time: '2024-01-01T00:00:00.000Z',
      has_children: false,
      archived: false,
    };

    const { container } = render(<Image block={block} />);

    const figure = container.querySelector('figure');
    expect(figure).toBeInTheDocument();

    const img = figure?.querySelector('img');
    expect(img).toBeInTheDocument();
  });
});
