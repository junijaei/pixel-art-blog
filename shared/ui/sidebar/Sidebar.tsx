'use client';

import { PixelChevron, PixelCollapse, PixelExpand, PixelFolder } from '@/shared/ui/pixel';
import { useStorage } from '@/shared/hooks/use-storage';
import { cn } from '@/shared/lib/utils';
import { AnimatePresence, motion, type Variants } from 'motion/react';
import { type ReactNode, useCallback, useMemo, useState } from 'react';

/**
 * Minimal structural contract the generic Sidebar needs to manage
 * expansion state and recursion. Any domain-specific fields (label,
 * href, counts, ...) are opaque to the Sidebar and handled by `renderItem`.
 */
export interface SidebarTreeNode {
  id: string;
  children?: SidebarTreeNode[];
}

export interface SidebarRenderItemArgs<T extends SidebarTreeNode> {
  node: T;
  level: number;
  isExpanded: boolean;
  hasChildren: boolean;
  toggle: () => void;
}

export interface SidebarProps<T extends SidebarTreeNode> {
  /** Tree data. Each node is identified by `id` and may have `children`. */
  items: T[];
  /** Renders the content of a row (to the right of the expand chevron). */
  renderItem: (args: SidebarRenderItemArgs<T>) => ReactNode;
  /** Header label shown when expanded. */
  title?: string;
  /** localStorage key used to persist the expanded node ids. */
  storageKey?: string;
  /** Expanded node ids applied on first mount. */
  defaultExpandedIds?: string[];
  /** Whether the whole sidebar starts collapsed (icon-only). */
  defaultCollapsed?: boolean;
  /** Content shown when `items` is empty. */
  emptyText?: string;
  className?: string;
}

const childVariants: Variants = {
  collapsed: { opacity: 0, x: -10, transition: { duration: 0.15 } },
  expanded: { opacity: 1, x: 0, transition: { duration: 0.2, ease: 'easeOut' } },
};

const groupVariants: Variants = {
  expanded: {
    height: 'auto',
    opacity: 1,
    transition: {
      height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
      opacity: { duration: 0.2, delay: 0.1 },
      staggerChildren: 0.05,
    },
  },
  collapsed: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
      opacity: { duration: 0.2 },
    },
  },
};

interface TreeItemProps<T extends SidebarTreeNode> {
  node: T;
  level: number;
  expandedIds: string[];
  onToggle: (id: string) => void;
  renderItem: (args: SidebarRenderItemArgs<T>) => ReactNode;
}

