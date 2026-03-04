import { BlogFooter, BlogHeader } from '@/components/layouts';
import { PixelDecoration, PostCard } from '@/components/ui';
import { findCategoryByPath, getAllDescendantIds, getCategoryTree, getPostCardsData, getPosts } from '@/lib/notion';
import type { PostCardData } from '@/types/notion';
import { capitalizeFirst } from '@/utils/utils';

export const revalidate = 3600;

interface PostsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const { category } = await searchParams;
  let posts: PostCardData[] = [];
  let categoryLabel = 'All';

  try {
    if (category) {
      const [allPosts, categoryTree] = await Promise.all([getPosts(), getCategoryTree()]);

      const categoryNode = findCategoryByPath(categoryTree, category);
      if (categoryNode) {
        categoryLabel = categoryNode.label;
        const categoryIds = new Set(getAllDescendantIds(categoryNode));
        const filteredPosts = allPosts.filter((post) => categoryIds.has(post.categoryId));
        posts = await getPostCardsData(filteredPosts);
      }
    } else {
      posts = await getPostCardsData();
    }
  } catch (error) {
    console.error('Failed to fetch posts from Notion:', error);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <BlogHeader />

      <main className="flex-1">
        <section className="px-6 py-16">
          <div className="mx-auto max-w-2xl">
            <div className="mb-6 flex items-center gap-4">
              <PixelDecoration layout="horizontal" gradientStart="center" />
              <span className="text-muted-foreground font-galmuri9 text-[10px] tracking-widest uppercase">
                {capitalizeFirst(categoryLabel)} Posts
              </span>
            </div>

            <h1 className="font-mulmaru mb-4 text-4xl leading-tight font-bold sm:text-5xl">
              {capitalizeFirst(categoryLabel)}
            </h1>

            <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
              {posts.length > 0 ? `총 ${posts.length}개의 포스트` : '포스트가 없습니다.'}
            </p>
          </div>
        </section>

        {posts.length > 0 && (
          <section className="px-6 pb-20">
            <div className="mx-auto max-w-2xl">
              <div className="flex flex-col gap-6">
                {posts.map((post) => (
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
