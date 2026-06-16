'use client';

import type { CategoryTreeNode } from '@/features/post/model';
import { createCategoryLink } from '@/features/post/routing';
import { useStorage } from '@/shared/hooks/use-storage';
import { cn } from '@/shared/lib/utils';
import { PixelChevron, PixelCollapse, PixelExpand, PixelFolder, PixelFolderOpen } from '@/shared/ui/pixel';
import { AnimatePresence, motion, type Variants } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

function toCategoryHref(pathname: string): string {
  const path = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  if (path === '/posts' || path.startsWith('/posts/')) return path;

  const segments = path.split('/').filter(Boolean);
  if (segments.length <= 1) return '/posts';
  return `/posts/${segments.slice(0, -1).join('/')}`;
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

function collectExpandableIds(nodes: CategoryTreeNode[]): string[] {
  const result: string[] = [];
  const traverse = (list: CategoryTreeNode[]) => {
    for (const node of list) {
      if (node.children.length > 0) {
        result.push(node.id);
        traverse(node.children);
      }
    }
  };
  traverse(nodes);
  return result;
}

export function CategorySidebar({ categories }: { categories: CategoryTreeNode[] }) {
  const pathname = usePathname();
  const activeHref = useMemo(() => toCategoryHref(pathname), [pathname]);

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [expandedIds, setExpandedIds] = useStorage<string[]>('expanded-categories', ['all']);

  const handleToggleExpanded = useCallback(
    (id: string) => {
      setExpandedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
    },
    [setExpandedIds]
  );

  const expandableIds = useMemo(() => collectExpandableIds(categories), [categories]);

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
        isCollapsed ? 'w-12' : 'w-64'
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
            <span className="text-sidebar-foreground/80 font-pixel text-xs tracking-wider uppercase">Categories</span>
            {expandableIds.length > 0 && (
              <button
                onClick={handleToggleAll}
                className="hover:bg-sidebar-accent text-sidebar-foreground/60 cursor-pointer rounded p-1 transition-colors"
                aria-label={isAllExpanded ? '카테고리 전체 접기' : '카테고리 전체 펼치기'}
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
            className={cn(
              'text-muted-foreground h-4 w-4 transition-transform',
              isCollapsed ? 'rotate-0' : 'rotate-180'
            )}
          />
        </button>
      </div>

      {/* Content Area */}
      <div className="relative flex-1 overflow-hidden">
        {/* Expanded: Category Tree */}
        <div
          className={cn(
            'absolute inset-0 overflow-y-auto px-2 py-2',
            'transition-all duration-300',
            isCollapsed ? 'pointer-events-none opacity-0' : 'opacity-100'
          )}
        >
          {categories.length === 0 ? (
            <div className="text-sidebar-foreground/50 px-3 py-4 text-center text-sm">No categories found</div>
          ) : (
            categories.map((node) => (
              <CategoryTreeItem
                key={node.id}
                node={node}
                parentPath=""
                level={0}
                expandedIds={expandedIds}
                onToggle={handleToggleExpanded}
                activeHref={activeHref}
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

interface CategoryTreeItemProps {
  node: CategoryTreeNode;
  parentPath: string;
  level: number;
  expandedIds: string[];
  onToggle: (id: string) => void;
  activeHref: string;
}

function CategoryTreeItem({ node, parentPath, level, expandedIds, onToggle, activeHref }: CategoryTreeItemProps) {
  const fullPath = parentPath ? `${parentPath}/${node.path}` : node.path;
  const href = createCategoryLink(fullPath);
  const isExpanded = expandedIds.includes(node.id);
  const hasChildren = node.children.length > 0;
  const isActive = href === activeHref;
  const count = node.cumulativePostCount;

  const handleToggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onToggle(node.id);
    },
    [node.id, onToggle]
  );

  return (
    <div>
      <div
        className="flex items-center gap-1 rounded-md text-sm transition-colors"
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {hasChildren ? (
          <button
            onClick={handleToggle}
            className="hover:bg-sidebar-accent cursor-pointer rounded p-1 transition-colors"
            aria-label={isExpanded ? '하위 카테고리 접기' : '하위 카테고리 펼치기'}
          >
            <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2, ease: 'easeInOut' }}>
              <PixelChevron className="text-sidebar-foreground/60 h-3 w-3" />
            </motion.div>
          </button>
        ) : (
          <div className="w-5" />
        )}

        <Link
          href={href}
          className={cn(
            'flex flex-1 items-center gap-2 rounded-lg px-2 py-1.5 transition-colors',
            'hover:bg-sidebar-accent/80 text-sidebar-foreground',
            isActive && 'text-sidebar-primary font-semibold'
          )}
        >
          {isExpanded ? (
            <PixelFolderOpen className="text-sidebar-foreground/80 h-4 w-4 shrink-0" />
          ) : (
            <PixelFolder className="text-sidebar-foreground/80 h-4 w-4 shrink-0" />
          )}
          <span className="flex flex-1 items-center justify-between truncate">
            <span className="truncate">{node.label}</span>
            {count > 0 && <span className="text-sidebar-foreground/50 ml-2 shrink-0 text-xs">({count})</span>}
          </span>
        </Link>
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
            {node.children.map((child) => (
              <motion.div key={child.id} variants={childVariants}>
                <CategoryTreeItem
                  node={child}
                  parentPath={fullPath}
                  level={level + 1}
                  expandedIds={expandedIds}
                  onToggle={onToggle}
                  activeHref={activeHref}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
