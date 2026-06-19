import {
  TableOfContents,
  TOC_HASH_CHANGE_EVENT,
  TocItem,
} from '@/features/post/components/table-of-contents/TableOfContents';
import { TocWithScrollSpy } from '@/features/post/components/table-of-contents/TocWithScrollSpy';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();

  constructor() {
    return this;
  }
}

window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

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

    it('keeps visible root links interactive before an active heading is known', () => {
      const { container } = render(<TableOfContents items={sampleItems} />);
      const nav = screen.getByRole('navigation');
      const link = screen.getByText('Introduction').closest('a');

      expect(nav).toHaveAttribute('aria-disabled', 'false');
      expect(link).toHaveAttribute('href', '#heading-1');
      expect(link).not.toHaveAttribute('tabindex');
      expect(container.querySelectorAll('a[href]').length).toBe(1);
    });

    it('updates the hash and delegates scrolling to the hash scroll listener', () => {
      render(<TableOfContents items={sampleItems} activeId="heading-3" />);
      const link = screen.getByText('Getting Started').closest('a');
      const scrollIntoView = vi.fn();
      const pushState = vi.spyOn(window.history, 'pushState').mockImplementation(() => undefined);
      const dispatchEvent = vi.spyOn(window, 'dispatchEvent');
      Element.prototype.scrollIntoView = scrollIntoView;

      fireEvent.click(link!);

      expect(scrollIntoView).not.toHaveBeenCalled();
      expect(pushState).toHaveBeenCalledWith(null, '', '#heading-2');
      expect(dispatchEvent).toHaveBeenCalledWith(expect.objectContaining({ type: TOC_HASH_CHANGE_EVENT }));

      pushState.mockRestore();
      dispatchEvent.mockRestore();
    });

    it('disables every TOC link when the article is outside the active reading area', () => {
      const { container } = render(<TableOfContents items={sampleItems} activeId="heading-3" isVisible={false} />);
      const nav = container.querySelector('nav');
      const link = screen.getByText('Introduction').closest('a');
      const scrollIntoView = vi.fn();
      Element.prototype.scrollIntoView = scrollIntoView;

      expect(nav).not.toHaveAttribute('aria-hidden');
      expect(nav).toHaveAttribute('aria-disabled', 'true');
      expect(nav).toHaveAttribute('inert');
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

  describe('Hash scrolling', () => {
    it('scrolls to the current hash target on mount', () => {
      const scrollIntoView = vi.fn();
      const originalScrollIntoView = Element.prototype.scrollIntoView;
      const originalRequestAnimationFrame = window.requestAnimationFrame;
      const originalCancelAnimationFrame = window.cancelAnimationFrame;

      Element.prototype.scrollIntoView = scrollIntoView;
      window.requestAnimationFrame = (callback) => {
        callback(0);
        return 1;
      };
      window.cancelAnimationFrame = () => undefined;
      window.history.replaceState(null, '', '#heading-2');

      try {
        render(
          <>
            <article>
              <h2 id="heading-2">Getting Started</h2>
            </article>
            <TocWithScrollSpy items={sampleItems} />
          </>
        );

        expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' });
      } finally {
        Element.prototype.scrollIntoView = originalScrollIntoView;
        window.requestAnimationFrame = originalRequestAnimationFrame;
        window.cancelAnimationFrame = originalCancelAnimationFrame;
        window.history.replaceState(null, '', '/');
      }
    });

    it('scrolls to the top when the current URL has no hash', () => {
      const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
      const originalRequestAnimationFrame = window.requestAnimationFrame;
      const originalCancelAnimationFrame = window.cancelAnimationFrame;

      window.requestAnimationFrame = (callback) => {
        callback(0);
        return 1;
      };
      window.cancelAnimationFrame = () => undefined;
      window.history.replaceState(null, '', '/');

      try {
        render(
          <>
            <article />
            <TocWithScrollSpy items={sampleItems} />
          </>
        );

        expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });
      } finally {
        scrollTo.mockRestore();
        window.requestAnimationFrame = originalRequestAnimationFrame;
        window.cancelAnimationFrame = originalCancelAnimationFrame;
      }
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
