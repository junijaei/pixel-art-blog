/**
 * Post Database API
 * 글 데이터베이스 서버 전용 API 함수
 */

import { notionClient } from '@/lib/notion/core/client';
import type { Post, PostFilterOptions, PostPage, PostSortOptions, PropertyFilter } from '@/types/notion';
import { NOTION_LIMITS, POST_PROPERTIES, POST_STATUS } from './config';

/**
 * 포스트 페이지를 파싱된 Post 객체로 변환
 */
function parsePostPage(page: PostPage): Post {
  const props = page.properties;

  const idProp = props[POST_PROPERTIES.ID];
  const id = idProp?.type === 'unique_id' ? (idProp.unique_id.prefix || '') + idProp.unique_id.number : '';

  // title (title 타입)
  const titleProp = props[POST_PROPERTIES.TITLE];
  const title = titleProp?.type === 'title' && titleProp.title.length > 0 ? titleProp.title[0].plain_text : '';

  // category (관계형)
  const categoryProp = props[POST_PROPERTIES.CATEGORY];
  const categoryId =
    categoryProp?.type === 'relation' && categoryProp.relation.length > 0 ? categoryProp.relation[0].id : '';

  // status (status 타입)
  const statusProp = props[POST_PROPERTIES.STATUS];
  const status =
    statusProp?.type === 'status' && statusProp.status?.name
      ? (statusProp.status.name as 'scheduled' | 'draft' | 'completed')
      : POST_STATUS.DRAFT;

  // description (text 타입)
  const descriptionProp = props[POST_PROPERTIES.DESCRIPTION];
  const description =
    descriptionProp?.type === 'rich_text' && descriptionProp.rich_text.length > 0
      ? descriptionProp.rich_text[0].plain_text
      : '';

  // isPublished (checkbox 타입)
  const isPublishedProp = props[POST_PROPERTIES.IS_PUBLISHED];
  const isPublished = isPublishedProp?.type === 'checkbox' ? isPublishedProp.checkbox : false;

  // publishedAt (date 타입)
  const publishedAtProp = props[POST_PROPERTIES.PUBLISHED_AT];
  const publishedAt = publishedAtProp?.type === 'date' && publishedAtProp.date?.start ? publishedAtProp.date.start : '';

  // tag (multi-select 타입)
  const tagProp = props[POST_PROPERTIES.TAG];
  const tags = tagProp?.type === 'multi_select' ? tagProp.multi_select.map((t) => t.name) : [];

  // createdAt
  const createdAtProp = props[POST_PROPERTIES.CREATED_AT];
  const createdAt = createdAtProp?.type === 'created_time' ? createdAtProp.created_time : '';

  // updatedAt
  const updatedAtProp = props[POST_PROPERTIES.UPDATED_AT];
  const updatedAt = updatedAtProp?.type === 'last_edited_time' ? updatedAtProp.last_edited_time : '';

  return {
    id: page.id,
    title,
    categoryId,
    status,
    description,
    isPublished,
    publishedAt,
    slug: id,
    tags,
    createdAt,
    updatedAt,
  };
}

function generateFilterOptions(options?: PostFilterOptions): any {
  // 필터 구성
  const filters: any[] = [];

  // publishedOnly 옵션 (기본값: true)
  if (options?.publishedOnly !== false) {
    filters.push({
      property: POST_PROPERTIES.IS_PUBLISHED,
      checkbox: {
        equals: true,
      },
    });
  }

  // categoryId 옵션
  if (options?.categoryId) {
    if (Array.isArray(options.categoryId)) {
      const categoryFilter: PropertyFilter[] = [];
      options.categoryId.forEach((id) => {
        categoryFilter.push({
          property: POST_PROPERTIES.CATEGORY,
          relation: {
            contains: id,
          },
        });
      });
      filters.push({
        or: categoryFilter,
      });
    } else {
      filters.push({
        property: POST_PROPERTIES.CATEGORY,
        relation: {
          contains: options.categoryId,
        },
      });
    }
  }

  // tag 옵션
  if (options?.tag) {
    if (Array.isArray(options.tag)) {
      const tagFilter: PropertyFilter[] = [];
      options.tag.forEach((tag) => {
        tagFilter.push({
          property: POST_PROPERTIES.TAG,
          multi_select: {
            contains: tag,
          },
        });
      });
      filters.push({
        or: tagFilter,
      });
    } else {
      filters.push({
        property: POST_PROPERTIES.TAG,
        multi_select: {
          contains: options.tag,
        },
      });
    }
  }

  return filters.length > 0 ? (filters.length === 1 ? filters[0] : { and: filters }) : undefined;
}

/**
 * 모든 포스트 가져오기 (자동 페이지네이션)
 */
export async function fetchPosts(
  databaseId: string,
  options?: PostFilterOptions,
  sortOptions?: PostSortOptions
): Promise<Post[]> {
  const posts: PostPage[] = [];
  let cursor: string | undefined = undefined;
  let hasMore = true;

  const filter = generateFilterOptions(options);
  const sort = sortOptions
    ? sortOptions
    : ({ field: POST_PROPERTIES.PUBLISHED_AT, direction: 'descending' } as PostSortOptions);

  while (hasMore) {
    const response = await notionClient.dataSources.query({
      data_source_id: databaseId,
      page_size: NOTION_LIMITS.MAX_PAGE_SIZE,
      start_cursor: cursor,
      filter,
      sorts: [
        {
          property: sort.field,
          direction: sort.direction,
        },
      ],
    });

    posts.push(...(response.results as PostPage[]));
    hasMore = response.has_more;
    cursor = response.next_cursor ?? undefined;
  }

  return posts.map(parsePostPage);
}

/**
 * 특정 포스트 가져오기
 */
export async function fetchPost(pageId: string): Promise<Post> {
  const page = await notionClient.pages.retrieve({
    page_id: pageId,
  });

  return parsePostPage(page as PostPage);
}
