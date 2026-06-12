import { BlogFooter, BlogHeader } from '@/components/layouts';
import { FrameLink, HeroCosmos, PixelDecoration, PostCard } from '@/components/ui';
import { getCategories, getPosts, toPostCardData } from '@/lib/notion';
import type { Metadata } from 'next';

export const revalidate = 3600; // 1시간

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default async function HomePage() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  let postCards: ReturnType<typeof toPostCardData> = [];

  try {
    const [posts, categories] = await Promise.all([getPosts(), getCategories()]);
    postCards = toPostCardData(posts, categories.maps);
  } catch (error) {
    console.error('Failed to fetch posts from Notion:', error);
  }

  const recentPosts = postCards.slice(0, 5);

  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Bit by Bit',
            description: '프론트엔드 개발자 전희재의 블로그입니다.',
            url: siteUrl,
            author: {
              '@type': 'Person',
              name: '전희재',
              url: 'https://github.com/junijaei',
            },
          }),
        }}
      />
      <BlogHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroCosmos />

        <div className="flex w-full items-center gap-3">
          <div className="bg-border h-px flex-1" />
          <PixelDecoration layout="horizontal" dotCount={3} gradientStart="center" className="opacity-30" />
          <div className="bg-border h-px flex-1" />
        </div>

        {/* Recent Posts */}
        {recentPosts.length > 0 && (
          <section className="px-6 py-14 sm:py-20">
            <div className="mx-auto max-w-2xl">
              <div className="flex items-center gap-3">
                <h2 className="font-pixel text-muted-foreground text-[10px] tracking-[0.3em] uppercase">
                  Recent Posts
                </h2>
                <PixelDecoration layout="horizontal" dotCount={3} gradientStart="start" className="opacity-35" />
                <div className="bg-border h-px flex-1" />
                <span className="font-pixel text-muted-foreground/50 text-[10px] tracking-widest tabular-nums">
                  {String(recentPosts.length).padStart(2, '0')} ENTRIES
                </span>
              </div>

              <div className="divide-border/60 border-border/60 mt-3 divide-y border-b">
                {recentPosts.map((post, i) => (
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

              <div className="mt-12 flex justify-center">
                <FrameLink href="/posts">전체 글 보기</FrameLink>
              </div>
            </div>
          </section>
        )}
      </main>
      <BlogFooter />
    </div>
  );
}
