import { findCategoryByPath, getAllDescendantIds, getCategoryMaps, getCategoryTree, getPostCardsData, getPosts } from '@/lib/notion';
import type { PostCardData } from '@/types/notion';
import { notFound } from 'next/navigation';
import { PostsList } from '../_components/posts-list';

export const revalidate = 1800; // 30분
export const dynamicParams = true;

// eslint-disable-next-line react-refresh/only-export-components
export async function generateStaticParams() {
  try {
    const categoryMaps = await getCategoryMaps();
    return Array.from(categoryMaps.byId.values()).map((cat) => ({
      slug: cat.fullPath ? cat.fullPath.split('/') : [cat.path],
    }));
  } catch {
    return [];
  }
}

export default async function PostsCategoryPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const categoryPath = slug.at(-1)!; // 마지막 segment로 카테고리 탐색

  let posts: PostCardData[] = [];
  let categoryLabel = '';

  try {
    const [allPosts, categoryTree] = await Promise.all([getPosts(), getCategoryTree()]);
    const categoryNode = findCategoryByPath(categoryTree, categoryPath);
    if (!categoryNode) notFound();

    categoryLabel = categoryNode.label;
    const categoryIds = new Set(getAllDescendantIds(categoryNode));
    const filteredPosts = allPosts.filter((post) => categoryIds.has(post.categoryId));
    posts = await getPostCardsData(filteredPosts);
  } catch (error) {
    console.error('Failed to fetch posts from Notion:', error);
  }

  return <PostsList posts={posts} categoryLabel={categoryLabel} />;
}
