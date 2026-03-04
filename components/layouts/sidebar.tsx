'use client';

import { PixelChevron, PixelCollapse, PixelExpand, PixelFolder, PixelFolderOpen } from '@/components/ui';
import { useStorage } from '@/hooks/use-storage';
import type { CategoryTreeNode } from '@/types/notion';
import { cn } from '@/utils/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface SidebarProps {
  categories: CategoryTreeNode[];
  className?: string;
}

interface CategoryTreeItemProps {
  node: CategoryTreeNode;
  level?: number;
  expandedCategories: string[];
  onToggleExpanded: (categoryId: string) => void;
  currentPath: string;
}

function CategoryTreeItem({
  node,
  level = 0,
  expandedCategories,
  onToggleExpanded,
  currentPath,
}: CategoryTreeItemProps) {
  const isExpanded = expandedCategories.includes(node.id);
  const hasChildren = node.children && node.children.length > 0;

  // Use server-precomputed cumulative count — no posts[] needed on the client
  const postCount = node.cumulativePostCount;

  // 현재 경로가 이 카테고리의 경로와 일치하는지 확인
  const isActive = useMemo(() => {
    const categoryPath = `/${node.path}`;
    return currentPath === categoryPath || currentPath.startsWith(`${categoryPath}/`);
  }, [currentPath, node.path]);

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
            aria-label={isExpanded ? 'Collapse category' : 'Expand category'}
          >
            <PixelChevron
              className={cn('text-sidebar-foreground/60 h-3 w-3 transition-transform', isExpanded && 'rotate-90')}
            />
          </button>
        ) : (
          <div className="w-5" />
        )}

        {/* Category Link */}
        <Link
          href={`/posts?category=${encodeURIComponent(node.path)}`}
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
      {hasChildren && isExpanded && (
        <div>
          {node.children.map((child) => (
            <CategoryTreeItem
              key={child.id}
              node={child}
              level={level + 1}
              expandedCategories={expandedCategories}
              onToggleExpanded={onToggleExpanded}
              currentPath={currentPath}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar({ categories, className }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [expandedCategories, setExpandedCategories] = useStorage<string[]>('expanded-categories', ['all']);

  // 카테고리 확장/축소 토글
  const handleToggleExpanded = useCallback((categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = [...prev];
      if (next.includes(categoryId)) {
        return next.filter((item) => item !== categoryId);
      } else {
        return [...next, categoryId];
      }
    });
  }, []);

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
              aria-label="Toggle all categories"
            >
              {isAllExpanded ? <PixelCollapse className="h-4 w-4" /> : <PixelExpand className="h-4 w-4" />}
            </button>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn('hover:bg-sidebar-accent ml-auto cursor-pointer rounded p-2 transition-colors')}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <PixelChevron
            className={cn(
              'text-muted-foreground h-4 w-4 transition-transform',
              isCollapsed ? 'rotate-0' : 'rotate-180'
            )}
          />
        </button>
      </div>
      {/* Category Tree */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto px-2 py-2">
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
      )}

      {/* Collapsed State Icon */}
      {isCollapsed && (
        <div className="flex flex-1 flex-col items-center gap-2 py-4">
          <PixelFolder className="text-sidebar-foreground/60 h-5 w-5" />
        </div>
      )}
    </aside>
  );
}
