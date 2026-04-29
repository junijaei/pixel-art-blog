'use client';

import { TableOfContents, type TocItem } from '@/components/ui/table-of-contents/TableOfContents';
import { useTocActiveId } from '@/components/ui/table-of-contents/useTocActiveId';
import { useEffect, useState } from 'react';

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
