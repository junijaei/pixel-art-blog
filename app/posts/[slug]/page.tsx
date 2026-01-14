import { BlogFooter } from '@/components/blog-footer';
import { BlogHeader } from '@/components/blog-header';
import { DotDecoration } from '@/components/dot-decoration';
import { PixelArrow, PixelClock, PixelDot, PixelTag } from '@/components/pixel-icons';
import { demoPosts, getPost } from '@/lib/demo-posts';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return demoPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <BlogHeader />

      <main className="flex-1 px-6 py-16">
        {/* Wide margin container for centered reading */}
        <div className="mx-auto max-w-2xl">
          {/* Back Link */}
          <Link
            href="/posts"
            className="text-muted-foreground hover:text-foreground group mb-12 inline-flex items-center gap-2 text-sm transition-colors"
          >
            <PixelArrow className="h-3 w-3 rotate-180 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to posts</span>
          </Link>

          {/* Article Header */}
          <header className="mb-12">
            <div className="mb-6 flex items-center gap-4">
              <div className="text-muted-foreground flex items-center gap-2">
                <PixelTag className="h-3 w-3" />
                <span className="text-xs">{post.category}</span>
              </div>
              <DotDecoration variant="horizontal" className="opacity-30" />
            </div>

            <h1 className="mb-6 text-3xl leading-tight font-bold text-balance sm:text-4xl">{post.title}</h1>

            <div className="text-muted-foreground flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <PixelClock className="h-3 w-3" />
                <span>{post.date}</span>
              </div>
              <span>·</span>
              <span>{post.readTime}</span>
            </div>
          </header>

          {/* Decorative Divider */}
          <div className="mb-12 flex items-center gap-3">
            <div className="bg-border h-px flex-1" />
            <div className="flex gap-1.5">
              {[...Array(5)].map((_, i) => (
                <PixelDot
                  key={i}
                  className={`h-1.5 w-1.5 ${i === 2 ? 'text-foreground' : 'text-muted-foreground/30'}`}
                />
              ))}
            </div>
            <div className="bg-border h-px flex-1" />
          </div>

          {/* Article Content */}
          <article className="prose prose-zinc dark:prose-invert max-w-none">
            {post.content.split('\n\n').map((paragraph, index) => {
              // Handle headings
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={index} className="mt-10 mb-4 flex items-center gap-3 text-xl font-semibold">
                    <PixelDot className="text-muted-foreground h-2 w-2" />
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-muted-foreground mt-8 mb-3 text-lg font-medium">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              // Handle lists
              if (paragraph.startsWith('- ')) {
                const items = paragraph.split('\n').filter((line) => line.startsWith('- '));
                return (
                  <ul key={index} className="my-4 space-y-2">
                    {items.map((item, i) => (
                      <li key={i} className="text-foreground/90 flex items-start gap-3">
                        <PixelDot className="text-muted-foreground/60 mt-2 h-1.5 w-1.5 shrink-0" />
                        <span className="leading-relaxed">{item.replace('- ', '').replace(/\*\*/g, '')}</span>
                      </li>
                    ))}
                  </ul>
                );
              }
              // Handle numbered lists
              if (paragraph.match(/^\d+\./)) {
                const items = paragraph.split('\n').filter((line) => line.match(/^\d+\./));
                return (
                  <ol key={index} className="my-4 space-y-2">
                    {items.map((item, i) => (
                      <li key={i} className="text-foreground/90 flex items-start gap-3">
                        <span className="text-muted-foreground mt-1 w-4 font-(family-name:--font-silkscreen) text-[10px]">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed">{item.replace(/^\d+\.\s*/, '')}</span>
                      </li>
                    ))}
                  </ol>
                );
              }
              // Regular paragraphs
              if (paragraph.trim()) {
                return (
                  <p key={index} className="text-foreground/90 mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                );
              }
              return null;
            })}
          </article>

          {/* Article Footer */}
          <footer className="border-border mt-16 border-t pt-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <DotDecoration variant="corner" />
                <span className="text-muted-foreground text-sm">Thanks for reading</span>
              </div>
              <Link
                href="/posts"
                className="hover:text-muted-foreground group flex items-center gap-2 text-sm transition-colors"
              >
                <span>More posts</span>
                <PixelArrow className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </footer>
        </div>
      </main>

      <BlogFooter />
    </div>
  );
}
