import { BlogFooter, BlogHeader } from '@/components/layouts';
import { PixelDecoration, PostCard } from '@/components/ui';
import { findCategoryByPath, getAllDescendantIds, getCategoryTree, getPostCardsData, getPosts } from '@/lib/notion';
import type { PostCardData } from '@/types/notion';
import { capitalizeFirst } from '@/utils/utils';
import { notFound } from 'next/navigation';

export const revalidate = 1800; // 30분

interface PostsCategoryPageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function PostsCategoryPage({ params }: PostsCategoryPageProps) {
  const { slug } = await params;
  const categoryPath = slug.join('/');

  let posts: PostCardData[] = [];
  let categoryLabel = '';

  try {
    const [allPosts, categoryTree] = await Promise.all([getPosts(), getCategoryTree()]);

    const categoryNode = findCategoryByPath(categoryTree, categoryPath);
    if (!categoryNode) {
      notFound();
    }

    categoryLabel = categoryNode.label;
    const categoryIds = new Set(getAllDescendantIds(categoryNode));
    const filteredPosts = allPosts.filter((post) => categoryIds.has(post.categoryId));
    posts = await getPostCardsData(filteredPosts);
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
