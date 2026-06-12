import { BlogFooter, BlogHeader } from '@/components/layouts';
import { PixelDecoration, PostCard } from '@/components/ui';
import type { PostCardData } from '@/types/notion';
import { capitalizeFirst } from '@/utils/utils';

interface PostsListProps {
  posts: PostCardData[];
  categoryLabel: string;
}

export function PostsList({ posts, categoryLabel }: PostsListProps) {
  const countLabel = String(posts.length).padStart(2, '0');

  return (
    <div className="flex min-h-screen flex-col">
      <BlogHeader />

      <main className="flex-1">
        {/* Page Header */}
        <section className="px-6 pt-16 sm:pt-24">
          <div className="mx-auto max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="font-pixel text-muted-foreground text-[10px] tracking-[0.3em] uppercase">Index</span>
              <PixelDecoration layout="horizontal" dotCount={3} gradientStart="start" className="opacity-35" />
              <div className="bg-border h-px flex-1" />
              <span className="font-pixel text-muted-foreground/50 text-[10px] tracking-widest tabular-nums">
                {countLabel} POSTS
              </span>
            </div>

            <h1 className="font-mulmaru mt-7 text-4xl leading-tight font-semibold tracking-tight break-keep sm:text-6xl">
              {capitalizeFirst(categoryLabel)}
            </h1>
          </div>
        </section>

        {/* Post Index */}
        <section className="px-6 pt-10 pb-24 sm:pt-14">
          <div className="mx-auto max-w-2xl">
            {posts.length > 0 ? (
              <div className="border-border/60 divide-border/60 divide-y border-y">
                {posts.map((post, i) => (
                  <PostCard
                    key={post.id}
                    index={i}
                    slug={post.slug}
                    title={post.title}
                    description={post.description}
                    date={post.date}
                    categoryPath={post.categoryPath}
                    categoryLabel={post.categoryLabel}
                  />
                ))}
              </div>
            ) : (
              <div className="border-border/60 flex flex-col items-center gap-5 border-y py-24">
                <PixelDecoration layout="grid" className="opacity-50" />
                <p className="font-pixel text-muted-foreground text-[10px] tracking-[0.3em] uppercase">No entries</p>
                <p className="text-muted-foreground text-sm">아직 작성된 포스트가 없습니다.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <BlogFooter />
    </div>
  );
}
