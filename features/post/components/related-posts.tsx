import { PixelClock, PixelDecoration, PixelTag } from '@/shared/ui/pixel';
import { createPostLink } from '@/features/post/routing';
import type { PostCardData } from '@/features/post/model';
import Link from 'next/link';

type RelatedPostCardProps = Omit<PostCardData, 'id' | 'description'>;

function RelatedPostCard({ slug, title, date, categoryPath, categoryLabel }: RelatedPostCardProps) {
  const href = createPostLink(categoryPath, slug);

  return (
    <Link
      href={href}
      className="group border-border/80 bg-card/80 hover:border-muted-foreground/35 hover:bg-card focus-visible:ring-ring flex min-h-full flex-1 flex-col gap-2.5 rounded-xl border p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      <div className="text-muted-foreground flex items-center gap-1.5">
        <PixelTag className="h-2.5 w-2.5" />
        <span className="text-[10px]">{categoryLabel}</span>
      </div>

      <h3 className="group-hover:text-foreground/75 line-clamp-2 text-sm leading-snug font-medium transition-colors">
        {title}
      </h3>

      <div className="text-muted-foreground mt-auto flex items-center gap-1 text-[10px] tabular-nums">
        <PixelClock className="h-2.5 w-2.5" />
        <span>{date}</span>
      </div>
    </Link>
  );
}

interface RelatedPostsProps {
  posts: PostCardData[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16">
      <div className="mb-4 flex items-center gap-3 pt-6">
        <PixelDecoration layout="horizontal" dotCount={3} gradientStart="start" className="opacity-45" />
        <span className="font-pixel text-muted-foreground text-[10px] tracking-[0.3em] uppercase">Related Posts</span>
        <div className="bg-border h-px flex-1" />
      </div>

      <div className="scrollbar-hide flex items-stretch gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] sm:overflow-visible sm:pb-0">
        {posts.map((post) => (
          <div key={post.id} className="flex w-55 shrink-0 sm:w-auto sm:shrink">
            <RelatedPostCard
              slug={post.slug}
              title={post.title}
              date={post.date}
              categoryPath={post.categoryPath}
              categoryLabel={post.categoryLabel}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
