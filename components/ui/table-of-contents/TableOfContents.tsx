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
 * - Active section items are visually connected with a vertical line
 * - Inactive sections are dimmed for focus
 */
export function TableOfContents({ items, activeId, className }: TableOfContentsProps) {
  if (items.length === 0) {
    return null;
  }

  // Calculate the active section scope (Level 1 to next Level 1)
  const activeIndex = items.findIndex((item) => item.id === activeId);
  let activeScopeStart = -1;
  let activeScopeEnd = items.length;

  if (activeIndex !== -1) {
    // Find the start of the current section (nearest preceding Level 1)
    for (let i = activeIndex; i >= 0; i--) {
      if (items[i].level === 1) {
        activeScopeStart = i;
        break;
      }
    }
    if (activeScopeStart === -1) activeScopeStart = 0;

    // Find the end of the current section (next Level 1)
    for (let i = activeIndex + 1; i < items.length; i++) {
      if (items[i].level === 1) {
        activeScopeEnd = i;
        break;
      }
    }
  }

  // Check if item is within the active section scope
  const isInActiveScope = (index: number): boolean => {
    if (activeIndex === -1) return false;
    return index >= activeScopeStart && index < activeScopeEnd;
  };

  // Check if item is the parent (Level 1) of the active section
  const isActiveSectionParent = (index: number): boolean => {
    return index === activeScopeStart && items[index]?.level === 1;
  };

  return (
    <nav
      aria-label="목차 목록"
      className={cn(
        'hidden lg:block',
        'fixed top-1/4 right-8 z-10',
        'max-h-[60vh] w-56 overflow-y-auto',
        'scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent',
        className
      )}
    >
      <ul className="relative flex flex-col">
        {items.map((item, index) => {
          const isActive = activeId === item.id;
          const inScope = isInActiveScope(index);
          const isScopeParent = isActiveSectionParent(index);

          // Visibility logic
          const isVisible = item.level === 1 || inScope;

          return (
            <li
              key={item.id}
              className={cn(
                'relative grid transition-[grid-template-rows] duration-300 ease-in-out',
                isVisible ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              )}
            >
              <div className="overflow-hidden">
                <a
                  href={`#${item.id}`}
                  className={cn(
                    'group relative flex items-center justify-end gap-3 py-1.5',
                    'transition-all duration-300',
                    // Active item styling
                    isActive && 'text-foreground',
                    // In-scope but not active
                    !isActive && inScope && 'text-foreground/70 hover:text-foreground',
                    // Out of scope (dimmed)
                    !inScope && 'text-muted-foreground/40 hover:text-muted-foreground/70'
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById(item.id);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      window.history.pushState(null, '', `#${item.id}`);
                    }
                  }}
                >
                  {/* Text */}
                  <span
                    className={cn(
                      'truncate text-xs transition-all duration-300',
                      // Level-based right margin for hierarchy
                      item.level === 2 && 'mr-2',
                      item.level === 3 && 'mr-4',
                      // Active styling
                      isActive && 'font-medium',
                      // Scope parent styling
                      isScopeParent && !isActive && 'font-medium'
                    )}
                  >
                    {item.text}
                  </span>

                  <span className="inline-flex h-2 w-2 items-center justify-center">
                    {/* Indicator dot/line */}
                    <span
                      data-testid="toc-indicator"
                      className={cn(
                        'shrink-0 rounded-full transition-all duration-300',
                        // Active: prominent dot
                        isActive && 'bg-primary h-2 w-2',
                        // In-scope parent: medium dot
                        !isActive && isScopeParent && 'bg-primary/70 h-1.5 w-1.5',
                        // In-scope children: small dot
                        !isActive && inScope && !isScopeParent && 'bg-primary/50 h-1 w-1',
                        // Out of scope: subtle line
                        !inScope && item.level === 1 && 'bg-muted-foreground/20 h-0.5 w-3',
                        !inScope && item.level > 1 && 'bg-muted-foreground/15 h-0.5 w-2'
                      )}
                    />
                  </span>
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
