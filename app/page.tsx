import { BlogFooter, BlogHeader } from '@/components/layouts';
import { HeroTitle, PixelArrow, PixelDecoration, PostCard } from '@/components/ui';
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

  const latestPost = postCards[0];
  const recentPosts = postCards.slice(1, 5);

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
        <section className="px-6 py-20">
          <div className="mx-auto max-w-2xl">
            <div className="mb-6 flex items-center gap-4">
              <PixelDecoration layout="horizontal" gradientStart="center" />
              <span className="text-muted-foreground font-pixel text-[10px] tracking-widest uppercase">
                Frontend Blog
              </span>
            </div>

            <HeroTitle />

            <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
              Bit by Bit는 작은 단위의 선택과 고민이 모여 하나의 결과를 만든다는 의미를 담고 있습니다.
              <br className="hidden sm:inline" /> 이 블로그에는 프론트엔드를 설계하고 구현하며 쌓아온 생각과 경험을
              기록합니다.
            </p>

            <PixelDecoration
              className="h-2 justify-end gap-2"
              size="md"
              layout="horizontal"
              dotCount={8}
              gradientStart="end"
            />
          </div>
        </section>

        {/* Latest Post */}
        <section className="mb-16 px-6">
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 flex items-center gap-4">
              <h2 className="font-pixel text-xs tracking-wider">LATEST POST</h2>
              <PixelDecoration layout="horizontal" gradientStart="center" className="opacity-50" />
            </div>
            <PostCard
              slug={latestPost.slug}
              title={latestPost.title}
              description={latestPost.description}
              date={latestPost.date}
              categoryPath={latestPost.categoryPath}
              categoryLabel={latestPost.categoryLabel}
            />
          </div>
        </section>

        {/* Recent Posts */}
        {recentPosts.length > 0 && (
          <section className="px-6">
            <div className="mx-auto max-w-2xl">
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="font-pixel text-xs tracking-wider">RECENT POSTS</h2>
                  <PixelDecoration layout="horizontal" gradientStart="center" className="opacity-50" />
                </div>

                <Link
                  href="/posts"
                  className="group text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
                >
                  <span>View all</span>
                  <PixelArrow className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              <div className="flex flex-col gap-6">
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
              </div>
            </div>
          </section>
        )}
      </main>
      <BlogFooter />
    </div>
  );
}
