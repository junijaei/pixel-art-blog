import { Skeleton } from '@/components/ui/skeleton';

/**
 * Skeleton placeholder that mirrors the PostCard layout.
 * Used in loading.tsx files for page navigation transitions.
 */
export function PostCardSkeleton() {
  return (
    <div className="border-border/80 bg-card/80 w-full rounded-xl border p-6">
      {/* Metadata row */}
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Skeleton className="h-2.5 w-2.5 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>

      {/* Title */}
      <Skeleton className="mb-2.5 h-6 w-3/4" />

      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
