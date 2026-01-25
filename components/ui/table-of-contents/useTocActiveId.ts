'use client';

import type { TocItem } from '@/components/ui/table-of-contents/TableOfContents';
import { useEffect, useState } from 'react';

/**
 * Custom hook to track which TOC item is currently in view
 * Uses IntersectionObserver to detect when headings enter/leave the viewport
 */
export function useTocActiveId(items: TocItem[]): string | undefined {
  const [activeId, setActiveId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first visible heading (from top)
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => {
            const aTop = a.boundingClientRect.top;
            const bTop = b.boundingClientRect.top;
            return aTop - bTop;
          });

        if (visibleEntries.length > 0) {
          setActiveId(visibleEntries[0].target.id);
        }
      },
      {
        // Observe when element is within the top 20% of viewport
        rootMargin: '-10% 0px -80% 0px',
        threshold: 0,
      }
    );

    // Observe all heading elements
    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [items]);

  return activeId;
}
