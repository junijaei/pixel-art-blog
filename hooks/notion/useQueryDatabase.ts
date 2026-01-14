import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import type { UseQueryResult, UseInfiniteQueryResult } from '@tanstack/react-query';
import { notionKeys, createDatabaseQueryKey } from '@/lib/query/queryKeys';
import { notionQueryConfig } from '@/lib/query/queryClient';
import type { QueryOptions, InfiniteQueryOptions } from '@/lib/query/types';
import type { QueryDatabaseParameters } from '@/types/notion';
import type { QueryDatabaseResponse, DatabasePage } from '@/types/notion';

/**
 * Hook for querying a Notion database (single page)
 * 실제 queryFn은 구현 필요
 */
export function useQueryDatabase(
  params: QueryDatabaseParameters,
  options?: QueryOptions<QueryDatabaseResponse>
): UseQueryResult<QueryDatabaseResponse> {
  return useQuery({
    queryKey: createDatabaseQueryKey(params.database_id, {
      filter: params.filter,
      sorts: params.sorts,
      pageSize: params.page_size,
      cursor: params.start_cursor,
    }),
    queryFn: async (): Promise<QueryDatabaseResponse> => {
      // TODO: Implement actual query function
      throw new Error('Not implemented - queryFn for useQueryDatabase');
    },
    ...notionQueryConfig,
    ...options,
  });
}

/**
 * Hook for infinite query with pagination
 */
export function useInfiniteQueryDatabase(
  params: Omit<QueryDatabaseParameters, 'start_cursor'>,
  options?: InfiniteQueryOptions<QueryDatabaseResponse, Error, readonly unknown[], string | undefined>
): UseInfiniteQueryResult<QueryDatabaseResponse> {
  return useInfiniteQuery({
    queryKey: createDatabaseQueryKey(params.database_id, {
      filter: params.filter,
      sorts: params.sorts,
      pageSize: params.page_size,
    }),
    queryFn: async ({ pageParam }): Promise<QueryDatabaseResponse> => {
      // TODO: Implement actual query function with pageParam as cursor
      throw new Error('Not implemented - queryFn for useInfiniteQueryDatabase');
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => (lastPage.has_more ? (lastPage.next_cursor ?? undefined) : undefined),
    getPreviousPageParam: () => undefined,
    ...notionQueryConfig,
    ...options,
  });
}

/**
 * Hook for getting all pages from database (auto-pagination)
 */
export function useQueryDatabaseAll(
  params: Omit<QueryDatabaseParameters, 'start_cursor'>,
  options?: QueryOptions<DatabasePage[]>
): UseQueryResult<DatabasePage[]> {
  return useQuery({
    queryKey: [...createDatabaseQueryKey(params.database_id, { filter: params.filter, sorts: params.sorts }), 'all'],
    queryFn: async (): Promise<DatabasePage[]> => {
      // TODO: Implement fetching all pages with pagination
      throw new Error('Not implemented - queryFn for useQueryDatabaseAll');
    },
    ...notionQueryConfig,
    staleTime: notionQueryConfig.staleTime * 2, // Longer cache for full results
    ...options,
  });
}
