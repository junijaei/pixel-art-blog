import { BlockRenderer } from '@/features/post/components/blocks';
import { GiscusComments } from '@/features/comments';
import { RelatedPosts, TocWithScrollSpy } from '@/features/post/components';
import { Breadcrumb, PixelArrow, SectionLabel } from '@/shared/ui';
import { getCategories, getPost, getPosts, parsePostLink, toPostCardData } from '@/features/post';
import { formatDateKorean } from '@/shared/lib/utils';
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
      <main id="main-content" tabIndex={-1} className="w-full flex-1 px-6 py-12 sm:py-20">
        {metadata.tocItems.length > 0 && <TocWithScrollSpy items={metadata.tocItems} />}

        <div className="mx-auto max-w-2xl">
          {/* 뒤로 가기 — 이 페이지의 유일한 상위 이동 경로 */}
          <Link
            href="/posts"
            className="group text-muted-foreground hover:text-foreground font-pixel focus-visible:ring-ring mb-12 inline-flex items-center gap-2.5 rounded-sm text-[10px] tracking-[0.25em] uppercase transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            <PixelArrow className="h-3 w-3 rotate-180 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to Index</span>
          </Link>

          {/* 헤더 */}
          <header>
            <Breadcrumb items={metadata.breadcrumbs} currentPath={category?.path || ''} />

            <h1 className="mt-6 text-4xl leading-[1.08] font-bold tracking-tight break-keep sm:text-5xl">
              {post.title}
            </h1>

            {post.description && (
              <p className="text-muted-foreground mt-5 text-base leading-relaxed break-keep sm:text-lg">
                {post.description}
              </p>
            )}

            <p className="text-muted-foreground mt-8 text-xs tabular-nums">
              <time dateTime={post.publishedAt}>{formatDateKorean(post.publishedAt)}</time>
              <span aria-hidden> · </span>
              <span>{metadata.readingTime}</span>
            </p>
          </header>

          {/* 페이지 내 유일한 구분선 — 머리말과 본문의 경계 */}
          <div className="bg-border mt-12 mb-12 h-px w-full" />

          {post.coverUrl && (
            <div
              className="border-border/80 relative mb-12 w-full overflow-hidden rounded-xl border"
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
          <article className="prose prose-neutral dark:prose-invert prose-p:leading-8 prose-headings:tracking-tight prose-hr:border-border max-w-none">
            <BlockRenderer blocks={displayBlocks} commentMap={commentMap} />
          </article>

          {/* 본문 이후 섹션들 — 동일한 리듬과 동일한 레이블 처리 */}
          {post.tags.length > 0 && (
            <section className="mt-20 sm:mt-24">
              <SectionLabel as="h2">Tags</SectionLabel>
              <p className="text-muted-foreground mt-6 text-sm break-keep">{post.tags.join(' · ')}</p>
            </section>
          )}

          <section className="mt-20 sm:mt-24">
            <SectionLabel as="h2">Comments</SectionLabel>
            <div className="mt-6">
              <GiscusComments />
            </div>
          </section>

          <RelatedPosts posts={relatedPosts} />
        </div>
      </main>
    </>
  );
}
