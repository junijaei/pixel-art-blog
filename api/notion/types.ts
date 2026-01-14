import type { QueryDatabaseParameters, QueryDatabaseResponse, Filter, Sorts } from '@/types/notion/query';
import type { DatabasePage } from '@/types/notion/response';

/**
 * Query database function signature
 * 실제 구현은 별도 파일에서 작성
 */
export type QueryDatabaseFn = (params: QueryDatabaseParameters) => Promise<QueryDatabaseResponse>;

/**
 * Get page function signature
 */
export type GetPageFn = (pageId: string) => Promise<DatabasePage>;

/**
 * Query database with pagination support
 */
export interface QueryDatabaseWithPaginationParams {
  database_id: string;
  filter?: Filter;
  sorts?: Sorts;
  page_size?: number;
}

export type QueryDatabaseWithPaginationFn = (
  params: QueryDatabaseWithPaginationParams
) => AsyncGenerator<DatabasePage[], void, unknown>;

/**
 * Batch query options
 */
export interface BatchQueryOptions {
  batchSize?: number;
  delayBetweenBatches?: number;
  maxConcurrent?: number;
}

/**
 * Rate limiting configuration
 */
export interface RateLimitConfig {
  maxRequestsPerSecond: number;
  retryAfter?: number;
  maxRetries?: number;
}

/**
 * Cache configuration for Notion queries
 */
export interface NotionCacheConfig {
  enabled: boolean;
  ttl: number; // Time to live in seconds
  key: string;
}
