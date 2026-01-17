import { BlogFooter } from '@/components/blog-footer';
import { BlogHeader } from '@/components/blog-header';
import { DotDecoration } from '@/components/dot-decoration';
import { PostCard } from '@/components/post-card';
import { ISR_CONFIG } from '@/lib/notion/config';
import { getPostListItems } from '@/lib/notion/post.api';

// ISR 재검증 설정
export const revalidate = 1800; // ISR_CONFIG.REVALIDATE_TIME.POSTS_LIST;

export default async function PostsPage() {
  let posts = [];

  try {
    // Notion API에서 포스트 목록 가져오기
    const postListItems = await getPostListItems(ISR_CONFIG.POST_DATABASE_ID, ISR_CONFIG.CATEGORY_DATABASE_ID, {
      publishedOnly: true,
    });

    // PostCard 컴포넌트가 기대하는 형식으로 변환
    posts = postListItems.map((item) => ({
      slug: item.fullPath,
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
    posts = [];
  }

  return (
    <div className="flex min-h-screen flex-col">
      <BlogHeader />

      <main className="flex-1">
        {/* Header Section */}
        <section className="px-(--spacing-6) py-(--spacing-16)">
          <div className="mx-auto max-w-6xl">
            <div className="mb-(--spacing-6) flex items-center gap-(--spacing-4)">
              <DotDecoration variant="horizontal" />
              <span className="font-(family-name:--font-silkscreen) text-[10px] uppercase tracking-widest text-muted-foreground">
                All Posts
              </span>
            </div>

            <h1 className="mb-(--spacing-4) text-balance text-4xl font-bold leading-tight sm:text-5xl">
              All Articles
            </h1>

            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {posts.length > 0 ? `총 ${posts.length}개의 포스트` : '포스트가 없습니다.'}
            </p>
          </div>
        </section>

        {/* Posts Grid */}
        {posts.length > 0 && (
          <section className="px-(--spacing-6) pb-(--spacing-20)">
            <div className="mx-auto max-w-6xl">
              <div className="grid gap-(--spacing-6) sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
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
