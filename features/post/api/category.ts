import type { QueryDataSourceParameters } from '@notionhq/client/build/src/api-endpoints';

import { notionClient } from '@/features/post/api/client';
import { withRetry } from '@/features/post/api/retry';
import { NOTION_LIMITS } from '@/features/post/constants';
import type { CategoryPage } from '@/features/post/model';

type DataSourceFilter = QueryDataSourceParameters['filter'];
type DataSourceSorts = QueryDataSourceParameters['sorts'];

export interface FetchCategoryPagesOptions {
  filter?: DataSourceFilter;
  sorts?: DataSourceSorts;
}

export async function fetchCategoryPages(
  databaseId: string,
  options: FetchCategoryPagesOptions = {}
): Promise<CategoryPage[]> {
  const categories: CategoryPage[] = [];
  let cursor: string | undefined = undefined;
  let hasMore = true;

  while (hasMore) {
    const response = await withRetry(() =>
      notionClient.dataSources.query({
        data_source_id: databaseId,
        page_size: NOTION_LIMITS.MAX_PAGE_SIZE,
        start_cursor: cursor,
        filter: options.filter,
        sorts: options.sorts,
      })
    );

    categories.push(...(response.results as CategoryPage[]));
    hasMore = response.has_more;
    cursor = response.next_cursor ?? undefined;
  }

  return categories;
}

export async function fetchCategoryPage(pageId: string): Promise<CategoryPage> {
  const page = await withRetry(() => notionClient.pages.retrieve({ page_id: pageId }));
  return page as CategoryPage;
}
