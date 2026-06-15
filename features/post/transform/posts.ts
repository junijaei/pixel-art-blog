import { POST_PROPERTIES, POST_STATUS } from '@/features/post/constants';
import { extractCoverUrl } from '@/features/post/images';
import type { CategoryWithFullPath, Post, PostCardData, PostPage } from '@/features/post/model';
import { formatRelativeTime } from '@/shared/lib/utils';

export function toPost(page: PostPage): Post {
  const props = page.properties;

  const idProp = props[POST_PROPERTIES.ID];
  const id = idProp?.type === 'unique_id' ? `${idProp.unique_id.prefix || ''}${idProp.unique_id.number}` : '';

  const titleProp = props[POST_PROPERTIES.TITLE];
  const title =
    titleProp?.type === 'title' && titleProp.title.length > 0
      ? titleProp.title.map((richText) => richText.plain_text).join('')
      : '';

  const categoryProp = props[POST_PROPERTIES.CATEGORY];
  const categoryId =
    categoryProp?.type === 'relation' && categoryProp.relation.length > 0 ? categoryProp.relation[0].id : '';

  const statusProp = props[POST_PROPERTIES.STATUS];
  const status =
    statusProp?.type === 'status' && statusProp.status?.name
      ? (statusProp.status.name as 'scheduled' | 'draft' | 'completed')
      : POST_STATUS.DRAFT;

  const descriptionProp = props[POST_PROPERTIES.DESCRIPTION];
  const description =
    descriptionProp?.type === 'rich_text' && descriptionProp.rich_text.length > 0
      ? descriptionProp.rich_text[0].plain_text
      : '';

  const isPublishedProp = props[POST_PROPERTIES.IS_PUBLISHED];
  const isPublished = isPublishedProp?.type === 'checkbox' ? isPublishedProp.checkbox : false;

  const publishedAtProp = props[POST_PROPERTIES.PUBLISHED_AT];
  const publishedAt = publishedAtProp?.type === 'date' && publishedAtProp.date?.start ? publishedAtProp.date.start : '';

  const tagProp = props[POST_PROPERTIES.TAG];
  const tags = tagProp?.type === 'multi_select' ? tagProp.multi_select.map((tag) => tag.name) : [];

  const createdAtProp = props[POST_PROPERTIES.CREATED_AT];
  const createdAt = createdAtProp?.type === 'created_time' ? createdAtProp.created_time : '';

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
    coverUrl: extractCoverUrl(page.cover),
  };
}

export function toPosts(pages: PostPage[]): Post[] {
  return pages.map(toPost);
}

export function toPostCardData(
  posts: Post[],
  categoryMaps: {
    byId: Map<string, CategoryWithFullPath>;
  }
): PostCardData[] {
  return posts.map((post) => {
    const category = categoryMaps.byId.get(post.categoryId);

    return {
      id: post.id,
      title: post.title,
      description: post.description || '내용이 없습니다.',
      date: formatRelativeTime(post.publishedAt),
      slug: post.slug,
      categoryPath: category?.fullPath || '',
      categoryLabel: category?.label || '',
    };
  });
}
