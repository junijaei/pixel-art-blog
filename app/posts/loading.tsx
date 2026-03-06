import { BlogFooter, BlogHeader } from '@/components/layouts';
import { PostCardSkeleton, Skeleton } from '@/components/ui';

export default function PostsLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <BlogHeader />

      <main className="flex-1">
        <section className="px-6 py-16">
          <div className="mx-auto max-w-2xl">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Skeleton className="h-1.5 w-1.5 rounded-full" />
                <Skeleton className="h-1.5 w-1.5 rounded-full" />
                <Skeleton className="h-1.5 w-1.5 rounded-full" />
              </div>
              <Skeleton className="h-3 w-20" />
            </div>

            <Skeleton className="mb-4 h-10 w-1/3 sm:h-12" />

            <Skeleton className="h-5 w-40" />
          </div>
        </section>

        <section className="px-6 pb-20">
          <div className="mx-auto max-w-2xl">
            <div className="flex flex-col gap-6">
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

      <BlogFooter />
    </div>
  );
}
