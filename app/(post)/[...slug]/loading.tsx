import { Skeleton } from '@/shared/ui';

export default function PostLoading() {
  return (
    <main id="main-content" tabIndex={-1} className="w-full flex-1 px-6 py-12 sm:py-20">
      <div className="mx-auto max-w-2xl">
        {/* Back link */}
        <Skeleton className="mb-12 h-3 w-28" />

        {/* Header */}
        <header>
          {/* Breadcrumb */}
          <Skeleton className="h-3 w-32" />

          {/* Title — 실제 h1은 text-4xl sm:text-5xl 2줄까지 */}
          <div className="mt-6 space-y-2.5">
            <Skeleton className="h-9 w-full sm:h-11" />
            <Skeleton className="h-9 w-3/5 sm:h-11" />
          </div>

          {/* Description */}
          <div className="mt-5 space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/5" />
          </div>

          {/* Metadata */}
          <Skeleton className="mt-8 h-3 w-40" />
        </header>

        {/* 머리말과 본문의 경계 — 실제 페이지와 동일하게 헤어라인 하나 */}
        <div className="bg-border mt-12 mb-12 h-px w-full" />

        {/* Cover */}
        <Skeleton className="mb-12 aspect-[1.91/1] w-full rounded-xl" />

        {/* Article body */}
        <div className="space-y-8">
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          <Skeleton className="h-7 w-1/2" />

          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          <Skeleton className="h-7 w-2/5" />

          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    </main>
  );
}
