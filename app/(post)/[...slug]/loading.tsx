import { Skeleton } from '@/shared/ui';

export default function PostLoading() {
  return (
    <main id="main-content" tabIndex={-1} className="w-full flex-1 px-6 py-12 sm:py-20">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <header>
          {/* 머리글 띠 — Breadcrumb + 날짜/읽는 시간 */}
          <div className="border-border flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-28" />
          </div>

          {/* Title — 실제 h1은 text-4xl sm:text-5xl 2줄까지 */}
          <div className="mt-8 space-y-2.5">
            <Skeleton className="h-9 w-full sm:h-11" />
            <Skeleton className="h-9 w-3/5 sm:h-11" />
          </div>

          {/* Description */}
          <div className="mt-4 space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/5" />
          </div>
        </header>

        {/* Cover */}
        <Skeleton className="mt-16 aspect-[1.91/1] w-full rounded-xl sm:mt-20" />

        {/* Article body */}
        <div className="mt-16 space-y-8 sm:mt-20">
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
