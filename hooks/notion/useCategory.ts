/**
 * Category Query Hooks
 * 카테고리 데이터 조회를 위한 React Query 훅
 */

import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { notionQueryConfig } from '@/lib/query/queryClient';
import type { QueryOptions } from '@/lib/query/types';
import type { Category, CategoryTreeNode, CategoryFilterOptions } from '@/types/notion';

/**
 * Query Keys
 */
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (databaseId: string, filters?: CategoryFilterOptions) =>
    [...categoryKeys.lists(), databaseId, filters] as const,
  trees: () => [...categoryKeys.all, 'tree'] as const,
  tree: (databaseId: string) => [...categoryKeys.trees(), databaseId] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (categoryId: string) => [...categoryKeys.details(), categoryId] as const,
  paths: () => [...categoryKeys.all, 'path'] as const,
  path: (databaseId: string, path: string) => [...categoryKeys.paths(), databaseId, path] as const,
};

/**
 * 모든 카테고리 조회 (flat list)
 */
export function useCategories(
  databaseId: string,
  filters?: CategoryFilterOptions,
  options?: QueryOptions<Category[]>
): UseQueryResult<Category[]> {
  return useQuery({
    queryKey: categoryKeys.list(databaseId, filters),
    queryFn: async (): Promise<Category[]> => {
      // TODO: Implement actual query function
      throw new Error('Not implemented - queryFn for useCategories');
    },
    ...notionQueryConfig,
    ...options,
  });
}

/**
 * 카테고리 트리 구조 조회
 */
export function useCategoryTree(
  databaseId: string,
  options?: QueryOptions<CategoryTreeNode[]>
): UseQueryResult<CategoryTreeNode[]> {
  return useQuery({
    queryKey: categoryKeys.tree(databaseId),
    queryFn: async (): Promise<CategoryTreeNode[]> => {
      // TODO: Implement actual query function
      throw new Error('Not implemented - queryFn for useCategoryTree');
    },
    ...notionQueryConfig,
    staleTime: notionQueryConfig.staleTime * 3, // 더 긴 캐시 (트리 구조는 자주 변경되지 않음)
    ...options,
  });
}

/**
 * 특정 카테고리 상세 조회
 */
export function useCategory(
  categoryId: string,
  options?: QueryOptions<Category>
): UseQueryResult<Category> {
  return useQuery({
    queryKey: categoryKeys.detail(categoryId),
    queryFn: async (): Promise<Category> => {
      // TODO: Implement actual query function
      throw new Error('Not implemented - queryFn for useCategory');
    },
    ...notionQueryConfig,
    ...options,
  });
}

/**
 * 경로로 카테고리 찾기
 */
export function useCategoryByPath(
  databaseId: string,
  path: string,
  options?: QueryOptions<Category | null>
): UseQueryResult<Category | null> {
  return useQuery({
    queryKey: categoryKeys.path(databaseId, path),
    queryFn: async (): Promise<Category | null> => {
      // TODO: Implement actual query function
      throw new Error('Not implemented - queryFn for useCategoryByPath');
    },
    ...notionQueryConfig,
    ...options,
  });
}
