import { PostCardSkeleton } from '@/features/post/components';
import { Skeleton } from '@/shared/ui';

export default function PostsLoading() {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1 px-6 py-12 sm:py-20">
      <div className="mx-auto max-w-2xl">
        {/* SectionLabel — 레이블 + 헤어라인 + meta */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-3 w-12" />
          <div className="bg-border h-px flex-1" />
          <Skeleton className="h-3 w-16" />
        </div>

        {/* Title */}
        <Skeleton className="mt-6 h-10 w-1/3 sm:h-14" />

        {/* Post Index */}
        <div className="border-border/60 divide-border/60 mt-12 divide-y border-y">
          <PostCardSkeleton />
          <PostCardSkeleton />
          <PostCardSkeleton />
          <PostCardSkeleton />
          <PostCardSkeleton />
          <PostCardSkeleton />
        </div>
      </div>
    </main>
  );
}
