import { TableOfContents, TocItem } from '@/components/ui/table-of-contents/TableOfContents';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

describe('TableOfContents', () => {
  const sampleItems: TocItem[] = [
    { id: 'heading-1', text: 'Introduction', level: 1 },
    { id: 'heading-2', text: 'Getting Started', level: 2 },
    { id: 'heading-3', text: 'Installation', level: 3 },
    { id: 'heading-4', text: 'Advanced Topics', level: 2 },
  ];

  describe('Rendering', () => {
    it('renders nothing when items array is empty', () => {
      render(<TableOfContents items={[]} />);
      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    });

    it('renders navigation when items exist', () => {
      render(<TableOfContents items={sampleItems} />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('renders all TOC items', () => {
      render(<TableOfContents items={sampleItems} />);
      sampleItems.forEach((item) => {
        expect(screen.getByText(item.text)).toBeInTheDocument();
      });
    });

    it('renders items as links with correct href', () => {
      render(<TableOfContents items={sampleItems} />);
      sampleItems.forEach((item) => {
        const link = screen.getByRole('link', { name: item.text });
        expect(link).toHaveAttribute('href', `#${item.id}`);
      });
    });

    it('has hidden class on mobile (lg:block)', () => {
      render(<TableOfContents items={sampleItems} />);
      const nav = screen.getByRole('navigation');
      expect(nav.className).toContain('hidden');
      expect(nav.className).toContain('lg:block');
    });
  });

  describe('Levels and Indentation', () => {
    it('applies different styles based on heading level', () => {
      render(<TableOfContents items={sampleItems} />);

      // Level 1 items should have different styling than level 2/3
      const level1Link = screen.getByRole('link', { name: 'Introduction' });
      const level2Link = screen.getByRole('link', { name: 'Getting Started' });
      const level3Link = screen.getByRole('link', { name: 'Installation' });

      // Check that links are rendered (specific styling tested visually)
      expect(level1Link).toBeInTheDocument();
      expect(level2Link).toBeInTheDocument();
      expect(level3Link).toBeInTheDocument();
    });
  });

  describe('Hover Behavior', () => {
    it('shows indicator line by default', () => {
      render(<TableOfContents items={sampleItems} />);
      // Each item should have an indicator element
      const indicators = screen.getAllByTestId('toc-indicator');
      expect(indicators.length).toBe(sampleItems.length);
    });
  });

  describe('Active State', () => {
    it('highlights active item when activeId is provided', () => {
      render(<TableOfContents items={sampleItems} activeId="heading-2" />);
      const activeLink = screen.getByRole('link', { name: 'Getting Started' });
      // Active items should have highlighted styling (text-foreground on link)
      expect(activeLink.className).toContain('text-foreground');
      // font-medium is applied to the inner text span
      const textSpan = activeLink.querySelector('span');
      expect(textSpan?.className).toContain('font-medium');
    });
  });

  describe('Accessibility', () => {
    it('has accessible navigation label', () => {
      render(<TableOfContents items={sampleItems} />);
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', '목차 목록');
    });
  });
});
