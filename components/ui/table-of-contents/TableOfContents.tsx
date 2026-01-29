'use client';

import { cn } from '@/utils/utils';

export interface TocItem {
  /** Unique identifier (used for anchor link) */
  id: string;
  /** Heading text */
  text: string;
  /** Heading level (1, 2, or 3) */
  level: 1 | 2 | 3;
}

export interface TableOfContentsProps {
  /** List of TOC items extracted from headings */
  items: TocItem[];
  /** Currently active/visible heading ID */
  activeId?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Table of Contents component for post pages
 *
 * - Shows heading hierarchy on the right side
 * - Hidden on mobile (shown on lg and above)
 * - Hover reveals full title (default shows indicator lines)
 * - Active section is highlighted
 */
export function TableOfContents({ items, activeId, className }: TableOfContentsProps) {
  if (items.length === 0) {
    return null;
  }

  // Get indicator width based on heading level
  const getIndicatorWidth = (level: number): string => {
    switch (level) {
      case 1:
        return 'w-6';
      case 2:
        return 'w-4';
      case 3:
        return 'w-2';
      default:
        return 'w-4';
    }
  };

  // Get left padding based on heading level
  const getLevelPadding = (level: number): string => {
    switch (level) {
      case 1:
        return 'pl-0';
      case 2:
        return 'pl-3';
      case 3:
        return 'pl-6';
      default:
        return 'pl-0';
    }
  };

  return (
    <nav
      aria-label="Table of contents"
      className={cn(
        'hidden lg:block',
        'fixed top-1/4 right-8 z-10',
        'max-h-[60vh] w-48 overflow-y-auto',
        'scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent',
        className
      )}
    >
      <ul className="space-y-1">
        {items.map((item) => {
          const isActive = activeId === item.id;

          return (
            <li key={item.id} className={cn('group', getLevelPadding(item.level))}>
              <a
                href={`#${item.id}`}
                className={cn(
                  'flex items-center justify-end gap-2',
                  'transition-all',
                  // Text styling
                  isActive ? 'text-muted-foreground' : 'hover:text-muted-foreground/50'
                )}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(item.id);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // Update URL hash without jumping
                    window.history.pushState(null, '', `#${item.id}`);
                  }
                }}
              >
                <span
                  className={cn(
                    'truncate text-xs',
                    'p-1 transition-all',
                    '-translate-x-2 opacity-0',
                    'group-hover:translate-x-0 group-hover:opacity-100',
                    isActive && 'bg-muted/50 translate-x-0 rounded font-medium opacity-100'
                  )}
                >
                  {item.text}
                </span>
                <span
                  data-testid="toc-indicator"
                  className={cn(
                    'bg-muted-foreground/20 h-0.5 rounded-full',
                    'transition-all',
                    getIndicatorWidth(item.level),
                    'group-hover:w-0 group-hover:opacity-0',
                    isActive && 'w-0 opacity-0'
                  )}
                />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
