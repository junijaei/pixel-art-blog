import { BlogFooter, BlogHeader } from '@/components/latouts';
import { DotDecoration, PostCard } from '@/components/ui';
import {
    buildCategoryTree,
    getAllCategories,
    getAllPosts,
    ISR_CONFIG,
    parseCategoryPage,
    parsePostPage,
} from '@/lib/notion';
import type { CategoryTreeNode, PostCardData } from '@/types/notion';

// ISR 재검증 설정
export const revalidate = 1800;

interface PostsPageProps {
  searchParams: Promise<{ category?: string }>;
}

/**
 * 카테고리 경로로 카테고리 찾기 (트리에서)
 */
function findCategoryByPath(tree: CategoryTreeNode[], path: string): CategoryTreeNode | null {
  for (const node of tree) {
    if (node.path === path) {
      return node;
    }
    if (node.children.length > 0) {
      const found = findCategoryByPath(node.children, path);
      if (found) return found;
    }
  }
  return null;
}

/**
 * 카테고리와 모든 하위 카테고리 ID 수집
 */
function getAllDescendantIds(node: CategoryTreeNode): string[] {
  const ids = [node.id];
  node.children.forEach((child) => {
    ids.push(...getAllDescendantIds(child));
  });
  return ids;
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const { category } = await searchParams;
  let posts: PostCardData[] = [];
  let categoryLabel = 'All Posts';

  try {
    // 카테고리와 포스트 데이터 가져오기
    const [categoryPages, postPages] = await Promise.all([
      getAllCategories(ISR_CONFIG.CATEGORY_DATABASE_ID, { activeOnly: true }),
      getAllPosts(ISR_CONFIG.POST_DATABASE_ID, { publishedOnly: true }),
    ]);

    const categories = categoryPages.map(parseCategoryPage);
    const allPosts = postPages.map(parsePostPage);
    const categoryTree = buildCategoryTree(categories);

    // 카테고리 필터링
    if (category) {
      const categoryNode = findCategoryByPath(categoryTree, category);
      if (categoryNode) {
        categoryLabel = categoryNode.label;
        const categoryIds = new Set(getAllDescendantIds(categoryNode));
        const filteredPosts = allPosts.filter((post) => categoryIds.has(post.categoryId));

        // PostCard 컴포넌트가 기대하는 형식으로 변환
        posts = await Promise.all(
          filteredPosts.map(async (post) => {
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
      } else {
        // 카테고리를 찾을 수 없으면 빈 배열
        posts = [];
      }
    } else {
      // 카테고리가 없으면 전체 포스트
      posts = await Promise.all(
        allPosts.map(async (post) => {
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
    }
  } catch (error) {
    console.error('Failed to fetch posts from Notion:', error);
    posts = [];
  }

  return (
    <div className="flex min-h-screen flex-col">
      <BlogHeader />

      <main className="flex-1">
        {/* Header Section */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-center gap-4">
              <DotDecoration variant="horizontal" />
              <span className="text-muted-foreground font-(family-name:--font-silkscreen) text-[10px] tracking-widest uppercase">
                All Posts
              </span>
            </div>

            <h1 className="mb-4 text-4xl leading-tight font-bold sm:text-5xl">{categoryLabel}</h1>

            <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
              {posts.length > 0 ? `총 ${posts.length}개의 포스트` : '포스트가 없습니다.'}
            </p>
          </div>
        </section>

        {/* Posts Grid */}
        {posts.length > 0 && (
          <section className="px-6 pb-20">
            <div className="mx-auto max-w-6xl">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
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
