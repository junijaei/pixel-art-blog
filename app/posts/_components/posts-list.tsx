import { BlogFooter, BlogHeader } from '@/components/layouts';
import { PixelDecoration, PostCard } from '@/components/ui';
import type { PostCardData } from '@/types/notion';
import { capitalizeFirst } from '@/utils/utils';

interface PostsListProps {
  posts: PostCardData[];
  categoryLabel: string;
}

export function PostsList({ posts, categoryLabel }: PostsListProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <BlogHeader />

      <main className="flex-1">
        <section className="px-6 py-16">
          <div className="mx-auto max-w-2xl">
            <div className="mb-6 flex items-center gap-4">
              <PixelDecoration layout="horizontal" gradientStart="center" />
              <span className="text-muted-foreground font-galmuri9 text-[10px] tracking-widest uppercase">
                {capitalizeFirst(categoryLabel)} Posts
              </span>
            </div>

            <h1 className="font-mulmaru mb-4 text-4xl leading-tight font-bold sm:text-5xl">
              {capitalizeFirst(categoryLabel)}
            </h1>

            <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
              {posts.length > 0 ? `총 ${posts.length}개의 포스트` : '포스트가 없습니다.'}
            </p>
          </div>
        </section>

        {posts.length > 0 && (
          <section className="px-6 pb-20">
            <div className="mx-auto max-w-2xl">
              <div className="flex flex-col gap-6">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    slug={post.slug}
                    title={post.title}
                    description={post.description}
                    date={post.date}
                    categoryPath={post.categoryPath}
                    categoryLabel={post.categoryLabel}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <BlogFooter />
    </div>
  );
}
