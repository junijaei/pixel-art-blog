import { fetchBlocks, fetchBlocksChildren } from '@/features/post/api/block';
import { fetchCommentsForBlocks } from '@/features/post/api/comment';
import { processBlockTree } from '@/features/post/transform/block';
import { buildBreadcrumbItems } from '@/features/post/transform/categories';
import type { CategoriesQueryResult } from '@/features/post/query/categories';
import { getPosts } from '@/features/post/query/posts';
import type { BreadcrumbItem, TocItem } from '@/features/post/types';
import type { Block, BlockCommentRecord, CategoryWithFullPath, Post } from '@/features/post/model';
import { calculateReadingTime } from '@/shared/lib/utils';
import { unstable_cache } from 'next/cache';
import { cache } from 'react';

export interface PostContent {
  post: Post;
  blocks: Block[];
  commentMap: BlockCommentRecord;
  metadata: {
    tocItems: TocItem[];
    readingTime: string;
    breadcrumbs: BreadcrumbItem[];
    thumbnailUrl: string | null;
  };
  category: CategoryWithFullPath | null;
}

export interface GetPostOptions {
  slug: string;
  content?: false;
}

export interface GetPostContentOptions {
  slug: string;
  content: true;
  categories: CategoriesQueryResult;
}

const fetchPostBlocksCached = unstable_cache(
  async (postId: string, _updatedAt: string): Promise<{ enrichedBlocks: Block[]; commentMap: BlockCommentRecord }> => {
    const rawBlocks = await fetchBlocks(postId);
    const enrichedBlocks = await fetchBlocksChildren(rawBlocks, 10);
    const { blocks } = processBlockTree(enrichedBlocks);
    const blockIds = blocks.map((block) => block.id);
    const commentMap = await fetchCommentsForBlocks(blockIds);
    return { enrichedBlocks, commentMap };
  },
  ['notion-post-blocks'],
  { revalidate: 3600 }
);

const processPostCoverUrl = cache(
  async (coverUrl: string | null, postSlugId: string, lastEditedTime: string): Promise<string | null> => {
    if (!coverUrl) return null;

    const { processCoverImage } = await import('@/features/media/lib');
    return (await processCoverImage(coverUrl, postSlugId, lastEditedTime)) ?? coverUrl;
  }
);

async function findPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getPosts({ slug, limit: 1 });
  return posts[0] ?? null;
}

async function applyProcessedCover(post: Post): Promise<Post> {
  const processedCoverUrl = await processPostCoverUrl(post.coverUrl, post.slug, post.updatedAt);

  return processedCoverUrl !== post.coverUrl ? { ...post, coverUrl: processedCoverUrl } : post;
}

async function getPostContent(post: Post, categories: CategoriesQueryResult): Promise<PostContent> {
  const { enrichedBlocks, commentMap } = await fetchPostBlocksCached(post.id, post.updatedAt);
  const { blocks, metadata: blockMetadata } = processBlockTree(enrichedBlocks);

  if (blockMetadata.imageBlocks.length > 0) {
    const { processImageBlocks } = await import('@/features/media/lib');
    const stats = await processImageBlocks(blockMetadata.imageBlocks, post.slug);
    if (stats.totalImages > 0) {
      console.debug(`[PostQuery] Images: ${stats.uploaded} uploaded, ${stats.cached} cached, ${stats.failed} failed`);
    }
  }

  const category = categories.maps.byId.get(post.categoryId) ?? null;
  const breadcrumbs = buildBreadcrumbItems(category?.fullPath ?? '', categories.maps.byFullPath);
  const readingTime = calculateReadingTime(blockMetadata.plainText);

  return {
    post,
    blocks,
    commentMap,
    metadata: {
      tocItems: blockMetadata.tocItems,
      readingTime,
      breadcrumbs,
      thumbnailUrl: post.coverUrl,
    },
    category,
  };
}

export function getPost(options: GetPostContentOptions): Promise<PostContent | null>;
export function getPost(options: GetPostOptions): Promise<Post | null>;
export async function getPost(options: GetPostOptions | GetPostContentOptions): Promise<Post | PostContent | null> {
  const post = await findPostBySlug(options.slug);
  if (!post) return null;

  const processedPost = await applyProcessedCover(post);

  if (!options.content) {
    return processedPost;
  }

  return getPostContent(processedPost, options.categories);
}
