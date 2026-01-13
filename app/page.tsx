import { BlogHeader } from '@/components/blog-header';
import { BlogFooter } from '@/components/blog-footer';
import { PostCard } from '@/components/post-card';
import { DotDecoration } from '@/components/dot-decoration';
import { PixelArrow, PixelDot } from '@/components/pixel-icons';
import { demoPosts } from '@/lib/demo-posts';
import Link from 'next/link';

export default function HomePage() {
  const featuredPost = demoPosts[0];
  const recentPosts = demoPosts.slice(1, 5);

  return (
    <div className="flex min-h-screen flex-col">
      <BlogHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-center gap-4">
              <DotDecoration variant="horizontal" />
              <span className="text-muted-foreground font-[family-name:var(--font-silkscreen)] text-[10px] tracking-widest uppercase">
                Personal Blog
              </span>
            </div>

            <h1 className="mb-6 text-4xl leading-tight font-bold text-balance sm:text-5xl lg:text-6xl">
              Thoughts on design,
              <br />
              <span className="text-muted-foreground">pixels & minimalism</span>
            </h1>

            <p className="text-muted-foreground mb-8 max-w-xl text-lg leading-relaxed">
              Exploring the intersection of pixel aesthetics and modern design principles.
            </p>

            <div className="flex items-center gap-2">
              {[...Array(8)].map((_, i) => (
                <PixelDot key={i} className={`h-2 w-2 ${i < 3 ? 'text-foreground' : 'text-muted-foreground/30'}`} />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="mb-16 px-6">
          <div className="mx-auto max-w-6xl">
            <PostCard post={featuredPost} featured />
          </div>
        </section>

        {/* Recent Posts */}
        <section className="px-6">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="font-[family-name:var(--font-silkscreen)] text-xs tracking-wider">RECENT POSTS</h2>
                <DotDecoration variant="horizontal" className="opacity-50" />
              </div>

              <Link
                href="/posts"
                className="text-muted-foreground hover:text-foreground group flex items-center gap-2 text-sm transition-colors"
              >
                <span>View all</span>
                <PixelArrow className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {recentPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <BlogFooter />
    </div>
  );
}
