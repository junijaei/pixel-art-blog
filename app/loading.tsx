import { PostCardSkeleton } from '@/features/post/components';
import { Skeleton } from '@/shared/ui';

export default function HomeLoading() {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <section className="bg-background relative h-[calc(100dvh-60px)] min-h-150 w-full overflow-hidden transition-colors duration-700 md:h-[calc(100dvh-65px)]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
          <div className="via-background/20 to-background absolute inset-0 bg-radial-[circle_at_50%_50%] from-transparent" />
          <div className="from-background absolute inset-x-0 bottom-0 h-40 bg-linear-to-t to-transparent" />
        </div>

        <div className="relative flex h-full items-center justify-center px-6">
          <div className="flex max-w-5xl flex-col items-center text-center md:gap-12">
            <div className="mt-6 md:mt-0">
              <Skeleton className="mx-auto h-16 w-44 rounded-xl sm:h-24 sm:w-72 md:h-36 md:w-104" />
              <Skeleton className="mx-auto -mt-2 h-16 w-72 rounded-xl opacity-60 sm:h-24 sm:w-120 md:ml-8 md:h-36 md:w-152" />
            </div>

            <div className="mt-16 w-full max-w-2xl space-y-3 sm:mt-0">
              <Skeleton className="mx-auto h-3 w-full sm:h-4" />
              <Skeleton className="mx-auto h-3 w-4/5 sm:h-4" />
            </div>

            <Skeleton className="mt-6 h-12 w-40 rounded-sm sm:h-14 sm:w-44 md:mt-0" />
          </div>
        </div>
      </section>

      <div className="bg-border h-px w-full" />

      {/* Recent Posts */}
      <section className="px-6 py-12 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center gap-4">
            <Skeleton className="h-3 w-28" />
            <div className="bg-border h-px flex-1" />
            <Skeleton className="h-3 w-16" />
          </div>

          <div className="divide-border/60 border-border/60 mt-6 divide-y border-y">
            <PostCardSkeleton />
            <PostCardSkeleton />
            <PostCardSkeleton />
            <PostCardSkeleton />
            <PostCardSkeleton />
          </div>

          <Skeleton className="mx-auto mt-12 h-12 w-40 rounded-sm" />
        </div>
      </section>
    </main>
  );
}
