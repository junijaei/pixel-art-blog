import { Skeleton } from '@/components/ui/skeleton';

/**
 * Skeleton placeholder that mirrors the PostCard layout.
 * Used in loading.tsx files for page navigation transitions.
 */
export function PostCardSkeleton() {
  return (
    <div className="border-border bg-card rounded-xl border p-6">
      {/* Category row */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="h-1.5 w-1.5 rounded-full" />
          <Skeleton className="h-1.5 w-1.5 rounded-full" />
          <Skeleton className="h-1.5 w-1.5 rounded-full" />
        </div>
      </div>

      {/* Title */}
      <Skeleton className="mb-2 h-6 w-3/4" />

      {/* Description */}
      <div className="mb-4 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      {/* Metadata */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Skeleton className="h-2.5 w-2.5 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}
