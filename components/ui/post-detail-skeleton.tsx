import { Skeleton } from '@/components/ui/skeleton';

/**
 * Skeleton placeholder for the post detail (article) page.
 * Mirrors the [...slug]/page.tsx article layout.
 */
export function PostDetailSkeleton() {
  return (
    <div className="mx-auto max-w-2xl">
      {/* Back link */}
      <Skeleton className="mb-12 h-4 w-24" />

      {/* Header */}
      <header className="mb-12">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-4">
          <Skeleton className="h-3 w-32" />
          <div className="flex flex-1 items-center gap-1">
            <Skeleton className="h-1.5 w-1.5 rounded-full" />
            <Skeleton className="h-1.5 w-1.5 rounded-full" />
            <Skeleton className="h-1.5 w-1.5 rounded-full" />
          </div>
        </div>

        {/* Title */}
        <Skeleton className="mb-6 h-9 w-4/5" />

        {/* Description */}
        <Skeleton className="mb-6 h-5 w-full" />

        {/* Metadata row */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-3 w-1" />
          <Skeleton className="h-3 w-16" />
        </div>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
      </header>

      {/* Divider */}
      <div className="mb-12 flex items-center gap-3">
        <div className="bg-border h-px flex-1" />
        <div className="flex items-center gap-1">
          <Skeleton className="h-1.5 w-1.5 rounded-full" />
          <Skeleton className="h-1.5 w-1.5 rounded-full" />
          <Skeleton className="h-1.5 w-1.5 rounded-full" />
        </div>
        <div className="bg-border h-px flex-1" />
      </div>

      {/* Article body */}
      <div className="space-y-8">
        {/* Paragraph group 1 */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Heading */}
        <Skeleton className="h-7 w-1/2" />

        {/* Paragraph group 2 */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Heading */}
        <Skeleton className="h-7 w-2/5" />

        {/* Paragraph group 3 */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}
