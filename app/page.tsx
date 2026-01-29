import { BlogFooter, BlogHeader } from '@/components/layouts';
import { PixelArrow, PixelDecoration, PixelDot, PostCard } from '@/components/ui';
import { getPostCardsData } from '@/lib/notion';
import Link from 'next/link';

export default async function HomePage() {
  let postCards: Awaited<ReturnType<typeof getPostCardsData>> = [];

  try {
    postCards = await getPostCardsData();
  } catch (error) {
    console.error('Failed to fetch posts from Notion:', error);
  }

  const featuredPost = postCards[0];
  const recentPosts = postCards.slice(1, 5);

  return (
    <div className="flex min-h-screen flex-col">
      <BlogHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-2xl">
            <div className="mb-6 flex items-center gap-4">
              <PixelDecoration variant="horizontal" />
              <span className="text-muted-foreground font-pixel text-[10px] tracking-widest uppercase">
                Frontend Blog
              </span>
            </div>

            <h1 className="font-mulmaru mb-6 text-4xl leading-tight font-bold text-balance sm:text-5xl lg:text-6xl">
              Bit By Bit,
              <br />
              <span className="text-muted-foreground">One bit at a time</span>
            </h1>

            <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
              Bit by Bit는 작은 단위의 선택과 고민이 모여 하나의 결과를 만든다는 의미를 담고 있습니다.
              <br className="hidden sm:inline" /> 이 블로그에는 프론트엔드를 설계하고 구현하며 쌓아온 생각과 경험을
              기록합니다.
            </p>

            <div className="flex items-center gap-2">
              {[...Array(8)].map((_, i) => (
                <PixelDot key={i} className={`h-2 w-2 ${i < 3 ? 'text-foreground' : 'text-muted-foreground/30'}`} />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && (
          <section className="mb-16 px-6">
            <div className="mx-auto max-w-2xl">
              <PostCard
                title={featuredPost.title}
                description={featuredPost.description}
                date={featuredPost.date}
                slug={featuredPost.slug}
                categoryPath={featuredPost.categoryPath}
                categoryLabel={featuredPost.categoryLabel}
              />
            </div>
          </section>
        )}

        {/* Recent Posts */}
        {recentPosts.length > 0 && (
          <section className="px-6">
            <div className="mx-auto max-w-2xl">
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="font-pixel text-xs tracking-wider">RECENT POSTS</h2>
                  <PixelDecoration variant="horizontal" className="opacity-50" />
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
                    title={post.title}
                    description={post.description}
                    date={post.date}
                    slug={post.slug}
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
