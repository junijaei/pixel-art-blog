import type { QueryDataSourceParameters } from '@notionhq/client/build/src/api-endpoints';

import { fetchPostPages } from '@/lib/notion/api/post';
import { ISR_CONFIG, POST_PROPERTIES } from '@/lib/notion/constants';
import { getCategories } from '@/lib/notion/query/categories';
import { toPosts } from '@/lib/notion/transform';
import type { Post } from '@/types/notion';
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

const fetchPostsCached = unstable_cache(
  async () =>
    toPosts(
      await fetchPostPages(ISR_CONFIG.POST_DATABASE_ID, {
        filter: PUBLISHED_POST_FILTER,
        sorts: DEFAULT_POST_SORTS,
      })
    ),
  ['notion-published-posts'],
  { revalidate: 3600 }
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
