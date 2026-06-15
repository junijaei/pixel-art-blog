import { PixelDecoration, PostCard } from '@/components/ui';
import { findCategoryByPath, getAllDescendantIds, getCategories, getPosts, toPostCardData } from '@/lib/notion';
import type { PostCardData } from '@/types/notion';
import { capitalizeFirst } from '@/utils';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

// eslint-disable-next-line react-refresh/only-export-components
export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const hasCategory = slug && slug.length > 0;

  let title = '포스트';
  let description = '프론트엔드 개발자 전희재의 블로그 포스트 목록입니다.';
  let canonical = '/posts';
  let ogImages: { url: string; width: number; height: number; alt: string }[] | undefined;

  if (hasCategory) {
    try {
      const categoryPath = slug.at(-1)!;
      const categories = await getCategories();
      const categoryNode = findCategoryByPath(categories.tree, categoryPath);
      if (!categoryNode) return { title: '카테고리', robots: { index: false, follow: false } };

      title = categoryNode.label;
      description = `${categoryNode.label} 카테고리의 블로그 포스트 목록입니다.`;
      canonical = `/posts/${slug.join('/')}`;
      ogImages = [{ url: '/og-image.png', width: 1200, height: 630, alt: categoryNode.label }];
    } catch {
      return { title: '포스트', robots: { index: false, follow: false } };
    }
  }

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      ...(ogImages && { images: ogImages }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@junijaei',
      images: ['/og-image.png'],
    },
  };
}

export const revalidate = 3600; // 1시간
export const dynamicParams = true;

// eslint-disable-next-line react-refresh/only-export-components
export async function generateStaticParams() {
  try {
    const categories = await getCategories();
    return Array.from(categories.maps.byId.values()).map((cat) => ({
      slug: cat.fullPath ? cat.fullPath.split('/') : [cat.path],
    }));
  } catch {
    return [];
  }
}

export default async function PostsPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const hasCategory = slug && slug.length > 0;

  let posts: PostCardData[] = [];
  let categoryLabel = 'All';

  try {
    if (hasCategory) {
      const categoryPath = slug.at(-1)!;
      const categories = await getCategories();
      const categoryNode = findCategoryByPath(categories.tree, categoryPath);
      if (!categoryNode) notFound();

      categoryLabel = categoryNode.label;
      const categoryIds = new Set(getAllDescendantIds(categoryNode));
      const filteredPosts = await getPosts({ categoryIds });
      posts = toPostCardData(filteredPosts, categories.maps);
    } else {
      const [allPosts, categories] = await Promise.all([getPosts(), getCategories()]);
      posts = toPostCardData(allPosts, categories.maps);
    }
  } catch (error) {
    console.error('Failed to fetch posts from Notion:', error);
  }

  const countLabel = String(posts.length).padStart(2, '0');

  return (
    <main className="flex-1">
        {/* Page Header */}
        <section className="px-6 pt-16 sm:pt-24">
          <div className="mx-auto max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="font-pixel text-muted-foreground text-[10px] tracking-[0.3em] uppercase">Index</span>
              <PixelDecoration layout="horizontal" dotCount={3} gradientStart="start" className="opacity-35" />
              <div className="bg-border h-px flex-1" />
              <span className="font-pixel text-muted-foreground/50 text-[10px] tracking-widest tabular-nums">
                {countLabel} POSTS
              </span>
            </div>

            <h1 className="font-mulmaru mt-7 text-4xl leading-tight font-semibold tracking-tight break-keep sm:text-6xl">
              {capitalizeFirst(categoryLabel)}
            </h1>
          </div>
        </section>
        {/* Post Index */}
        <section className="px-6 pt-10 pb-24 sm:pt-14">
          <div className="mx-auto max-w-2xl">
            {posts.length > 0 ? (
              <div className="border-border/60 divide-border/60 divide-y border-y">
                {posts.map((post, i) => (
                  <PostCard
                    key={post.id}
                    index={i}
                    slug={post.slug}
                    title={post.title}
                    description={post.description}
                    date={post.date}
                    categoryPath={post.categoryPath}
                    categoryLabel={post.categoryLabel}
                  />
                ))}
              </div>
            ) : (
              <div className="border-border/60 flex flex-col items-center gap-5 border-y py-24">
                <PixelDecoration layout="grid" className="opacity-50" />
                <p className="font-pixel text-muted-foreground text-[10px] tracking-[0.3em] uppercase">No entries</p>
                <p className="text-muted-foreground text-sm">아직 작성된 포스트가 없습니다.</p>
              </div>
            )}
          </div>
        </section>
    </main>
  );
}
