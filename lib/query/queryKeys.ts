import type { QueryDatabaseParameters, Filter, Sorts } from '@/types/notion/query';
import { queryClient } from './queryClient';

/**
 * Query key factory for Notion API queries
 * Following TanStack Query best practices for key structure
 */
export const notionKeys = {
  all: ['notion'] as const,

  databases: () => [...notionKeys.all, 'databases'] as const,

  database: (databaseId: string) => [...notionKeys.databases(), databaseId] as const,

  databaseQuery: (params: QueryDatabaseParameters) =>
    [
      ...notionKeys.database(params.database_id),
      'query',
      {
        filter: params.filter,
        sorts: params.sorts,
        page_size: params.page_size,
      },
    ] as const,

  databaseQueryPage: (params: QueryDatabaseParameters, cursor?: string) =>
    [...notionKeys.databaseQuery(params), { cursor }] as const,

  pages: () => [...notionKeys.all, 'pages'] as const,

  page: (pageId: string) => [...notionKeys.pages(), pageId] as const,

  blocks: () => [...notionKeys.all, 'blocks'] as const,

  blockChildren: (blockId: string) => [...notionKeys.blocks(), blockId, 'children'] as const,

  users: () => [...notionKeys.all, 'users'] as const,

  user: (userId: string) => [...notionKeys.users(), userId] as const,

  search: (query: string, filters?: { property?: string; value?: string }) =>
    [...notionKeys.all, 'search', { query, filters }] as const,
} as const;

/**
 * Type-safe query key generator utilities
 */
export type NotionQueryKey =
  | typeof notionKeys.all
  | ReturnType<typeof notionKeys.databases>
  | ReturnType<typeof notionKeys.database>
  | ReturnType<typeof notionKeys.databaseQuery>
  | ReturnType<typeof notionKeys.databaseQueryPage>
  | ReturnType<typeof notionKeys.pages>
  | ReturnType<typeof notionKeys.page>
  | ReturnType<typeof notionKeys.blocks>
  | ReturnType<typeof notionKeys.blockChildren>
  | ReturnType<typeof notionKeys.users>
  | ReturnType<typeof notionKeys.user>
  | ReturnType<typeof notionKeys.search>;

/**
 * Helper to create database query key with type safety
 */
export function createDatabaseQueryKey(
  databaseId: string,
  options?: {
    filter?: Filter;
    sorts?: Sorts;
    pageSize?: number;
    cursor?: string;
  }
): readonly unknown[] {
  const params: QueryDatabaseParameters = {
    database_id: databaseId,
    filter: options?.filter,
    sorts: options?.sorts,
    page_size: options?.pageSize,
  };

  if (options?.cursor) {
    return notionKeys.databaseQueryPage(params, options.cursor);
  }

  return notionKeys.databaseQuery(params);
}

/**
 * Invalidation helpers
 */
export const invalidateNotionQueries = {
  all: () => queryClient.invalidateQueries({ queryKey: notionKeys.all }),
  databases: () => queryClient.invalidateQueries({ queryKey: notionKeys.databases() }),
  database: (databaseId: string) => queryClient.invalidateQueries({ queryKey: notionKeys.database(databaseId) }),
  pages: () => queryClient.invalidateQueries({ queryKey: notionKeys.pages() }),
  page: (pageId: string) => queryClient.invalidateQueries({ queryKey: notionKeys.page(pageId) }),
};
