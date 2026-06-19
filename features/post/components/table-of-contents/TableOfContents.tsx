'use client';

import { cn } from '@/shared/lib/utils';

export const TOC_HASH_CHANGE_EVENT = 'toc-hash-change';

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
  /** Whether the TOC is visible (fade-in/out) */
  isVisible?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function TableOfContents({ items, activeId, isVisible = true, className }: TableOfContentsProps) {
  if (items.length === 0) {
    return null;
  }

  // 현재 글의 최상위 레벨을 기준으로 상대 깊이 계산
  const minLevel = Math.min(...items.map((item) => item.level)) as 1 | 2 | 3;

  const activeIndex = items.findIndex((item) => item.id === activeId);
  let activeScopeStart = -1;
  let activeScopeEnd = items.length;

  if (activeIndex !== -1) {
    for (let i = activeIndex; i >= 0; i--) {
      if (items[i].level === minLevel) {
        activeScopeStart = i;
        break;
      }
    }
    if (activeScopeStart === -1) activeScopeStart = 0;

    for (let i = activeIndex + 1; i < items.length; i++) {
      if (items[i].level === minLevel) {
        activeScopeEnd = i;
        break;
      }
    }
  }

  // 가시성용: 같은 minLevel 섹션 범위 내에 있는지
  const isInSection = (index: number): boolean => {
    if (activeIndex === -1) return false;
    return index >= activeScopeStart && index < activeScopeEnd;
  };

  // 인디케이터용: active 항목의 조상·자신·자손인지
  const isInSubtree = (index: number): boolean => {
    if (activeIndex === -1) return false;
    if (index === activeIndex) return true;

    const activeLevel = items[activeIndex].level;

    if (index < activeIndex) {
      const itemLevel = items[index].level;
      if (itemLevel >= activeLevel) return false;
      for (let i = index + 1; i <= activeIndex; i++) {
        if (items[i].level <= itemLevel) return false;
      }
      return true;
    } else {
      if (items[index].level <= activeLevel) return false;
      for (let i = activeIndex + 1; i < index; i++) {
        if (items[i].level <= activeLevel) return false;
      }
      return true;
    }
  };

  // 3레벨 가시성용: 직계 부모(2레벨)가 inScope인지
  const isDirectParentInScope = (index: number): boolean => {
    for (let i = index - 1; i >= 0; i--) {
      if (items[i].level < items[index].level) {
        return isInSubtree(i);
      }
    }
    return false;
  };

  const isActiveSectionParent = (index: number): boolean => {
    return index === activeScopeStart && items[index]?.level === minLevel;
  };

  return (
    <nav
      aria-label="목차 목록"
      aria-disabled={!isVisible}
      inert={!isVisible ? true : undefined}
      style={{ pointerEvents: isVisible ? undefined : 'none' }}
      className={cn(
        'hidden lg:block',
        'fixed top-1/4 right-8 z-10',
        'max-h-[60vh] w-56 overflow-x-hidden overflow-y-auto',
        'scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent',
        'transition-opacity duration-500',
        isVisible ? 'opacity-100' : 'opacity-0',
        !isVisible && 'pointer-events-none',
        className
      )}
    >
      <ul className="relative flex flex-col">
        {items.map((item, index) => {
          const isActive = activeId === item.id;
          const inSection = isInSection(index);
          const inScope = isInSubtree(index);
          const isScopeParent = isActiveSectionParent(index);
          const relativeDepth = item.level - minLevel; // 0 = 최상위, 1 = 2단계, 2 = 3단계

          const shouldShowItem =
            relativeDepth === 0 ||
            (relativeDepth === 1 && inSection) ||
            (relativeDepth === 2 &&
              items[activeIndex]?.level !== minLevel &&
              (isActive || isDirectParentInScope(index)));
          const linkInteractive = isVisible && shouldShowItem;

          return (
            <li
              key={item.id}
              aria-hidden={!shouldShowItem}
              className={cn(
                'relative overflow-hidden transition-[max-height,opacity,transform] duration-200 ease-out motion-reduce:transition-none',
                shouldShowItem
                  ? 'max-h-8 translate-y-0 opacity-100'
                  : 'pointer-events-none max-h-0 -translate-y-1 opacity-0'
              )}
            >
              <div className="overflow-hidden">
                <a
                  href={linkInteractive ? `#${item.id}` : undefined}
                  tabIndex={linkInteractive ? undefined : -1}
                  aria-disabled={!linkInteractive}
                  className={cn(
                    'group relative flex items-center justify-end gap-3 py-1.5 pr-1',
                    'transition-all duration-300',
                    !linkInteractive && 'pointer-events-none cursor-default',
                    relativeDepth === 0 && 'mr-0',
                    relativeDepth > 0 &&
                      "before:bg-border/70 after:bg-border/70 before:pointer-events-none before:absolute before:top-1/2 before:h-px before:w-2 before:-translate-y-1/2 before:rounded-full before:content-[''] after:pointer-events-none after:absolute after:top-0 after:bottom-0 after:w-px after:rounded-full after:content-['']",
                    relativeDepth === 1 && 'mr-2 pr-3 after:right-0',
                    relativeDepth === 2 && 'mr-4 pr-4 after:right-2',
                    relativeDepth === 1 && 'before:right-0',
                    relativeDepth === 2 && 'before:right-2',
                    isActive
                      ? 'text-foreground'
                      : inSection
                        ? 'text-foreground/70 hover:text-foreground'
                        : 'text-muted-foreground/40 hover:text-muted-foreground/70'
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    if (!linkInteractive) return;

                    const hash = `#${item.id}`;
                    if (window.location.hash !== hash) {
                      window.history.pushState(null, '', hash);
                    }
                    window.dispatchEvent(new CustomEvent(TOC_HASH_CHANGE_EVENT));
                  }}
                >
                  <span
                    className={cn(
                      'flex items-center gap-1 truncate transition-all duration-300',
                      'text-xs',
                      isActive && 'font-medium',
                      isScopeParent && !isActive && 'font-medium'
                    )}
                  >
                    <span className="truncate">{item.text}</span>
                  </span>

                  <span className="inline-flex h-2 w-2 items-center justify-center">
                    <span
                      data-testid="toc-indicator"
                      className={cn(
                        'shrink-0 transition-all duration-300',
                        // Active state: Always a solid primary square
                        isActive && 'bg-primary h-2 w-2 rounded-sm',
                        // Level 1 (Parent): Large square or line
                        !isActive &&
                          relativeDepth === 0 &&
                          (inScope
                            ? 'bg-primary/50 h-1.5 w-1.5 rounded-sm'
                            : 'bg-muted-foreground/20 h-0.5 w-3 rounded-full'),
                        // Level 2: Medium square (in scope) or short line (not in scope)
                        !isActive &&
                          relativeDepth === 1 &&
                          (inScope
                            ? 'bg-primary/40 h-1 w-1 rounded-sm'
                            : 'bg-muted-foreground/15 h-0.5 w-2 rounded-full'),
                        // Level 3: Tiny pixel
                        !isActive && relativeDepth === 2 && 'bg-primary/30 h-0.5 w-0.5 rounded-full'
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
