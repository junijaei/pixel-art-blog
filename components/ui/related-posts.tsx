import { PixelClock, PixelDecoration, PixelTag } from '@/components/ui/pixel';
import { createPostLink } from '@/lib/notion/shared';
import type { PostCardData } from '@/types/notion';
import Link from 'next/link';

type RelatedPostCardProps = Omit<PostCardData, 'id' | 'description'>;

function RelatedPostCard({ slug, title, date, categoryPath, categoryLabel }: RelatedPostCardProps) {
  const href = createPostLink(categoryPath, slug);

  return (
    <Link
      href={href}
      className="group border-border bg-card hover:border-muted-foreground/30 flex flex-col gap-2.5 rounded-xl border p-4 transition-all duration-300"
    >
      <div className="text-muted-foreground flex items-center gap-1.5">
        <PixelTag className="h-2.5 w-2.5" />
        <span className="text-[10px]">{categoryLabel}</span>
      </div>

      <h3 className="group-hover:text-muted-foreground line-clamp-2 text-sm leading-snug font-medium transition-colors">
        {title}
      </h3>

      <div className="text-muted-foreground mt-auto flex items-center gap-1 text-[10px]">
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
      <div className="mb-4 flex items-center gap-3">
        <PixelDecoration layout="horizontal" dotCount={3} gradientStart="start" />
        <span className="font-galmuri9 text-muted-foreground text-[10px] tracking-widest uppercase">Related Posts</span>
        <div className="bg-border h-px flex-1" />
      </div>

      <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] sm:overflow-visible sm:pb-0">
        {posts.map((post) => (
          <div key={post.id} className="w-[220px] shrink-0 sm:w-auto sm:shrink">
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
