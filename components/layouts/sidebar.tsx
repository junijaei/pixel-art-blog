'use client';

import { PixelChevron, PixelCollapse, PixelExpand, PixelFolder, PixelFolderOpen } from '@/components/ui';
import { useStorage } from '@/hooks/use-storage';
import { createCategoryLink } from '@/lib/notion/shared';
import type { CategoryTreeNode } from '@/types/notion';
import { cn } from '@/utils/utils';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

interface SidebarProps {
  categories: CategoryTreeNode[];
  className?: string;
  defaultCollapsed?: boolean;
}

interface CategoryTreeItemProps {
  node: CategoryTreeNode;
  level?: number;
  expandedCategories: string[];
  onToggleExpanded: (categoryId: string) => void;
  currentPath: string;
  parentFullPath?: string;
}

function CategoryTreeItem({
  node,
  level = 0,
  expandedCategories,
  onToggleExpanded,
  currentPath,
  parentFullPath,
}: CategoryTreeItemProps) {
  const isExpanded = expandedCategories.includes(node.id);
  const hasChildren = node.children && node.children.length > 0;

  // Use server-precomputed cumulative count — no posts[] needed on the client
  const postCount = node.cumulativePostCount;

  const fullPath = parentFullPath ? `${parentFullPath}/${node.path}` : node.path;
  const href = createCategoryLink(fullPath);

  // 현재 경로가 이 카테고리의 경로와 일치하는지 확인
  const isActive = useMemo(() => {
    if (!currentPath) return false;
    return currentPath === href || currentPath.startsWith(`${href}/`);
  }, [currentPath, href]);

  const handleToggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onToggleExpanded(node.id);
    },
    [node.id, onToggleExpanded]
  );

  return (
    <div>
      {/* Category Row */}
      <div
        className={cn(
          'flex items-center gap-1 rounded-md text-sm transition-colors',
          isActive && 'text-sidebar-primary font-semibold'
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {/* Toggle Arrow */}
        {hasChildren ? (
          <button
            onClick={handleToggle}
            className="hover:bg-sidebar-accent cursor-pointer rounded p-1 transition-colors"
            aria-label={isExpanded ? '카테고리 접기' : '카테고리 펼치기'}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              <PixelChevron className="text-sidebar-foreground/60 h-3 w-3" />
            </motion.div>
          </button>
        ) : (
          <div className="w-5" />
        )}

        {/* Category Link */}
        <Link
          href={href}
          className={cn(
            'flex flex-1 items-center gap-2 rounded-md px-2 py-1 transition-colors',
            'hover:bg-sidebar-accent text-sidebar-foreground'
          )}
        >
          {/* Folder Icon */}
          {isExpanded ? (
            <PixelFolderOpen className="text-sidebar-foreground/80 h-4 w-4 shrink-0" />
          ) : (
            <PixelFolder className="text-sidebar-foreground/80 h-4 w-4 shrink-0" />
          )}

          {/* Label + Count */}
          <span className="flex flex-1 items-center justify-between truncate">
            <span className="truncate">{node.label}</span>
            {postCount > 0 && <span className="text-sidebar-foreground/50 ml-2 shrink-0 text-xs">({postCount})</span>}
          </span>
        </Link>
      </div>

      {/* Children */}
      <AnimatePresence initial={false}>
        {hasChildren && isExpanded && (
          <motion.div
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={{
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
            }}
            className="overflow-hidden"
          >
            {node.children.map((child) => (
              <motion.div
                key={child.id}
                variants={{
                  collapsed: { opacity: 0, x: -10, transition: { duration: 0.15 } },
                  expanded: { opacity: 1, x: 0, transition: { duration: 0.2, ease: 'easeOut' } },
                }}
              >
                <CategoryTreeItem
                  node={child}
                  level={level + 1}
                  expandedCategories={expandedCategories}
                  onToggleExpanded={onToggleExpanded}
                  currentPath={currentPath}
                  parentFullPath={fullPath}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Sidebar({ categories, className, defaultCollapsed = true }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [expandedCategories, setExpandedCategories] = useStorage<string[]>('expanded-categories', ['all']);

  // 카테고리 확장/축소 토글
  const handleToggleExpanded = useCallback(
    (categoryId: string) => {
      setExpandedCategories((prev) => {
        const next = [...prev];
        if (next.includes(categoryId)) {
          return next.filter((item) => item !== categoryId);
        } else {
          return [...next, categoryId];
        }
      });
    },
    [setExpandedCategories]
  );

  const collectExpandableIds = useCallback((categories: CategoryTreeNode[]): string[] => {
    const result: string[] = [];

    const traverse = (nodes: CategoryTreeNode[]) => {
      for (const node of nodes) {
        if (node.hasChildren) {
          result.push(node.id);
        }

        if (node.children?.length) {
          traverse(node.children);
        }
      }
    };

    traverse(categories);
    return result;
  }, []);

  const expandableIds = useMemo(() => collectExpandableIds(categories), [categories, collectExpandableIds]);

  const isAllExpanded = useMemo(() => {
    const expandedSet = new Set(expandedCategories);
    return expandableIds.every((id) => expandedSet.has(id));
  }, [expandedCategories, expandableIds]);

  // 전체 맵 열기/닫기
  const handleToggleAll = useCallback(() => {
    if (isAllExpanded) {
      setExpandedCategories([]);
    } else {
      const allIds: string[] = [];
      const collectIds = (nodes: CategoryTreeNode[]) => {
        nodes.forEach((node) => {
          if (node.children.length > 0) {
            allIds.push(node.id);
            collectIds(node.children);
          }
        });
      };
      collectIds(categories);
      setExpandedCategories(allIds);
    }
  }, [isAllExpanded, setExpandedCategories, categories]);

  return (
    <aside
      className={cn(
        'hidden sm:flex',
        'bg-sidebar border-sidebar-border sticky top-0 h-screen flex-col border-r transition-all duration-300',
        isCollapsed ? 'w-12' : 'w-64',
        className
      )}
    >
      {/* Header */}
      <div
        className={cn(
          'border-sidebar-border flex shrink-0 items-center justify-between border-b',
          isCollapsed ? 'px-2 py-4' : 'p-4'
        )}
      >
        {!isCollapsed && (
          <div className="flex items-center gap-1">
            <span className="text-sidebar-foreground/80 font-pixel text-xs tracking-wider uppercase">Categories</span>
            <button
              onClick={handleToggleAll}
              className="hover:bg-sidebar-accent text-sidebar-foreground/60 cursor-pointer rounded p-1 transition-colors"
              aria-label={isAllExpanded ? '카테고리 전체 접기' : '카테고리 전체 펼치기'}
            >
              {isAllExpanded ? <PixelCollapse className="h-4 w-4" /> : <PixelExpand className="h-4 w-4" />}
            </button>
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
                expandedCategories={expandedCategories}
                onToggleExpanded={handleToggleExpanded}
                currentPath={pathname}
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
