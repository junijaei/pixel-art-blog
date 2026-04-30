import {
  findCategoryByPath,
  getAllDescendantIds,
  getCategoryMaps,
  getCategoryTree,
  getPostCardsData,
  getPosts,
} from '@/lib/notion';
import type { PostCardData } from '@/types/notion';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PostsList } from '../_components/posts-list';

// eslint-disable-next-line react-refresh/only-export-components
export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const categoryPath = slug.at(-1)!;
  const slugPath = slug.join('/');

  try {
    const categoryTree = await getCategoryTree();
    const categoryNode = findCategoryByPath(categoryTree, categoryPath);
    if (!categoryNode) return { title: '카테고리' };

    return {
      title: categoryNode.label,
      description: `${categoryNode.label} 카테고리의 블로그 포스트 목록입니다.`,
      alternates: { canonical: `/posts/${slugPath}` },
      openGraph: {
        title: categoryNode.label,
        description: `${categoryNode.label} 카테고리의 블로그 포스트 목록입니다.`,
        url: `/posts/${slugPath}`,
        type: 'website',
      },
    };
  } catch {
    return { title: '포스트' };
  }
}

export const revalidate = 3600; // 1시간
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
