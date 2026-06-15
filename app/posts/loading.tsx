import { PostCardSkeleton, Skeleton } from '@/components/ui';

export default function PostsLoading() {
  return (
    <main className="flex-1">
        {/* Page Header */}
        <section className="px-6 pt-16 sm:pt-24">
          <div className="mx-auto max-w-2xl">
            <div className="flex items-center gap-3">
              <Skeleton className="h-3 w-12" />
              <div className="flex items-center gap-1.5">
                <Skeleton className="h-1.5 w-1.5 rounded-full" />
                <Skeleton className="h-1.5 w-1.5 rounded-full" />
                <Skeleton className="h-1.5 w-1.5 rounded-full" />
              </div>
              <div className="bg-border h-px flex-1" />
              <Skeleton className="h-3 w-16" />
            </div>

            <Skeleton className="mt-7 h-10 w-1/3 sm:h-14" />
          </div>
        </section>

        {/* Post Index */}
        <section className="px-6 pt-10 pb-24 sm:pt-14">
          <div className="mx-auto max-w-2xl">
            <div className="border-border/60 divide-border/60 divide-y border-y">
              <PostCardSkeleton />
              <PostCardSkeleton />
              <PostCardSkeleton />
              <PostCardSkeleton />
              <PostCardSkeleton />
              <PostCardSkeleton />
            </div>
          </div>
        </section>
    </main>
  );
}