function TreeItem<T extends SidebarTreeNode>({ node, level, expandedIds, onToggle, renderItem }: TreeItemProps<T>) {
  const isExpanded = expandedIds.includes(node.id);
  const hasChildren = !!node.children && node.children.length > 0;

  const toggle = useCallback(() => onToggle(node.id), [node.id, onToggle]);

  const handleToggleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toggle();
    },
    [toggle]
  );

  return (
    <div>
      <div
        className="flex items-center gap-1 rounded-md text-sm transition-colors"
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {hasChildren ? (
          <button
            onClick={handleToggleClick}
            className="hover:bg-sidebar-accent cursor-pointer rounded p-1 transition-colors"
            aria-label={isExpanded ? '하위 항목 접기' : '하위 항목 펼치기'}
          >
            <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2, ease: 'easeInOut' }}>
              <PixelChevron className="text-sidebar-foreground/60 h-3 w-3" />
            </motion.div>
          </button>
        ) : (
          <div className="w-5" />
        )}

        {renderItem({ node, level, isExpanded, hasChildren, toggle })}
      </div>

      <AnimatePresence initial={false}>
        {hasChildren && isExpanded && (
          <motion.div
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={groupVariants}
            className="overflow-hidden"
          >
            {node.children!.map((child) => (
              <motion.div key={child.id} variants={childVariants}>
                <TreeItem
                  node={child as T}
                  level={level + 1}
                  expandedIds={expandedIds}
                  onToggle={onToggle}
                  renderItem={renderItem}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function collectExpandableIds(nodes: SidebarTreeNode[]): string[] {
  const result: string[] = [];
  const traverse = (list: SidebarTreeNode[]) => {
    for (const node of list) {
      if (node.children && node.children.length > 0) {
        result.push(node.id);
        traverse(node.children);
      }
    }
  };
  traverse(nodes);
  return result;
}

export function Sidebar<T extends SidebarTreeNode>({
  items,
  renderItem,
  title = 'Menu',
  storageKey = 'sidebar-expanded',
  defaultExpandedIds = [],
  defaultCollapsed = true,
  emptyText = 'No items',
  className,
}: SidebarProps<T>) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [expandedIds, setExpandedIds] = useStorage<string[]>(storageKey, defaultExpandedIds);

  const handleToggleExpanded = useCallback(
    (id: string) => {
      setExpandedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
    },
    [setExpandedIds]
  );

  const expandableIds = useMemo(() => collectExpandableIds(items), [items]);

  const isAllExpanded = useMemo(() => {
    const expandedSet = new Set(expandedIds);
    return expandableIds.length > 0 && expandableIds.every((id) => expandedSet.has(id));
  }, [expandedIds, expandableIds]);

  const handleToggleAll = useCallback(() => {
    setExpandedIds(isAllExpanded ? [] : expandableIds);
  }, [isAllExpanded, expandableIds, setExpandedIds]);

  return (
    <aside
      className={cn(
        'hidden sm:flex',
        'bg-sidebar/80 border-sidebar-border/80 sticky top-0 h-screen flex-col border-r backdrop-blur transition-all duration-300',
        isCollapsed ? 'w-12' : 'w-64',
        className
      )}
    >
      {/* Header */}
      <div
        className={cn(
          'border-sidebar-border/80 flex shrink-0 items-center justify-between border-b',
          isCollapsed ? 'px-2 py-4' : 'p-4'
        )}
      >
        {!isCollapsed && (
          <div className="flex items-center gap-1">
            <span className="text-sidebar-foreground/80 font-pixel text-xs tracking-wider uppercase">{title}</span>
            {expandableIds.length > 0 && (
              <button
                onClick={handleToggleAll}
                className="hover:bg-sidebar-accent text-sidebar-foreground/60 cursor-pointer rounded p-1 transition-colors"
                aria-label={isAllExpanded ? '전체 접기' : '전체 펼치기'}
              >
                {isAllExpanded ? <PixelCollapse className="h-4 w-4" /> : <PixelExpand className="h-4 w-4" />}
              </button>
            )}
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn('hover:bg-sidebar-accent ml-auto cursor-pointer rounded p-2 transition-colors')}
          aria-label={isCollapsed ? '사이드바 펼치기' : '사이드바 접기'}
        >
          <PixelChevron
            className={cn('text-muted-foreground h-4 w-4 transition-transform', isCollapsed ? 'rotate-0' : 'rotate-180')}
          />
        </button>
      </div>

      {/* Content Area */}
      <div className="relative flex-1 overflow-hidden">
        {/* Expanded: Tree */}
        <div
          className={cn(
            'absolute inset-0 overflow-y-auto px-2 py-2',
            'transition-all duration-300',
            isCollapsed ? 'pointer-events-none opacity-0' : 'opacity-100'
          )}
        >
          {items.length === 0 ? (
            <div className="text-sidebar-foreground/50 px-3 py-4 text-center text-sm">{emptyText}</div>
          ) : (
            items.map((node) => (
              <TreeItem
                key={node.id}
                node={node}
                level={0}
                expandedIds={expandedIds}
                onToggle={handleToggleExpanded}
                renderItem={renderItem}
              />
            ))
          )}
        </div>

        {/* Collapsed: Icon */}
        <div
          className={cn(
            'absolute inset-0 flex flex-col items-center gap-2 py-4',
            'transition-all duration-300',
            isCollapsed ? 'opacity-100' : 'pointer-events-none opacity-0'
          )}
        >
          <PixelFolder className="text-sidebar-foreground/60 h-5 w-5" />
        </div>
      </div>
    </aside>
  );
}
