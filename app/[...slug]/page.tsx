import { BlogFooter, BlogHeader } from '@/components/layouts';
import { BlockRenderer } from '@/components/notion-blocks';
import {
  Breadcrumb,
  GiscusComments,
  PixelArrow,
  PixelClock,
  PixelDecoration,
  RelatedPosts,
  TocWithScrollSpy,
} from '@/components/ui';
import {
  getCategoryDataBundle,
  getCategoryMaps,
  getPostBySlug,
  getPostThumbnailUrl,
  getPostWithContent,
  getPosts,
  getRelatedPosts,
  parsePostLink,
} from '@/lib/notion';
import { formatDateKorean } from '@/utils/utils';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const revalidate = 3600; // 1시간
export const dynamicParams = true;

// eslint-disable-next-line react-refresh/only-export-components
export async function generateStaticParams() {
  try {
    const [posts, categoryMaps] = await Promise.all([getPosts(), getCategoryMaps()]);

    return posts.map((post) => {
      const category = categoryMaps.byId.get(post.categoryId);
      const fullPath = category?.fullPath || '';
      const slugPath = fullPath ? `${fullPath}/${post.slug}` : post.slug;
      return { slug: slugPath.split('/').filter(Boolean) };
    });
  } catch (error) {
    console.error('Failed to generate static params:', error);
    return [];
  }
}

// eslint-disable-next-line react-refresh/only-export-components
export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug: slugSegments } = await params;

  if (slugSegments.length === 0) return { title: 'Post Not Found' };

  const parsed = parsePostLink(slugSegments);
  if (!parsed) return { title: 'Post Not Found' };

  const [post, thumbnailUrl] = await Promise.all([getPostBySlug(parsed.postId), getPostThumbnailUrl(parsed.postId)]);
  if (!post) return { title: 'Post Not Found' };

  return {
    title: post.title + ' | Bit by Bit',
    description: post.description,
    openGraph: {
      title: post.title + ' | Bit by Bit',
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
      tags: post.tags,
      ...(thumbnailUrl && {
        images: [{ url: thumbnailUrl, alt: post.title }],
      }),
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug: slugSegments } = await params;

  if (slugSegments.length === 0) return notFound();

  const parsed = parsePostLink(slugSegments);
  if (!parsed) return notFound();

  // 카테고리 데이터 먼저 로드 (캐시됨)
  const categoryData = await getCategoryDataBundle();

  // notFound()는 CDN이 404를 캐시 → ISR revalidation 실패 시 영구 404 유발
  // API 에러는 throw하여 ISR이 기존 stale content를 유지하도록 함
  const postData = await getPostWithContent(parsed.postId, categoryData);
  if (!postData) return notFound();

  const { post, blocks, metadata, category } = postData;

  // 연관된 글 조회 (getPosts/getCategoryMaps 캐시 재사용 — 추가 API 호출 없음)
  const relatedPosts = await getRelatedPosts(post);

  return (
    <div className="flex min-h-screen flex-col">
      <BlogHeader />

      <main className="max-w-dvw flex-1 px-6 py-20">
        {metadata.tocItems.length > 0 && <TocWithScrollSpy items={metadata.tocItems} />}

        <div className="mx-auto max-w-2xl">
          {/* 뒤로 가기 */}
          <Link
            href="/posts"
            className="group text-muted-foreground hover:text-foreground mb-14 inline-flex items-center gap-2 text-sm transition-colors"
          >
            <PixelArrow className="h-3 w-3 rotate-180 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to posts</span>
          </Link>

          {/* 포스트 헤더 */}
          <header className="mb-14">
            <div className="mb-5 flex items-center gap-4">
              <Breadcrumb items={metadata.breadcrumbs} currentPath={category?.path || ''} />
              <PixelDecoration layout="horizontal" gradientStart="center" className="opacity-30" />
            </div>

            <h1 className="mb-5 text-3xl leading-tight font-bold break-keep sm:text-4xl">{post.title}</h1>

            {post.description && (
              <p className="text-muted-foreground mb-8 text-lg leading-relaxed">{post.description}</p>
            )}

            <div className="border-border flex flex-wrap items-center justify-between gap-4 border-t pt-5">
              <div className="text-muted-foreground flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <PixelClock className="mt-0.5 h-3 w-3" />
                  <time dateTime={post.publishedAt}>{formatDateKorean(post.publishedAt)}</time>
                </div>
                <span aria-hidden>·</span>
                <span>{metadata.readingTime}</span>
              </div>

              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-muted text-muted-foreground font-galmuri9 rounded-full px-3 py-1 text-[10px] tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </header>

          {/* 헤더 구분선 */}
          <div className="mb-14 flex items-center gap-3">
            <div className="bg-border h-px flex-1" />
            <PixelDecoration layout="horizontal" gradientStart="center" className="opacity-50" />
            <div className="bg-border h-px flex-1" />
          </div>

          {/* 본문 */}
          <article className="prose prose-neutral dark:prose-invert max-w-none">
            <BlockRenderer blocks={blocks} />
          </article>

          {/* 댓글 */}
          <section className="mt-32">
            <div className="mb-8 flex items-center gap-3">
              <PixelDecoration layout="horizontal" dotCount={3} gradientStart="start" />
              <span className="font-galmuri9 text-muted-foreground text-[10px] tracking-widest uppercase">
                Comments
              </span>
              <div className="bg-border h-px flex-1" />
            </div>
            <GiscusComments />
          </section>

          {/* 연관된 글 */}
          <RelatedPosts posts={relatedPosts} />

          {/* 하단 내비게이션 */}
          <footer className="mt-8">
            <div className="flex items-center justify-between">
              <PixelDecoration layout="corner" className="opacity-60" />
              <Link
                href="/posts"
                className="group text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
              >
                <span>All posts</span>
                <PixelArrow className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </footer>
        </div>
      </main>

      <BlogFooter />
    </div>
  );
}
