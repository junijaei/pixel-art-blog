/**
 * Post Database API
 * 글 데이터베이스 서버 전용 API 함수
 */

import type {
  CategoryPage,
  Post,
  PostFilterOptions,
  PostListItem,
  PostPage,
  PostSortOptions
} from '@/types/notion';
import { NOTION_LIMITS } from '../config';
import { parseCategoryPage } from '../util';
import { getCategoryPath } from './category.api';
import { notionClient } from './client';

/**
 * 포스트 페이지를 파싱된 Post 객체로 변환
 */
export function parsePostPage(page: PostPage): Post {
  const properties = page.properties;

  // title (title 타입)
  const titleProp = properties.title;
  const title = titleProp?.type === 'title' && titleProp.title.length > 0 ? titleProp.title[0].plain_text : '';

  // category (관계형)
  const categoryProp = properties.category;
  const categoryId =
    categoryProp?.type === 'relation' && categoryProp.relation.length > 0 ? categoryProp.relation[0].id : '';

  // status (status 타입)
  const statusProp = properties.status;
  const status =
    statusProp?.type === 'status' && statusProp.status?.name
      ? (statusProp.status.name as 'scheduled' | 'draft' | 'completed')
      : 'draft';

  // description (text 타입)
  const descriptionProp = properties.description;
  const description =
    descriptionProp?.type === 'rich_text' && descriptionProp.rich_text.length > 0
      ? descriptionProp.rich_text[0].plain_text
      : '';

  // isPublished (checkbox 타입)
  const isPublishedProp = properties.isPublished;
  const isPublished = isPublishedProp?.type === 'checkbox' ? isPublishedProp.checkbox : false;

  // publishedAt (date 타입)
  const publishedAtProp = properties.publishedAt;
  const publishedAt = publishedAtProp?.type === 'date' && publishedAtProp.date?.start ? publishedAtProp.date.start : '';

  // slug (text 타입)
  const slugProp = properties.slug;
  const slug = slugProp?.type === 'rich_text' && slugProp.rich_text.length > 0 ? slugProp.rich_text[0].plain_text : '';

  // tag (multi-select 타입)
  const tagProp = properties.tag;
  const tags = tagProp?.type === 'multi_select' ? tagProp.multi_select.map((t) => t.name) : [];

  // createdAt
  const createdAtProp = properties.createdAt;
  const createdAt = createdAtProp?.type === 'created_time' ? createdAtProp.created_time : '';

  // updatedAt
  const updatedAtProp = properties.updatedAt;
  const updatedAt = updatedAtProp?.type === 'last_edited_time' ? updatedAtProp.last_edited_time : '';

  return {
    id: page.id,
    title,
    categoryId,
    status,
    description,
    isPublished,
    publishedAt,
    slug,
    tags,
    createdAt,
    updatedAt,
  };
}

/**
 * 모든 포스트 가져오기 (자동 페이지네이션)
 */
export async function getAllPosts(
  databaseId: string,
  options?: PostFilterOptions,
  sortOptions?: PostSortOptions
): Promise<PostPage[]> {
  const posts: PostPage[] = [];
  let cursor: string | undefined = undefined;
  let hasMore = true;

  // 필터 구성
  const filters: any[] = [];

  // publishedOnly 옵션 (기본값: true)
  if (options?.publishedOnly !== false) {
    filters.push({
      property: 'isPublished',
      checkbox: {
        equals: true,
      },
    });
  }

  // categoryId 옵션
  if (options?.categoryId) {
    filters.push({
      property: 'category',
      relation: {
        contains: options.categoryId,
      },
    });
  }

  // tag 옵션
  if (options?.tag) {
    filters.push({
      property: 'tag',
      multi_select: {
        contains: options.tag,
      },
    });
  }

  const filter = filters.length > 0 ? (filters.length === 1 ? filters[0] : { and: filters }) : undefined;

  // 정렬 옵션 (기본값: publishedAt 내림차순)
  const sort = sortOptions || { field: 'publishedAt', direction: 'descending' };

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

  return posts;
}

/**
 * 특정 포스트 가져오기
 */
export async function getPost(pageId: string): Promise<PostPage> {
  const page = await notionClient.pages.retrieve({
    page_id: pageId,
  });

  return page as PostPage;
}

/**
 * generateStaticParams용 모든 포스트 경로 가져오기
 * 반환 형식: [{ categoryPath: "front/react/hook", slug: "example" }, ...]
 */
export async function getAllPostPaths(
  postDatabaseId: string,
  categoryDatabaseId: string
): Promise<{ categoryPath: string; slug: string; fullPath: string }[]> {
  const posts = await getAllPosts(postDatabaseId, { publishedOnly: true });

  const paths = await Promise.all(
    posts.map(async (postPage) => {
      const post = parsePostPage(postPage);

      // 카테고리 경로 가져오기
      const categoryPath = await getCategoryPath(categoryDatabaseId, post.categoryId);

      return {
        categoryPath,
        slug: post.slug,
        fullPath: `${categoryPath}/${post.slug}`,
      };
    })
  );

  return paths.filter((path) => path.categoryPath !== '' && path.slug !== '');
}

/**
 * 페이지 블록 가져오기 (포스트 내용)
 * @deprecated `getPageBlocksWithChildren`을 사용하세요. 이 함수는 children을 가져오지 않습니다.
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

/**
 * 포스트 목록 아이템으로 변환 (요약 정보)
 */
export async function getPostListItems(
  postDatabaseId: string,
  categoryDatabaseId: string,
  options?: PostFilterOptions
): Promise<PostListItem[]> {
  const posts = await getAllPosts(postDatabaseId, options);

  const items = await Promise.all(
    posts.map(async (postPage) => {
      const post = parsePostPage(postPage);

      // 카테고리 정보 가져오기
      const categoryPage = await notionClient.pages.retrieve({ page_id: post.categoryId });
      const category = parseCategoryPage(categoryPage as CategoryPage);

      return {
        id: post.id,
        title: post.title,
        description: post.description,
        publishedAt: post.publishedAt,
        fullPath: `${category.path}/${post.slug}`,
        categoryLabel: category.label,
        tags: post.tags,
      };
    })
  );

  return items;
}
