'use client';

import { createCategoryLink } from '@/features/post/routing';
import type { CategoryTreeNode } from '@/features/post/model';
import { Sidebar, type SidebarTreeNode } from '@/shared/ui/sidebar';
import { PixelFolder, PixelFolderOpen } from '@/shared/ui/pixel';
import { cn } from '@/shared/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { use, useMemo } from 'react';

/**
 * View-model node: the category tree projected into the minimal shape the
 * generic Sidebar needs (id + children) plus the presentational fields the
 * category renderItem consumes.
 */
interface CategoryNavNode extends SidebarTreeNode {
  label: string;
  href: string;
  count: number;
  children: CategoryNavNode[];
}

function toNavNodes(nodes: CategoryTreeNode[], parentPath = ''): CategoryNavNode[] {
  return nodes.map((node) => {
    const fullPath = parentPath ? `${parentPath}/${node.path}` : node.path;
    return {
      id: node.id,
      label: node.label,
      href: createCategoryLink(fullPath),
      count: node.cumulativePostCount,
      children: toNavNodes(node.children ?? [], fullPath),
    };
  });
}

interface CategorySidebarProps {
  /**
   * Category tree resolved on the server and streamed in via Suspense.
   * The parent creates the promise (without awaiting) so page content can
   * render immediately; this component unwraps it with React `use()`.
   */
  categoriesPromise: Promise<CategoryTreeNode[]>;
  defaultCollapsed?: boolean;
}

/**
 * Category navigation sidebar. Owns all post-domain logic — fetching is
 * triggered by the parent and awaited here via `use()`, the tree is mapped
 * to hrefs/labels/counts, and active-route detection feeds the generic
 * {@link Sidebar} through its renderItem prop.
 */
export function CategorySidebar({ categoriesPromise, defaultCollapsed }: CategorySidebarProps) {
  const categories = use(categoriesPromise);
  const items = useMemo(() => toNavNodes(categories), [categories]);
  const pathname = usePathname();

  return (
    <Sidebar
      items={items}
      title="Categories"
      storageKey="expanded-categories"
      defaultExpandedIds={['all']}
      defaultCollapsed={defaultCollapsed}
      emptyText="No categories found"
      renderItem={({ node, isExpanded }) => {
        const isActive = !!pathname && (pathname === node.href || pathname.startsWith(`${node.href}/`));
        return (
          <Link
            href={node.href}
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
              {node.count > 0 && <span className="text-sidebar-foreground/50 ml-2 shrink-0 text-xs">({node.count})</span>}
            </span>
          </Link>
        );
      }}
    />
  );
}
