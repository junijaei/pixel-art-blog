import { BlogFooter, BlogHeader } from '@/components/layouts';
import { HeroCosmos, PixelArrow, PixelDecoration, PostCard } from '@/components/ui';
import { getPostCardsData } from '@/lib/notion';
import type { Metadata } from 'next';
import Link from 'next/link';

export const revalidate = 3600; // 1시간

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default async function HomePage() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  let postCards: Awaited<ReturnType<typeof getPostCardsData>> = [];

  try {
    postCards = await getPostCardsData();
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
          <section className="my-10 px-6 sm:my-16">
            <div className="mx-auto max-w-xl">
              <h2 className="font-pixel my-6 text-[11px] tracking-wider">RECENT POSTS</h2>

              <div className="flex flex-col items-center gap-5">
                {recentPosts.map((post) => (
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
                <Link
                  href="/posts"
                  className="group text-muted-foreground hover:text-foreground mx-auto mt-8 flex items-center gap-2 text-sm transition-colors"
                >
                  <span>전체 보기</span>
                  <PixelArrow className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>
      <BlogFooter />
    </div>
  );
}
