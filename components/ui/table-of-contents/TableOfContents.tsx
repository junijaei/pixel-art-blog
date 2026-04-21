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

export function TableOfContents({ items, activeId, className }: TableOfContentsProps) {
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
          const inSection = isInSection(index);
          const inScope = isInSubtree(index);
          const isScopeParent = isActiveSectionParent(index);
          const relativeDepth = item.level - minLevel; // 0 = 최상위, 1 = 2단계, 2 = 3단계

          const isVisible =
            relativeDepth === 0 ||
            (relativeDepth === 1 && inSection) ||
            (relativeDepth === 2 &&
              items[activeIndex]?.level !== minLevel &&
              (isActive || isDirectParentInScope(index)));

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
                    isActive && 'text-foreground',
                    !isActive && inSection && 'text-foreground/70 hover:text-foreground',
                    !inSection && 'text-muted-foreground/40 hover:text-muted-foreground/70'
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
                  <span
                    className={cn(
                      'font-galmuri9 flex items-center gap-1 truncate transition-all duration-300',
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
