import { createMockNumberListBlock as createMockBlock } from '@/__test__/fixture';
import { NumberedListItem } from '@/components/notion-blocks/NumberedListItem/NumberedListItem';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

// 테스트용 mock 블록 생성 헬퍼

describe('NumberedListItem', () => {
  it('renders plain text', () => {
    const block = createMockBlock('First item');

    const { container } = render(<NumberedListItem block={block} index={0} />);
    const li = container.querySelector('li');
    expect(li).toBeInTheDocument();
    expect(li?.textContent).toContain('First item');
  });

  it('renders with flex layout and number', () => {
    const block = createMockBlock('Numbered item');

    const { container } = render(<NumberedListItem block={block} index={0} />);
    const li = container.querySelector('li');
    expect(li).toHaveClass('flex');
    expect(li).toHaveClass('items-start');
    expect(li?.textContent).toContain('1');
  });

  it('renders with bold annotation', () => {
    const block = createMockBlock('Bold item', { bold: true });

    render(<NumberedListItem block={block} index={0} />);
    const boldElement = screen.getByText('Bold item');
    expect(boldElement).toBeInTheDocument();
    expect(boldElement.tagName).toBe('STRONG');
  });

  it('handles empty rich_text', () => {
    const block = createMockBlock('');

    const { container } = render(<NumberedListItem block={block} index={0} />);
    const li = container.querySelector('li');
    expect(li).toBeInTheDocument();
  });

  it('applies correct color class', () => {
    const block = createMockBlock('Blue item', { color: 'blue' });

    const { container } = render(<NumberedListItem block={block} index={0} />);
    const li = container.querySelector('li');
    expect(li).toHaveClass('text-notion-blue');
  });
});
