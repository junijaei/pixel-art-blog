'use client';

import { TableOfContents, type TocItem } from '@/components/ui/table-of-contents/TableOfContents';
import { useTocActiveId } from '@/components/ui/table-of-contents/useTocActiveId';

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

  return <TableOfContents items={items} activeId={activeId} className={className} />;
}
