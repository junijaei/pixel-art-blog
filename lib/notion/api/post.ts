import type { QueryDataSourceParameters } from '@notionhq/client/build/src/api-endpoints';

import { notionClient } from '@/lib/notion/api/client';
import { withRetry } from '@/lib/notion/api/retry';
import { NOTION_LIMITS } from '@/lib/notion/constants';
import type { PostPage } from '@/types/notion';

type DataSourceFilter = QueryDataSourceParameters['filter'];
type DataSourceSorts = QueryDataSourceParameters['sorts'];

export interface FetchPostPagesOptions {
  filter?: DataSourceFilter;
  sorts?: DataSourceSorts;
}

export async function fetchPostPages(databaseId: string, options: FetchPostPagesOptions = {}): Promise<PostPage[]> {
  const posts: PostPage[] = [];
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

    posts.push(...(response.results as PostPage[]));
    hasMore = response.has_more;
    cursor = response.next_cursor ?? undefined;
  }

  return posts;
}

export async function fetchPostPage(pageId: string): Promise<PostPage> {
  const page = await withRetry(() => notionClient.pages.retrieve({ page_id: pageId }));
  return page as PostPage;
}
