/**
 * Notion Query Types
 */

import type { Filter } from '@/types/notion/query/filter';
import type { Sorts } from '@/types/notion/query/sort';

export * from './filter';
export * from './sort';

export interface QueryDatabaseParameters {
  database_id: string;
  filter?: Filter;
  sorts?: Sorts;
  start_cursor?: string;
  page_size?: number;
}

export interface QueryDatabaseRequestBody {
  filter?: Filter;
  sorts?: Sorts;
  start_cursor?: string;
  page_size?: number;
}
