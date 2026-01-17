'use client';

import { PixelChevron, PixelFolder, PixelFolderOpen } from '@/components/ui';
import { buildCategoryTree } from '@/lib/notion';
import { cn } from '@/lib/utils';
import type { Category, CategoryTreeNode, Post } from '@/types/notion';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

interface SidebarProps {
  categories: Category[];
  posts: Post[];
  className?: string;
}

interface CategoryTreeItemProps {
  node: CategoryTreeNode;
  level?: number;
  expandedCategories: Set<string>;
  onToggleExpanded: (categoryId: string) => void;
  postCountMap: Map<string, number>;
  currentPath: string;
}

function CategoryTreeItem({
  node,
  level = 0,
  expandedCategories,
  onToggleExpanded,
  postCountMap,
  currentPath,
}: CategoryTreeItemProps) {
  const isExpanded = expandedCategories.has(node.id);
  const hasChildren = node.children && node.children.length > 0;
  const postCount = postCountMap.get(node.id) || 0;

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
          isActive && 'bg-sidebar-primary/10 text-sidebar-primary font-medium'
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {/* Toggle Arrow */}
        {hasChildren ? (
          <button
            onClick={handleToggle}
            className="hover:bg-sidebar-accent rounded p-1 transition-colors"
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
              postCountMap={postCountMap}
              currentPath={currentPath}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar({ categories, posts, className }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // 카테고리 트리 메모이제이션
  const categoryTree = useMemo(() => buildCategoryTree(categories), [categories]);

  // 카테고리별 포스트 개수 계산 (자식 카테고리 포함)
  const postCountMap = useMemo(() => {
    const map = new Map<string, number>();

    // 각 카테고리에 대해 자신과 모든 자식 카테고리의 ID 수집
    const getAllDescendantIds = (node: CategoryTreeNode): string[] => {
      const ids = [node.id];
      node.children.forEach((child) => {
        ids.push(...getAllDescendantIds(child));
      });
      return ids;
    };

    // 트리의 모든 노드를 순회하며 포스트 개수 계산
    const processNode = (node: CategoryTreeNode) => {
      const descendantIds = new Set(getAllDescendantIds(node));
      const categoryPosts = posts.filter((post) => descendantIds.has(post.categoryId));
      map.set(node.id, categoryPosts.length);

      node.children.forEach(processNode);
    };

    categoryTree.forEach(processNode);

    return map;
  }, [categoryTree, posts]);

  // 카테고리 확장/축소 토글
  const handleToggleExpanded = useCallback((categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  }, []);

  // 전체 맵 열기/닫기
  const handleToggleAll = useCallback(() => {
    if (expandedCategories.size === categoryTree.length) {
      // 모두 열려있으면 모두 닫기
      setExpandedCategories(new Set());
    } else {
      // 모두 열기
      const allIds = new Set<string>();
      const collectIds = (nodes: CategoryTreeNode[]) => {
        nodes.forEach((node) => {
          if (node.children.length > 0) {
            allIds.add(node.id);
            collectIds(node.children);
          }
        });
      };
      collectIds(categoryTree);
      setExpandedCategories(allIds);
    }
  }, [expandedCategories.size, categoryTree]);

  return (
    <aside
      className={cn(
        'bg-sidebar border-sidebar-border sticky top-0 flex h-screen flex-col border-r transition-all duration-300',
        isCollapsed ? 'w-12' : 'w-64',
        className
      )}
    >
      {/* Header */}
      <div className="border-sidebar-border flex shrink-0 items-center justify-between border-b px-3 py-3">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <span className="text-sidebar-foreground/80 font-(family-name:--font-silkscreen) text-[10px] tracking-wider uppercase">
              Categories
            </span>
            <button
              onClick={handleToggleAll}
              className="hover:bg-sidebar-accent rounded px-1.5 py-0.5 text-[10px] transition-colors"
              aria-label="Toggle all categories"
            >
              {expandedCategories.size === categoryTree.length ? 'Collapse' : 'Expand'}
            </button>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hover:bg-sidebar-accent ml-auto rounded p-1 transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <PixelChevron
            className={cn(
              'text-sidebar-foreground/60 h-3 w-3 transition-transform',
              isCollapsed ? 'rotate-0' : 'rotate-180'
            )}
          />
        </button>
      </div>

      {/* Category Tree */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto px-2 py-2">
          {categoryTree.length === 0 ? (
            <div className="text-sidebar-foreground/50 px-3 py-4 text-center text-sm">No categories found</div>
          ) : (
            categoryTree.map((node) => (
              <CategoryTreeItem
                key={node.id}
                node={node}
                expandedCategories={expandedCategories}
                onToggleExpanded={handleToggleExpanded}
                postCountMap={postCountMap}
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
