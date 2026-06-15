import { getCategories, getPosts } from '@/features/post';
import type { MetadataRoute } from 'next';

export const revalidate = 3600;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

// About 페이지 콘텐츠가 실제로 변경될 때 업데이트
const ABOUT_LAST_MODIFIED = new Date('2026-01-01');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const fallbackRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/posts`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: ABOUT_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.5 },
  ];

  try {
    const [posts, categories] = await Promise.all([getPosts(), getCategories()]);

    const latestPostDate =
      posts.length > 0 ? new Date(posts[0].updatedAt || posts[0].publishedAt) : ABOUT_LAST_MODIFIED;

    const staticRoutes: MetadataRoute.Sitemap = [
      { url: SITE_URL, lastModified: latestPostDate, changeFrequency: 'daily', priority: 1 },
      { url: `${SITE_URL}/posts`, lastModified: latestPostDate, changeFrequency: 'daily', priority: 0.9 },
      { url: `${SITE_URL}/about`, lastModified: ABOUT_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.5 },
    ];

    const categoryRoutes: MetadataRoute.Sitemap = Array.from(categories.maps.byId.values()).map((cat) => ({
      url: `${SITE_URL}/posts/${cat.fullPath || cat.path}`,
      lastModified: new Date(cat.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    const postRoutes: MetadataRoute.Sitemap = posts.map((post) => {
      const category = categories.maps.byId.get(post.categoryId);
      const fullPath = category?.fullPath || '';
      const slugPath = fullPath ? `${fullPath}/${post.slug}` : post.slug;
      return {
        url: `${SITE_URL}/${slugPath}`,
        lastModified: new Date(post.updatedAt || post.publishedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      };
    });

    return [...staticRoutes, ...categoryRoutes, ...postRoutes];
  } catch {
    return fallbackRoutes;
  }
}
