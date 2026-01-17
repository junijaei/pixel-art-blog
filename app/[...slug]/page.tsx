/**
 * Dynamic Post Page with Full Path
 * URL 형식: /front/react/hook/example
 * - slug: ["front", "react", "hook", "example"]
 * - categoryPath: "front/react/hook" (마지막 제외)
 * - postSlug: "example" (마지막 세그먼트)
 */

import { BlogFooter } from '@/components/blog-footer';
import { BlogHeader } from '@/components/blog-header';
import { DotDecoration } from '@/components/dot-decoration';
import { PixelArrow, PixelClock, PixelTag } from '@/components/pixel-icons';
import { ISR_CONFIG } from '@/lib/notion/config';
import { getAllPostPaths, getPageBlocks, getPostByPathAndSlug } from '@/lib/notion/post.api';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// ISR 재검증 시간
export const revalidate = 3600;

/**
 * generateStaticParams
 * 빌드 타임에 모든 포스트 경로 생성
 */
export async function generateStaticParams() {
  try {
    const paths = await getAllPostPaths(ISR_CONFIG.POST_DATABASE_ID, ISR_CONFIG.CATEGORY_DATABASE_ID);

    return paths.map((path) => ({
      slug: path.fullPath.split('/'), // "front/react/hook/example" → ["front", "react", "hook", "example"]
    }));
  } catch (error) {
    console.error('Failed to generate static params:', error);
    return [];
  }
}

/**
 * generateMetadata
 * 동적 메타데이터 생성
 */
export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug: slugSegments } = await params;

  if (slugSegments.length < 2) {
    return { title: 'Post Not Found' };
  }

  const postSlug = slugSegments[slugSegments.length - 1];
  const categoryPath = slugSegments.slice(0, -1).join('/');

  try {
    const post = await getPostByPathAndSlug(
      ISR_CONFIG.POST_DATABASE_ID,
      ISR_CONFIG.CATEGORY_DATABASE_ID,
      categoryPath,
      postSlug
    );

    if (!post) {
      return { title: 'Post Not Found' };
    }

    return {
      title: post.title,
      description: post.description,
      openGraph: {
        title: post.title,
        description: post.description,
        type: 'article',
        publishedTime: post.publishedAt,
        tags: post.tags,
      },
    };
  } catch (error) {
    console.error('Failed to generate metadata:', error);
    return { title: 'Error' };
  }
}

/**
 * Post Page Component
 */
export default async function PostPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug: slugSegments } = await params;

  // 최소 2개 세그먼트 필요 (category + slug)
  if (slugSegments.length < 2) {
    notFound();
  }

  const postSlug = slugSegments[slugSegments.length - 1];
  const categoryPath = slugSegments.slice(0, -1).join('/');

  let post = null;
  let blocks: any[] = [];

  try {
    post = await getPostByPathAndSlug(ISR_CONFIG.POST_DATABASE_ID, ISR_CONFIG.CATEGORY_DATABASE_ID, categoryPath, postSlug);

    if (!post) {
      notFound();
    }

    // 포스트 블록 (내용) fetch
    blocks = await getPageBlocks(post.id);
  } catch (error) {
    console.error('Failed to fetch post:', error);
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <BlogHeader />

      <main className="flex-1 px-(--spacing-6) py-(--spacing-16)">
        {/* Wide margin container for centered reading */}
        <div className="mx-auto max-w-2xl">
          {/* Back Link */}
          <Link
            href="/posts"
            className="group mb-(--spacing-12) inline-flex items-center gap-(--spacing-2) text-sm text-muted-foreground transition-colors duration-(--duration-normal) hover:text-foreground"
          >
            <PixelArrow className="h-3 w-3 rotate-180 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to posts</span>
          </Link>

          {/* Article Header */}
          <header className="mb-(--spacing-12)">
            <div className="mb-(--spacing-6) flex items-center gap-(--spacing-4)">
              <div className="flex items-center gap-(--spacing-2) text-muted-foreground">
                <PixelTag className="h-3 w-3" />
                <span className="text-xs">{post.categoryLabel}</span>
              </div>
              <DotDecoration variant="horizontal" className="opacity-30" />
            </div>

            <h1 className="mb-(--spacing-6) text-balance text-3xl font-bold leading-tight sm:text-4xl">
              {post.title}
            </h1>

            {post.description && (
              <p className="mb-(--spacing-6) text-lg leading-relaxed text-muted-foreground">{post.description}</p>
            )}

            <div className="flex items-center gap-(--spacing-4) text-sm text-muted-foreground">
              <div className="flex items-center gap-(--spacing-1.5)">
                <PixelClock className="h-3 w-3" />
                <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString('ko-KR')}</time>
              </div>
              <span>·</span>
              <span>5 min read</span>
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-(--spacing-4) flex flex-wrap gap-(--spacing-2)">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-muted px-(--spacing-3) py-(--spacing-1) font-(family-name:--font-silkscreen) text-[10px] tracking-wider text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Decorative Divider */}
          <div className="mb-(--spacing-12) flex items-center gap-(--spacing-3)">
            <div className="h-px flex-1 bg-border" />
            <DotDecoration variant="horizontal" className="opacity-50" />
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Article Content */}
          <article className="prose prose-neutral dark:prose-invert max-w-none">
            {/* TODO: Notion 블록 렌더러 구현 (Phase 2) */}
            <div className="space-y-(--spacing-4)">
              <p className="text-muted-foreground">
                Notion 블록 렌더러가 구현되지 않았습니다.
                <br />
                {blocks.length}개의 블록을 불러왔습니다.
              </p>
              <pre className="overflow-auto rounded-lg bg-muted p-(--spacing-4) text-xs">
                {JSON.stringify(blocks.slice(0, 3), null, 2)}
              </pre>
            </div>
          </article>

          {/* Article Footer */}
          <footer className="mt-(--spacing-16) border-t border-border pt-(--spacing-8)">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-(--spacing-3)">
                <DotDecoration variant="corner" />
                <span className="text-sm text-muted-foreground">Thanks for reading</span>
              </div>
              <Link
                href="/posts"
                className="group flex items-center gap-(--spacing-2) text-sm transition-colors duration-(--duration-normal) hover:text-muted-foreground"
              >
                <span>More posts</span>
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
