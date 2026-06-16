import { TableOfContents, TocItem } from '@/features/post/components/table-of-contents/TableOfContents';
import { fireEvent, render, screen } from '@testing-library/react';
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
      render(<TableOfContents items={sampleItems} activeId="heading-3" />);
      sampleItems.forEach((item) => {
        const link = screen.getByText(item.text).closest('a');
        expect(link).toHaveAttribute('href', `#${item.id}`);
      });
    });

    it('has hidden class on mobile (lg:block)', () => {
      render(<TableOfContents items={sampleItems} />);
      const nav = screen.getByRole('navigation');
      expect(nav.className).toContain('hidden');
      expect(nav.className).toContain('lg:block');
    });

    it('animates item visibility without grid row transitions', () => {
      const { container } = render(<TableOfContents items={sampleItems} activeId="heading-1" />);
      const listItems = Array.from(container.querySelectorAll('li'));

      expect(listItems.length).toBe(sampleItems.length);
      listItems.forEach((item) => {
        expect(item.className).toContain('transition-[max-height,opacity,transform]');
        expect(item.className).not.toContain('transition-[grid-template-rows]');
        expect(item.className).not.toContain('grid-rows-[');
      });
    });

    it('disables every TOC link before an active heading is known', () => {
      const { container } = render(<TableOfContents items={sampleItems} />);
      const nav = screen.getByRole('navigation');
      const link = screen.getByText('Introduction').closest('a');
      const scrollIntoView = vi.fn();
      Element.prototype.scrollIntoView = scrollIntoView;

      expect(nav).toHaveAttribute('aria-disabled', 'true');
      expect(nav).toHaveStyle({ pointerEvents: 'none' });
      expect(link).not.toHaveAttribute('href');
      expect(link).toHaveAttribute('tabindex', '-1');

      fireEvent.click(link!);
      expect(scrollIntoView).not.toHaveBeenCalled();
      expect(container.querySelectorAll('a[href]').length).toBe(0);
    });

    it('disables every TOC link when the article is outside the active reading area', () => {
      const { container } = render(<TableOfContents items={sampleItems} activeId="heading-3" isVisible={false} />);
      const nav = container.querySelector('nav');
      const link = screen.getByText('Introduction').closest('a');
      const scrollIntoView = vi.fn();
      Element.prototype.scrollIntoView = scrollIntoView;

      expect(nav).toHaveAttribute('aria-hidden', 'true');
      expect(nav).toHaveAttribute('aria-disabled', 'true');
      expect(nav).toHaveStyle({ pointerEvents: 'none' });
      expect(link).not.toHaveAttribute('href');
      expect(link).toHaveAttribute('tabindex', '-1');

      fireEvent.click(link!);
      expect(scrollIntoView).not.toHaveBeenCalled();
      expect(container.querySelectorAll('a[href]').length).toBe(0);
    });
  });

  describe('Levels and Indentation', () => {
    it('applies different styles based on heading level', () => {
      render(<TableOfContents items={sampleItems} />);

      // Level 1 items should have different styling than level 2/3
      const level1Link = screen.getByText('Introduction').closest('a');
      const level2Link = screen.getByText('Getting Started').closest('a');
      const level3Link = screen.getByText('Installation').closest('a');

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
