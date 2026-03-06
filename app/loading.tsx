import { BlogFooter, BlogHeader } from '@/components/layouts';
import { PostCardSkeleton, Skeleton } from '@/components/ui';

export default function HomeLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <BlogHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-2xl">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Skeleton className="h-1.5 w-1.5 rounded-full" />
                <Skeleton className="h-1.5 w-1.5 rounded-full" />
                <Skeleton className="h-1.5 w-1.5 rounded-full" />
              </div>
              <Skeleton className="h-3 w-24" />
            </div>

            <div className="mb-6 space-y-3">
              <Skeleton className="h-12 w-3/4 sm:h-14" />
              <Skeleton className="h-12 w-1/2 sm:h-14" />
            </div>

            <div className="mb-8 space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-4/5" />
            </div>

            <div className="flex items-center gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-2 w-2 rounded-full" />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="mb-16 px-6">
          <div className="mx-auto max-w-2xl">
            <PostCardSkeleton />
          </div>
        </section>

        {/* Recent Posts */}
        <section className="px-6">
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 flex items-center justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex flex-col gap-6">
              <PostCardSkeleton />
              <PostCardSkeleton />
              <PostCardSkeleton />
              <PostCardSkeleton />
            </div>
          </div>
        </section>
      </main>

      <BlogFooter />
    </div>
  );
}
