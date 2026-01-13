import { BlogHeader } from '@/components/blog-header';
import { BlogFooter } from '@/components/blog-footer';
import { PostCard } from '@/components/post-card';
import { DotDecoration } from '@/components/dot-decoration';
import { PixelDot } from '@/components/pixel-icons';
import { demoPosts } from '@/lib/demo-posts';

export default function PostsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <BlogHeader />

      <main className="flex-1 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          {/* Page Header */}
          <div className="mb-12">
            <div className="mb-4 flex items-center gap-4">
              <DotDecoration variant="horizontal" />
              <span className="text-muted-foreground font-[family-name:var(--font-silkscreen)] text-[10px] tracking-widest uppercase">
                Archive
              </span>
            </div>

            <h1 className="mb-4 text-3xl font-bold sm:text-4xl">All Posts</h1>

            <p className="text-muted-foreground">
              {demoPosts.length} articles about design, development, and creativity.
            </p>
          </div>

          {/* Posts Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {demoPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>

          {/* Bottom Decoration */}
          <div className="mt-16 flex justify-center">
            <div className="flex items-center gap-2">
              {[...Array(7)].map((_, i) => (
                <PixelDot
                  key={i}
                  className={`h-1.5 w-1.5 ${i === 3 ? 'text-foreground' : 'text-muted-foreground/30'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      <BlogFooter />
    </div>
  );
}
