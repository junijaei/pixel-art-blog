import { getCategoryMaps, getPosts } from '@/lib/notion';
import type { MetadataRoute } from 'next';

export const revalidate = 3600;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/posts`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];

  try {
    const [posts, categoryMaps] = await Promise.all([getPosts(), getCategoryMaps()]);

    const categoryRoutes: MetadataRoute.Sitemap = Array.from(categoryMaps.byId.values()).map((cat) => ({
      url: `${SITE_URL}/posts/${cat.fullPath || cat.path}`,
      lastModified: new Date(cat.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    const postRoutes: MetadataRoute.Sitemap = posts.map((post) => {
      const category = categoryMaps.byId.get(post.categoryId);
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
    return staticRoutes;
  }
}
