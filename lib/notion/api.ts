/**
 * Server-side Notion API functions
 * 빌드 타임 및 ISR에서만 사용
 */

import { notionClient } from './client';
import { NOTION_LIMITS } from './constants';
import type { QueryDatabaseParameters } from '@/types/notion';
import type { DatabasePage, QueryDatabaseResponse } from '@/types/notion';

/**
 * 데이터베이스의 모든 페이지를 가져오기 (자동 페이지네이션)
 */
export async function getAllPosts(databaseId: string): Promise<DatabasePage[]> {
  const posts: DatabasePage[] = [];
  let cursor: string | undefined = undefined;
  let hasMore = true;

  while (hasMore) {
    const response = await notionClient.databases.query({
      database_id: databaseId,
      page_size: NOTION_LIMITS.MAX_PAGE_SIZE,
      start_cursor: cursor,
      filter: {
        property: 'Status',
        select: {
          equals: 'Published',
        },
      },
      sorts: [
        {
          property: 'Created',
          direction: 'descending',
        },
      ],
    });

    posts.push(...(response.results as DatabasePage[]));
    hasMore = response.has_more;
    cursor = response.next_cursor ?? undefined;
  }

  return posts;
}

/**
 * 특정 포스트 가져오기
 */
export async function getPost(pageId: string): Promise<DatabasePage> {
  const page = await notionClient.pages.retrieve({
    page_id: pageId,
  });

  return page as DatabasePage;
}

/**
 * 포스트 슬러그로 페이지 찾기
 */
export async function getPostBySlug(databaseId: string, slug: string): Promise<DatabasePage | null> {
  const response = await notionClient.databases.query({
    database_id: databaseId,
    filter: {
      property: 'Slug',
      rich_text: {
        equals: slug,
      },
    },
  });

  const page = response.results[0] as DatabasePage | undefined;
  return page ?? null;
}

/**
 * generateStaticParams용 슬러그 목록 가져오기
 */
export async function getAllPostSlugs(databaseId: string): Promise<string[]> {
  const posts = await getAllPosts(databaseId);

  return posts
    .map((post) => {
      const slugProperty = post.properties.Slug;
      if (slugProperty?.type === 'rich_text' && slugProperty.rich_text.length > 0) {
        return slugProperty.rich_text[0].plain_text;
      }
      return null;
    })
    .filter((slug): slug is string => slug !== null);
}

/**
 * 페이지 블록 가져오기 (포스트 내용)
 */
export async function getPageBlocks(pageId: string) {
  const blocks: any[] = [];
  let cursor: string | undefined = undefined;
  let hasMore = true;

  while (hasMore) {
    const response = await notionClient.blocks.children.list({
      block_id: pageId,
      page_size: NOTION_LIMITS.MAX_PAGE_SIZE,
      start_cursor: cursor,
    });

    blocks.push(...response.results);
    hasMore = response.has_more;
    cursor = response.next_cursor ?? undefined;
  }

  return blocks;
}
