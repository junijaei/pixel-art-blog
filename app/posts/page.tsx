import { getCategories, getPosts, toPostCardData } from '@/lib/notion';
import { PostCardData } from '@/types/notion';
import type { Metadata } from 'next';
import { PostsList } from './_components/posts-list';

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  title: '포스트',
  description: '프론트엔드 개발자 전희재의 블로그 포스트 목록입니다.',
  alternates: { canonical: '/posts' },
  openGraph: {
    title: '포스트',
    description: '프론트엔드 개발자 전희재의 블로그 포스트 목록입니다.',
    url: '/posts',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '포스트',
    description: '프론트엔드 개발자 전희재의 블로그 포스트 목록입니다.',
    creator: '@junijaei',
    images: ['/og-image.png'],
  },
};

export const revalidate = 3600; // 1시간

export default async function PostsPage() {
  let posts: PostCardData[] = [];

  try {
    const [allPosts, categories] = await Promise.all([getPosts(), getCategories()]);
    posts = toPostCardData(allPosts, categories.maps);
  } catch (error) {
    console.error('Failed to fetch posts from Notion:', error);
  }

  return <PostsList posts={posts} categoryLabel="All" />;
}
