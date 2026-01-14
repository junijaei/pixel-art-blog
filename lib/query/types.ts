import type { UseQueryOptions, UseMutationOptions, UseInfiniteQueryOptions, QueryKey } from '@tanstack/react-query';

/**
 * Generic query options type with sensible defaults
 */
export type QueryOptions<TData, TError = Error, TQueryKey extends QueryKey = QueryKey> = Omit<
  UseQueryOptions<TData, TError, TData, TQueryKey>,
  'queryKey' | 'queryFn'
>;

/**
 * Generic infinite query options type
 */
export type InfiniteQueryOptions<
  TData,
  TError = Error,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown,
> = Omit<UseInfiniteQueryOptions<TData, TError, TData, TQueryKey, TPageParam>, 'queryKey' | 'queryFn'>;

/**
 * Generic mutation options type
 */
export type MutationOptions<TData, TError = Error, TVariables = void, TContext = unknown> = UseMutationOptions<
  TData,
  TError,
  TVariables,
  TContext
>;

/**
 * Infinite query specific options
 */
export interface InfiniteQueryConfig<TData> {
  initialPageParam?: string;
  getNextPageParam?: (lastPage: TData, allPages: TData[]) => string | undefined;
  getPreviousPageParam?: (firstPage: TData, allPages: TData[]) => string | undefined;
}
