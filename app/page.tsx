import { BlogFooter, BlogHeader } from '@/components/latouts';
import { DotDecoration, PixelArrow, PixelDot, PostCard } from '@/components/ui';
import { getAllCategories, getAllPosts, ISR_CONFIG, parseCategoryPage, parsePostPage } from '@/lib/notion';
import type { PostCardData } from '@/types/notion';
import Link from 'next/link';

// ISR 재검증 설정
export const revalidate = 3600; // ISR_CONFIG.REVALIDATE_TIME.HOME;

export default async function HomePage() {
  let posts: PostCardData[] = [];

  try {
    // 카테고리와 포스트 데이터 가져오기
    const [categoryPages, postPages] = await Promise.all([
      getAllCategories(ISR_CONFIG.CATEGORY_DATABASE_ID, { activeOnly: true }),
      getAllPosts(ISR_CONFIG.POST_DATABASE_ID, { publishedOnly: true }),
    ]);

    const allPosts = postPages.map(parsePostPage);

    // PostCard 컴포넌트가 기대하는 형식으로 변환
    posts = await Promise.all(
      allPosts.slice(0, 5).map(async (post) => {
        const categoryPage = categoryPages.find((cp) => {
          const parsed = parseCategoryPage(cp);
          return parsed.id === post.categoryId;
        });
        const postCategory = categoryPage ? parseCategoryPage(categoryPage) : null;

        return {
          id: post.id,
          title: post.title,
          description: post.description || '내용이 없습니다.',
          date: new Date(post.publishedAt).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          categoryPath: postCategory?.path || '',
          categoryLabel: postCategory?.label || '',
          tags: post.tags,
        } satisfies PostCardData;
      })
    );
  } catch (error) {
    console.error('Failed to fetch posts from Notion:', error);
    posts = [];
  }

  const featuredPost = posts[0];
  const recentPosts = posts.slice(1, 5);

  return (
    <div className="flex min-h-screen flex-col">
      <BlogHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-center gap-4">
              <DotDecoration variant="horizontal" />
              <span className="text-muted-foreground font-(family-name:--font-silkscreen) text-[10px] tracking-widest uppercase">
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
        {featuredPost && (
          <section className="mb-16 px-6">
            <div className="mx-auto max-w-6xl">
              <PostCard
                id={featuredPost.id}
                title={featuredPost.title}
                description={featuredPost.description}
                date={featuredPost.date}
                categoryPath={featuredPost.categoryPath}
                categoryLabel={featuredPost.categoryLabel}
                tags={featuredPost.tags}
              />
            </div>
          </section>
        )}

        {/* Recent Posts */}
        {recentPosts.length > 0 && (
          <section className="px-6">
            <div className="mx-auto max-w-6xl">
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="font-(family-name:--font-silkscreen) text-xs tracking-wider">RECENT POSTS</h2>
                  <DotDecoration variant="horizontal" className="opacity-50" />
                </div>

                <Link
                  href="/posts"
                  className="group text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors duration-(--duration-normal)"
                >
                  <span>View all</span>
                  <PixelArrow className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {recentPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    description={post.description}
                    date={post.date}
                    categoryPath={post.categoryPath}
                    categoryLabel={post.categoryLabel}
                    tags={post.tags}
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
