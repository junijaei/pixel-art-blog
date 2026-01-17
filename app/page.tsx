import { BlogFooter } from '@/components/blog-footer';
import { BlogHeader } from '@/components/blog-header';
import { DotDecoration } from '@/components/dot-decoration';
import { PixelArrow, PixelDot } from '@/components/pixel-icons';
import { PostCard } from '@/components/post-card';
import { ISR_CONFIG } from '@/lib/notion/config';
import { getPostListItems } from '@/lib/notion/post.api';
import Link from 'next/link';

// ISR 재검증 설정
export const revalidate = 3600; // ISR_CONFIG.REVALIDATE_TIME.HOME;

export default async function HomePage() {
  let posts: string | any[] = [];

  try {
    // Notion API에서 포스트 목록 가져오기
    const postListItems = await getPostListItems(ISR_CONFIG.POST_DATABASE_ID, ISR_CONFIG.CATEGORY_DATABASE_ID, {
      publishedOnly: true,
    });

    // PostCard 컴포넌트가 기대하는 형식으로 변환
    posts = postListItems.map((item) => ({
      slug: item.fullPath, // fullPath를 slug로 사용 (나중에 라우팅 개선 필요)
      title: item.title,
      excerpt: item.description || '내용이 없습니다.',
      date: new Date(item.publishedAt).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      category: item.categoryLabel,
      readTime: '5 min read', // TODO: 실제 계산 로직 추가
    }));
  } catch (error) {
    console.error('Failed to fetch posts from Notion:', error);
    // 에러 발생 시 빈 배열
    posts = [];
  }

  const featuredPost = posts[0];
  const recentPosts = posts.slice(1, 5);

  return (
    <div className="flex min-h-screen flex-col">
      <BlogHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-(--spacing-6) py-(--spacing-20)">
          <div className="mx-auto max-w-6xl">
            <div className="mb-(--spacing-6) flex items-center gap-(--spacing-4)">
              <DotDecoration variant="horizontal" />
              <span className="text-muted-foreground font-(family-name:--font-silkscreen) text-[10px] tracking-widest uppercase">
                Personal Blog
              </span>
            </div>

            <h1 className="mb-(--spacing-6) text-4xl leading-tight font-bold text-balance sm:text-5xl lg:text-6xl">
              Thoughts on design,
              <br />
              <span className="text-muted-foreground">pixels & minimalism</span>
            </h1>

            <p className="text-muted-foreground mb-(--spacing-8) max-w-xl text-lg leading-relaxed">
              Exploring the intersection of pixel aesthetics and modern design principles.
            </p>

            <div className="flex items-center gap-(--spacing-2)">
              {[...Array(8)].map((_, i) => (
                <PixelDot key={i} className={`h-2 w-2 ${i < 3 ? 'text-foreground' : 'text-muted-foreground/30'}`} />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && (
          <section className="mb-(--spacing-16) px-(--spacing-6)">
            <div className="mx-auto max-w-6xl">
              <PostCard post={featuredPost} featured />
            </div>
          </section>
        )}

        {/* Recent Posts */}
        {recentPosts.length > 0 && (
          <section className="px-(--spacing-6)">
            <div className="mx-auto max-w-6xl">
              <div className="mb-(--spacing-8) flex items-center justify-between">
                <div className="flex items-center gap-(--spacing-4)">
                  <h2 className="font-(family-name:--font-silkscreen) text-xs tracking-wider">RECENT POSTS</h2>
                  <DotDecoration variant="horizontal" className="opacity-50" />
                </div>

                <Link
                  href="/posts"
                  className="group text-muted-foreground hover:text-foreground flex items-center gap-(--spacing-2) text-sm transition-colors duration-(--duration-normal)"
                >
                  <span>View all</span>
                  <PixelArrow className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              <div className="grid gap-(--spacing-6) sm:grid-cols-2">
                {recentPosts.map((post) => (
                  <PostCard key={post.slug} post={post} />
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
