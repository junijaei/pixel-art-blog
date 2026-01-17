/**
 * Category Utility Functions
 * 카테고리 관련 유틸리티 함수
 */

import type { Category, Post } from '@/types/notion';

/**
 * 카테고리 경로와 포스트 ID로 포스트 링크 생성
 * 예: categoryPath = "tech/react/type", postId = "abc123" → "tech/react/type/abc123"
 */
export function createPostLink(categoryPath: string, postId: string): string {
  if (!categoryPath) {
    return `/${postId}`;
  }
  return `/${categoryPath}/${postId}`;
}

/**
 * 포스트와 카테고리로 포스트 링크 생성
 */
export function createPostLinkFromPost(post: Post, category: Category | null): string {
  if (!category) {
    return `/${post.id}`;
  }
  return createPostLink(category.path, post.id);
}

/**
 * URL 경로에서 카테고리 경로와 포스트 ID 추출
 * 예: "tech/react/type/abc123" → { categoryPath: "tech/react/type", postId: "abc123" }
 */
export function parsePostLink(pathSegments: string[]): { categoryPath: string; postId: string } | null {
  if (pathSegments.length === 0) {
    return null;
  }

  // 마지막 세그먼트가 포스트 ID
  const postId = pathSegments[pathSegments.length - 1];
  // 나머지가 카테고리 경로
  const categoryPath = pathSegments.slice(0, -1).join('/');

  return {
    categoryPath,
    postId,
  };
}
