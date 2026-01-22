'use client';

import { TableOfContents, type TocItem } from './TableOfContents';
import { useTocActiveId } from './useTocActiveId';

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
