'use client';

import {
  TableOfContents,
  TOC_HASH_CHANGE_EVENT,
  type TocItem,
} from '@/features/post/components/table-of-contents/TableOfContents';
import { useTocActiveId } from '@/features/post/components/table-of-contents/useTocActiveId';
import { useEffect, useState } from 'react';

const HASH_SCROLL_SETTLE_DELAYS = [0, 100, 300, 700] as const;

export interface TocWithScrollSpyProps {
  items: TocItem[];
  className?: string;
}

/**
 * TableOfContents wrapper with scroll spy functionality
 * Automatically tracks and highlights the active heading
 */
export function TocWithScrollSpy({ items, className }: TocWithScrollSpyProps) {
  const activeId = useTocActiveId(items);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeoutIds = new Set<number>();
    let frameId: number | null = null;

    const getHashTargetId = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) return '';

      try {
        return decodeURIComponent(hash);
      } catch {
        return hash;
      }
    };

    const scrollToCurrentHash = (behavior: ScrollBehavior) => {
      const targetId = getHashTargetId();

      if (!targetId) {
        window.scrollTo({ top: 0, behavior });
        return;
      }

      document.getElementById(targetId)?.scrollIntoView({ behavior, block: 'start' });
    };

    const scheduleHashScroll = (behavior: ScrollBehavior) => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timeoutIds.clear();

      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        scrollToCurrentHash(behavior);

        if (behavior !== 'auto' || !window.location.hash) return;

        HASH_SCROLL_SETTLE_DELAYS.slice(1).forEach((delay) => {
          const timeoutId = window.setTimeout(() => {
            timeoutIds.delete(timeoutId);
            scrollToCurrentHash('auto');
          }, delay);
          timeoutIds.add(timeoutId);
        });
      });
    };

    const handleHashChange = () => {
      scheduleHashScroll('smooth');
    };

    scheduleHashScroll('auto');

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    window.addEventListener(TOC_HASH_CHANGE_EVENT, handleHashChange);

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
      window.removeEventListener(TOC_HASH_CHANGE_EVENT, handleHashChange);
    };
  }, [items]);

  useEffect(() => {
    const article = document.querySelector('article');
    if (!article) return;

    // article이 뷰포트 중앙선(상하 각 50% 수축)을 포함할 때만 intersecting
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      rootMargin: '-50% 0px -50% 0px',
    });

    observer.observe(article);
    return () => observer.disconnect();
  }, []);

  return <TableOfContents items={items} activeId={activeId} isVisible={isVisible} className={className} />;
}
