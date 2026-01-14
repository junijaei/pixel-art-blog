/**
 * Post Query Hooks
 * 글 데이터 조회를 위한 React Query 훅
 */

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import type { UseQueryResult, UseInfiniteQueryResult } from '@tanstack/react-query';
import { notionQueryConfig } from '@/lib/query/queryClient';
import type { QueryOptions, InfiniteQueryOptions } from '@/lib/query/types';
import type {
  Post,
  PostWithCategory,
  PostListItem,
  PostFilterOptions,
  PostSortOptions,
} from '@/types/notion';

/**
 * Query Keys
 */
export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (databaseId: string, filters?: PostFilterOptions, sort?: PostSortOptions) =>
    [...postKeys.lists(), databaseId, filters, sort] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (postId: string) => [...postKeys.details(), postId] as const,
  byPath: () => [...postKeys.all, 'by-path'] as const,
  path: (categoryPath: string, slug: string) => [...postKeys.byPath(), categoryPath, slug] as const,
  listItems: () => [...postKeys.all, 'list-items'] as const,
  listItem: (databaseId: string, filters?: PostFilterOptions) => [...postKeys.listItems(), databaseId, filters] as const,
};

/**
 * 모든 포스트 조회
 */
export function usePosts(
  databaseId: string,
  filters?: PostFilterOptions,
  sort?: PostSortOptions,
  options?: QueryOptions<Post[]>
): UseQueryResult<Post[]> {
  return useQuery({
    queryKey: postKeys.list(databaseId, filters, sort),
    queryFn: async (): Promise<Post[]> => {
      // TODO: Implement actual query function
      throw new Error('Not implemented - queryFn for usePosts');
    },
    ...notionQueryConfig,
    ...options,
  });
}

/**
 * 무한 스크롤 포스트 조회
 */
export function useInfinitePosts(
  databaseId: string,
  filters?: PostFilterOptions,
  sort?: PostSortOptions,
  options?: InfiniteQueryOptions<PostListItem[], Error, readonly unknown[], string | undefined>
): UseInfiniteQueryResult<PostListItem[]> {
  return useInfiniteQuery({
    queryKey: postKeys.list(databaseId, filters, sort),
    queryFn: async ({ pageParam }): Promise<PostListItem[]> => {
      // TODO: Implement actual query function with pagination
      throw new Error('Not implemented - queryFn for useInfinitePosts');
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      // TODO: Implement next page logic
      return undefined;
    },
    getPreviousPageParam: () => undefined,
    ...notionQueryConfig,
    ...options,
  });
}

/**
 * 특정 포스트 상세 조회
 */
export function usePost(
  postId: string,
  options?: QueryOptions<Post>
): UseQueryResult<Post> {
  return useQuery({
    queryKey: postKeys.detail(postId),
    queryFn: async (): Promise<Post> => {
      // TODO: Implement actual query function
      throw new Error('Not implemented - queryFn for usePost');
    },
    ...notionQueryConfig,
    ...options,
  });
}

/**
 * 카테고리 경로와 슬러그로 포스트 찾기
 * 예: categoryPath = "front/react/hook", slug = "example"
 */
export function usePostByPath(
  categoryPath: string,
  slug: string,
  options?: QueryOptions<PostWithCategory | null>
): UseQueryResult<PostWithCategory | null> {
  return useQuery({
    queryKey: postKeys.path(categoryPath, slug),
    queryFn: async (): Promise<PostWithCategory | null> => {
      // TODO: Implement actual query function
      throw new Error('Not implemented - queryFn for usePostByPath');
    },
    ...notionQueryConfig,
    ...options,
  });
}

/**
 * 포스트 목록 아이템 조회 (요약 정보)
 */
export function usePostListItems(
  databaseId: string,
  filters?: PostFilterOptions,
  options?: QueryOptions<PostListItem[]>
): UseQueryResult<PostListItem[]> {
  return useQuery({
    queryKey: postKeys.listItem(databaseId, filters),
    queryFn: async (): Promise<PostListItem[]> => {
      // TODO: Implement actual query function
      throw new Error('Not implemented - queryFn for usePostListItems');
    },
    ...notionQueryConfig,
    ...options,
  });
}

/**
 * 특정 카테고리의 포스트만 조회
 */
export function usePostsByCategory(
  databaseId: string,
  categoryId: string,
  options?: QueryOptions<Post[]>
): UseQueryResult<Post[]> {
  return usePosts(
    databaseId,
    {
      publishedOnly: true,
      categoryId,
    },
    {
      field: 'publishedAt',
      direction: 'descending',
    },
    options
  );
}

/**
 * 특정 태그의 포스트만 조회
 */
export function usePostsByTag(
  databaseId: string,
  tag: string,
  options?: QueryOptions<Post[]>
): UseQueryResult<Post[]> {
  return usePosts(
    databaseId,
    {
      publishedOnly: true,
      tag,
    },
    {
      field: 'publishedAt',
      direction: 'descending',
    },
    options
  );
}
