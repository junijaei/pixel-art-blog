import type { QueryDataSourceParameters } from '@notionhq/client/build/src/api-endpoints';

import { fetchPostPages } from '@/features/post/api/post';
import { ISR_CONFIG, POST_PROPERTIES } from '@/features/post/constants';
import { getCategories } from '@/features/post/query/categories';
import { toPosts } from '@/features/post/transform';
import type { Post } from '@/features/post/model';
import { unstable_cache } from 'next/cache';
import { cache } from 'react';

export interface GetPostsOptions {
  slug?: string;
  categoryId?: string;
  categoryIds?: Iterable<string>;
  tag?: string;
  tags?: Iterable<string>;
  relatedTo?: Post;
  limit?: number;
}

type DataSourceFilter = QueryDataSourceParameters['filter'];
type DataSourceSorts = QueryDataSourceParameters['sorts'];

const PUBLISHED_POST_FILTER: DataSourceFilter = {
  property: POST_PROPERTIES.IS_PUBLISHED,
  checkbox: {
    equals: true,
  },
};

const DEFAULT_POST_SORTS: DataSourceSorts = [
  {
    property: POST_PROPERTIES.PUBLISHED_AT,
    direction: 'descending',
  },
];

const POST_LIST_CACHE_TTL_SECONDS = 600;

const fetchPostsCached = unstable_cache(
  async () =>
    toPosts(
      await fetchPostPages(ISR_CONFIG.POST_DATABASE_ID, {
        filter: PUBLISHED_POST_FILTER,
        sorts: DEFAULT_POST_SORTS,
      })
    ),
  ['notion-published-posts'],
  // 버전 소스다. 여기서 온 updatedAt이 글 본문 캐시의 키가 된다.
  // 페이지 revalidate(3600)보다 짧아야 재생성 시점에 최신 버전을 집는다.
  // 같은 값이면 두 타이머가 어긋나 최악의 경우 한 주기를 통째로 날린다.
  { revalidate: POST_LIST_CACHE_TTL_SECONDS }
);

const getAllPosts = cache(async (): Promise<Post[]> => {
  if (process.env.NODE_ENV === 'development') {
    return toPosts(
      await fetchPostPages(ISR_CONFIG.POST_DATABASE_ID, {
        sorts: DEFAULT_POST_SORTS,
      })
    );
  }

  return fetchPostsCached();
});

function computeCategoryScore(currentFullPath: string, otherFullPath: string): number {
  if (!currentFullPath || !otherFullPath) return 0;

  const currentSegments = currentFullPath.split('/');
  const otherSegments = otherFullPath.split('/');
  const minLen = Math.min(currentSegments.length, otherSegments.length);

  let score = 0;
  for (let i = 0; i < minLen; i++) {
    if (currentSegments[i] === otherSegments[i]) score++;
    else break;
  }
  return score;
}

export async function getPosts(options: GetPostsOptions = {}): Promise<Post[]> {
  const allPosts = await getAllPosts();
  let posts = allPosts;

  if (options.slug) {
    posts = posts.filter((post) => post.slug === options.slug);
  }

  if (options.categoryId) {
    posts = posts.filter((post) => post.categoryId === options.categoryId);
  }

  if (options.categoryIds) {
    const categoryIds = new Set(options.categoryIds);
    posts = posts.filter((post) => categoryIds.has(post.categoryId));
  }

  if (options.tag) {
    posts = posts.filter((post) => post.tags.includes(options.tag!));
  }

  if (options.tags) {
    const tags = new Set(options.tags);
    posts = posts.filter((post) => post.tags.some((tag) => tags.has(tag)));
  }

  if (options.relatedTo) {
    const categories = await getCategories();
    const currentCategory = categories.maps.byId.get(options.relatedTo.categoryId);
    const currentFullPath = currentCategory?.fullPath ?? '';

    posts = posts
      .filter((post) => post.id !== options.relatedTo!.id && post.isPublished)
      .map((post) => {
        const category = categories.maps.byId.get(post.categoryId);
        const score = computeCategoryScore(currentFullPath, category?.fullPath ?? '');
        return { post, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return new Date(b.post.publishedAt).getTime() - new Date(a.post.publishedAt).getTime();
      })
      .map(({ post }) => post);
  }

  if (typeof options.limit === 'number') {
    posts = posts.slice(0, options.limit);
  }

  return posts;
}
