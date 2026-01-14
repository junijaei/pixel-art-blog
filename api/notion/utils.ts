import type { Filter, Sorts } from '@/types/notion/query';
import { NOTION_LIMITS } from '@/lib/notion/constants';

/**
 * Validate page size parameter
 */
export function validatePageSize(pageSize?: number): number {
  if (!pageSize) {
    return NOTION_LIMITS.DEFAULT_PAGE_SIZE;
  }

  if (pageSize < 1) {
    return 1;
  }

  if (pageSize > NOTION_LIMITS.MAX_PAGE_SIZE) {
    return NOTION_LIMITS.MAX_PAGE_SIZE;
  }

  return pageSize;
}

/**
 * Sanitize filter to ensure it matches Notion API requirements
 */
export function sanitizeFilter(filter?: Filter): Filter | undefined {
  if (!filter) {
    return undefined;
  }

  // Remove undefined/null values
  return JSON.parse(JSON.stringify(filter));
}

/**
 * Sanitize sorts array
 */
export function sanitizeSorts(sorts?: Sorts): Sorts | undefined {
  if (!sorts || sorts.length === 0) {
    return undefined;
  }

  return sorts.filter((sort) => {
    if ('property' in sort) {
      return sort.property && sort.direction;
    }
    if ('timestamp' in sort) {
      return sort.timestamp && sort.direction;
    }
    return false;
  });
}

/**
 * Build query parameters with validation
 */
export function buildQueryParams(params: {
  filter?: Filter;
  sorts?: Sorts;
  start_cursor?: string;
  page_size?: number;
}) {
  return {
    filter: sanitizeFilter(params.filter),
    sorts: sanitizeSorts(params.sorts),
    start_cursor: params.start_cursor,
    page_size: validatePageSize(params.page_size),
  };
}

/**
 * Rate limiter helper
 */
export class RateLimiter {
  private queue: Array<() => void> = [];
  private processing = false;

  constructor(private maxPerSecond: number) {}

  async throttle<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  private async processQueue() {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }

    this.processing = true;
    const fn = this.queue.shift();

    if (fn) {
      await fn();
      await new Promise((resolve) => setTimeout(resolve, 1000 / this.maxPerSecond));
    }

    this.processQueue();
  }
}
