import { Bookmark } from '@/components/notion-blocks/Bookmark/Bookmark';
import { Table } from '@/components/notion-blocks/Table/Table';
import {
  createBookmarkBlock,
  createCodeBlock,
  createHeadingBlock,
  createImageBlock,
  createParagraphBlock,
  createRichText,
  createTableBlock,
} from '@/components/notion-blocks/__integration__/fixtures/helpers';
import type { DividerBlock } from '@/types/notion';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BlockRenderer } from '../BlockRenderer';

const childBlock = createParagraphBlock(createRichText('Nested child content'), 'default', {
  id: 'nested-child',
});

function expectCommonChildIndentation(text: string) {
  const childContainer = screen.getByText(text).closest('.ml-6');

  expect(childContainer).toBeInTheDocument();
  expect(childContainer).toHaveClass('mt-2', 'ml-6', 'space-y-1');
}

describe('All Notion block children rendering', () => {
  it.each([
    [
      'paragraph',
      createParagraphBlock(createRichText('Parent paragraph'), 'default', {
        has_children: true,
        children: [childBlock],
      }),
    ],
    [
      'heading',
      createHeadingBlock(2, createRichText('Parent heading'), 'default', {
        has_children: true,
        children: [childBlock],
      }),
    ],
    ['code', createCodeBlock('const parent = true;', 'typescript', [], { has_children: true, children: [childBlock] })],
    [
      'image',
      createImageBlock('https://example.com/image.png', 'external', 'Example image', [], {
        has_children: true,
        children: [childBlock],
      }),
    ],
  ])('renders children for %s blocks through BlockRenderer', async (_label, block) => {
    render(<BlockRenderer blocks={[block]} />);

    expect(await screen.findByText('Nested child content')).toBeInTheDocument();
    expectCommonChildIndentation('Nested child content');
  });

  it('renders children for divider blocks through BlockRenderer', () => {
    const dividerBlock: DividerBlock = {
      object: 'block',
      id: 'divider-parent',
      type: 'divider',
      created_time: '2026-01-14T00:00:00.000Z',
      last_edited_time: '2026-01-14T00:00:00.000Z',
      created_by: { object: 'user', id: 'user-1' },
      last_edited_by: { object: 'user', id: 'user-1' },
      has_children: true,
      archived: false,
      in_trash: false,
      parent: { type: 'page_id', page_id: 'page-1' },
      divider: {},
      children: [childBlock],
    };

    render(<BlockRenderer blocks={[dividerBlock]} />);

    expect(screen.getByText('Nested child content')).toBeInTheDocument();
    expectCommonChildIndentation('Nested child content');
  });

  it('renders bookmark children outside the bookmark link', () => {
    const block = createBookmarkBlock('https://example.com', [], { has_children: true, children: [childBlock] });

    const { container } = render(
      <Bookmark block={block}>
        <span>Bookmark child content</span>
      </Bookmark>
    );

    expect(screen.getByText('Bookmark child content')).toBeInTheDocument();
    expect(container.querySelector('a')?.textContent).not.toContain('Bookmark child content');
    expectCommonChildIndentation('Bookmark child content');
  });

  it('renders table children after the table markup when provided directly', () => {
    const block = createTableBlock([], { has_children: true });

    render(
      <Table block={block}>
        <span>Table child content</span>
      </Table>
    );

    expect(screen.getByText('Table child content')).toBeInTheDocument();
    expectCommonChildIndentation('Table child content');
  });
});
