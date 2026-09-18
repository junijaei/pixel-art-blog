import { HeroCosmos } from '@/app/(home)/_components/hero';
import { FrameLink } from '@/features/link-preview';
import { PostCard } from '@/features/post/components';
import { SectionLabel } from '@/shared/ui';
import { getCategories, getPosts, toPostCardData } from '@/features/post';
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
    <>
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
      <main id="main-content" tabIndex={-1} className="flex-1">
        {/* Hero Section */}
        <HeroCosmos />

        <div className="bg-border h-px w-full" />

        {/* Recent Posts */}
        {recentPosts.length > 0 && (
          <section className="px-6 py-12 sm:py-20">
            <div className="mx-auto max-w-2xl">
              <SectionLabel as="h2" meta={`${String(recentPosts.length).padStart(2, '0')} POSTS`}>
                Recent Posts
              </SectionLabel>

              <div className="divide-border/60 border-border/60 mt-6 divide-y border-y">
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
    </>
  );
}
