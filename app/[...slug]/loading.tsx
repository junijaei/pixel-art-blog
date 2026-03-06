import { BlogFooter, BlogHeader } from '@/components/layouts';
import { PostDetailSkeleton } from '@/components/ui';

export default function PostLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <BlogHeader />

      <main className="max-w-dvw flex-1 px-6 py-16">
        <PostDetailSkeleton />
      </main>

      <BlogFooter />
    </div>
  );
}
