import { PixelChevronRight, PixelTag } from '@/components/ui/pixel-icons';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  path: string;
}

export interface BreadcrumbProps {
  /** 카테고리 경로 배열 (all -> category -> subcategory 형태) */
  items: BreadcrumbItem[];
  /** 현재 선택된 카테고리 path */
  currentPath?: string;
  className?: string;
}

/**
 * 포스트 상세 페이지의 카테고리 경로를 보여주는 Breadcrumb 컴포넌트
 * 각 항목 클릭 시 해당 카테고리의 posts 페이지로 이동
 */
export function Breadcrumb({ items, currentPath, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-1 text-xs', className)}>
      {/* 태그 아이콘 */}
      <PixelTag className="text-muted-foreground mr-1 h-3 w-3 shrink-0" />

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isCurrent = currentPath === item.path;
        const href = item.path ? `/posts?category=${item.path}` : '/posts';

        return (
          <span key={item.path || 'all'} className="flex items-center gap-1">
            <Link
              href={href}
              className={cn(
                'transition-colors ',
                isCurrent ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {item.label}
            </Link>

            {/* 구분자 - 마지막 항목 제외 */}
            {!isLast && <PixelChevronRight className="text-muted-foreground/50 mx-0.5 h-3 w-3 shrink-0" />}
          </span>
        );
      })}
    </nav>
  );
}
