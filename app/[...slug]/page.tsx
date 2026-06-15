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
import { getCategories, getPost, getPosts, parsePostLink, toPostCardData } from '@/lib/notion';
import { formatDateKorean } from '@/utils/utils';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 3600; // 1시간
export const dynamicParams = true;

// eslint-disable-next-line react-refresh/only-export-components
export async function generateStaticParams() {
  try {
    const [posts, categories] = await Promise.all([getPosts(), getCategories()]);

    return posts.map((post) => {
      const category = categories.maps.byId.get(post.categoryId);
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

  if (slugSegments.length === 0) return { title: 'Post Not Found', robots: { index: false, follow: false } };

  const parsed = parsePostLink(slugSegments);
  if (!parsed) return { title: 'Post Not Found', robots: { index: false, follow: false } };

  const post = await getPost({ slug: parsed.postId });
  if (!post) return { title: 'Post Not Found', robots: { index: false, follow: false } };

  const canonicalPath = slugSegments.join('/');

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/${canonicalPath}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
      locale: 'ko_KR',
      siteName: 'Bit by Bit',
      url: `/${canonicalPath}`,
      ...(post.coverUrl && {
        images: [{ url: post.coverUrl, width: 1200, height: 630, alt: post.title }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      ...(post.coverUrl && { images: [post.coverUrl] }),
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug: slugSegments } = await params;

  if (slugSegments.length === 0) return notFound();

  const parsed = parsePostLink(slugSegments);
  if (!parsed) return notFound();

  // 카테고리 데이터 먼저 로드 (캐시됨)
  const categories = await getCategories();

  // notFound()는 CDN이 404를 캐시 → ISR revalidation 실패 시 영구 404 유발
  // API 에러는 throw하여 ISR이 기존 stale content를 유지하도록 함
  const postData = await getPost({ slug: parsed.postId, content: true, categories });
  if (!postData) return notFound();

  const { post, blocks, commentMap, metadata, category } = postData;

  // 커버 있으면 첫 번째 블록이 이미지인 경우 중복 방지로 제거
  const displayBlocks = post.coverUrl && blocks[0]?.type === 'image' ? blocks.slice(1) : blocks;

  // 연관된 글 조회 (getPosts/getCategories 캐시 재사용 — 추가 API 호출 없음)
  const relatedPosts = toPostCardData(await getPosts({ relatedTo: post, limit: 3 }), categories.maps);

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  const postUrl = `${siteUrl}/${slugSegments.join('/')}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            ...(post.description && { description: post.description }),
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
            author: { '@type': 'Person', name: '전희재', url: 'https://github.com/junijaei' },
            publisher: {
              '@type': 'Organization',
              name: 'Bit by Bit',
              url: siteUrl,
              logo: { '@type': 'ImageObject', url: `${siteUrl}/og-image.png` },
            },
            url: postUrl,
            mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
            ...(metadata.thumbnailUrl && { image: metadata.thumbnailUrl }),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
              ...metadata.breadcrumbs.map((crumb, i) => ({
                '@type': 'ListItem',
                position: i + 2,
                name: crumb.label,
                item: `${siteUrl}/posts/${crumb.path}`,
              })),
              {
                '@type': 'ListItem',
                position: metadata.breadcrumbs.length + 2,
                name: post.title,
                item: postUrl,
              },
            ],
          }),
        }}
      />
      <main className="w-full flex-1 px-6 py-12 sm:py-20">
        {metadata.tocItems.length > 0 && <TocWithScrollSpy items={metadata.tocItems} />}

        <div className="mx-auto max-w-2xl">
          {/* 뒤로 가기 */}
          <Link
            href="/posts"
            className="group text-muted-foreground hover:text-foreground font-pixel mb-10 inline-flex items-center gap-2.5 text-[10px] tracking-[0.25em] uppercase transition-colors sm:mb-14"
          >
            <PixelArrow className="h-3 w-3 rotate-180 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to Index</span>
          </Link>

          {/* 포스트 헤더 */}
          <header className="mb-12">
            <div className="mb-6 flex items-center gap-3">
              <Breadcrumb items={metadata.breadcrumbs} currentPath={category?.path || ''} />
              <PixelDecoration layout="horizontal" dotCount={3} gradientStart="start" className="opacity-30" />
              <div className="bg-border h-px flex-1" />
            </div>

            <h1 className="mb-5 text-3xl leading-tight font-bold tracking-tight break-keep sm:text-5xl">
              {post.title}
            </h1>

            {post.description && <p className="text-muted-foreground text-lg leading-8">{post.description}</p>}

            <div className="text-muted-foreground mt-8 flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <PixelClock className="mt-0.5 h-3 w-3" />
                <time dateTime={post.publishedAt}>{formatDateKorean(post.publishedAt)}</time>
              </div>
              <span aria-hidden>·</span>
              <span>{metadata.readingTime}</span>
            </div>
          </header>

          {/* 헤더 구분선 */}
          <div className="mb-14 flex items-center gap-3">
            <div className="bg-border h-px flex-1" />
            <PixelDecoration layout="horizontal" dotCount={3} gradientStart="center" className="opacity-30" />
            <div className="bg-border h-px flex-1" />
          </div>

          {/* 커버 이미지 */}
          {post.coverUrl && (
            <div
              className="ring-border/80 relative mb-14 w-full overflow-hidden rounded-xl ring-1"
              style={{ aspectRatio: '1.91/1' }}
            >
              <Image
                src={post.coverUrl}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 672px"
                priority
              />
            </div>
          )}

          {/* 본문 */}
          <article className="prose prose-neutral dark:prose-invert prose-p:leading-8 prose-headings:tracking-tight max-w-none">
            <BlockRenderer blocks={displayBlocks} commentMap={commentMap} />
          </article>

          {post.tags.length > 0 && (
            <div className="mt-20 mb-10 flex flex-wrap gap-2">
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

          {/* 댓글 */}
          <section>
            <div className="mb-8 flex items-center gap-3 pt-6">
              <PixelDecoration layout="horizontal" dotCount={3} gradientStart="start" className="opacity-45" />
              <span className="font-pixel text-muted-foreground text-[10px] tracking-[0.3em] uppercase">
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
              <PixelDecoration layout="corner" className="opacity-30" />
              <Link
                href="/posts"
                className="group text-muted-foreground hover:text-foreground font-pixel flex items-center gap-2.5 text-[10px] tracking-[0.25em] uppercase transition-colors"
              >
                <span>All Posts</span>
                <PixelArrow className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </footer>
        </div>
      </main>

    </>
  );
}
