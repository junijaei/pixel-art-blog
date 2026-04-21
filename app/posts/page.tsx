import { getPostCardsData } from '@/lib/notion';
import { PostCardData } from '@/types/notion';
import { PostsList } from './_components/posts-list';

export const revalidate = 3600; // 1시간

export default async function PostsPage() {
  let posts: PostCardData[] = [];

  try {
    posts = await getPostCardsData();
  } catch (error) {
    console.error('Failed to fetch posts from Notion:', error);
  }

  return <PostsList posts={posts} categoryLabel="All" />;
}
