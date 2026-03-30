/**
 * Category Link - URL policy functions
 *
 * Pure functions for URL generation/parsing
 */

export function createCategoryLink(categoryFullPath: string): string {
  if (!categoryFullPath) return '/posts';
  return `/posts/${categoryFullPath}`;
}

export function createPostLink(categoryPath: string, postId: string): string {
  if (!categoryPath) {
    return `/${postId}`;
  }
  return `/${categoryPath}/${postId}`;
}

export function parsePostLink(pathSegments: string[]): { categoryPath: string; postId: string } | null {
  if (pathSegments.length === 0) {
    return null;
  }

  const postId = pathSegments[pathSegments.length - 1];
  const categoryPath = pathSegments.slice(0, -1).join('/');

  return {
    categoryPath,
    postId,
  };
}
