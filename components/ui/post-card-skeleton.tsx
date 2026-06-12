import { Skeleton } from '@/components/ui/skeleton';

/**
 * Skeleton placeholder that mirrors the PostCard index-row layout.
 * Used in loading.tsx files for page navigation transitions.
 */
export function PostCardSkeleton() {
  return (
    <div className="py-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-10">
        {/* Index + Date column */}
        <div className="flex items-baseline gap-3 sm:w-28 sm:shrink-0 sm:flex-col sm:gap-2.5 sm:pt-1.5">
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-3 w-20" />
        </div>

        {/* Content column */}
        <div className="min-w-0 flex-1 sm:pr-10">
          <Skeleton className="mb-3 h-3 w-16" />
          <Skeleton className="mb-3 h-6 w-3/4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
}
