/**
 * Dynamic Post Page with Category Path
 * ISR 방식으로 구현된 동적 포스트 페이지
 * URL 형식: /front/react/hook/example
 * - categoryPath: ["front", "react", "hook"]
 * - slug: "example"
 */

import { notFound } from 'next/navigation';
import { ISR_CONFIG } from '@/lib/notion/config';
import { getAllPostPaths, getPostByPathAndSlug, getPageBlocks } from '@/lib/notion/post.api';
import BlogHeader from '@/components/blog-header';
import BlogFooter from '@/components/blog-footer';

// ISR 재검증 시간 (1시간)
export const revalidate = ISR_CONFIG.REVALIDATE_TIME.POST_DETAIL;

/**
 * generateStaticParams
 * 빌드 타임에 모든 포스트 경로 생성
 */
export async function generateStaticParams() {
  const categoryDatabaseId = ISR_CONFIG.CATEGORY_DATABASE_ID;
  const postDatabaseId = ISR_CONFIG.POST_DATABASE_ID;

  const paths = await getAllPostPaths(postDatabaseId, categoryDatabaseId);

  return paths.map((path) => ({
    categoryPath: path.categoryPath.split('/'), // "front/react/hook" → ["front", "react", "hook"]
    slug: path.slug,
  }));
}

/**
 * generateMetadata
 * 동적 메타데이터 생성
 */
export async function generateMetadata({ params }: { params: { categoryPath: string[]; slug: string } }) {
  const categoryDatabaseId = ISR_CONFIG.CATEGORY_DATABASE_ID;
  const postDatabaseId = ISR_CONFIG.POST_DATABASE_ID;

  const categoryPath = params.categoryPath.join('/');
  const post = await getPostByPathAndSlug(postDatabaseId, categoryDatabaseId, categoryPath, params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
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
}

/**
 * Post Page Component
 */
export default async function PostPage({ params }: { params: { categoryPath: string[]; slug: string } }) {
  const categoryDatabaseId = ISR_CONFIG.CATEGORY_DATABASE_ID;
  const postDatabaseId = ISR_CONFIG.POST_DATABASE_ID;

  const categoryPath = params.categoryPath.join('/');
  const post = await getPostByPathAndSlug(postDatabaseId, categoryDatabaseId, categoryPath, params.slug);

  if (!post) {
    notFound();
  }

  // 포스트 블록 (내용) fetch
  const blocks = await getPageBlocks(post.id);

  return (
    <div className="flex min-h-screen flex-col">
      <BlogHeader />

      <main className="flex-1 px-6 py-16">
        <article className="prose prose-neutral dark:prose-invert mx-auto max-w-2xl">
          {/* 포스트 헤더 */}
          <header className="mb-8 border-b border-neutral-200 pb-8 dark:border-neutral-800">
            {/* 카테고리 경로 (breadcrumb) */}
            <div className="mb-4 text-sm text-neutral-500">
              <nav aria-label="Breadcrumb">
                <ol className="flex items-center gap-2">
                  <li>
                    <a href="/" className="hover:text-neutral-900 dark:hover:text-neutral-100">
                      Home
                    </a>
                  </li>
                  {params.categoryPath.map((segment, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span>/</span>
                      <span className="capitalize">{segment}</span>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>

            {/* 제목 */}
            <h1 className="mb-4 text-4xl font-bold">{post.title}</h1>

            {/* 메타 정보 */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
              <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString('ko-KR')}</time>
              <span>·</span>
              <span className="text-neutral-900 dark:text-neutral-100">{post.categoryLabel}</span>
            </div>

            {/* 태그 */}
            {post.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* 설명 */}
            {post.description && <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">{post.description}</p>}
          </header>

          {/* 포스트 내용 */}
          <div>
            {/* TODO: Notion 블록 렌더러 구현 */}
            {/* 옵션 1: react-notion-x 사용 */}
            {/* 옵션 2: 커스텀 BlockRenderer 컴포넌트 */}
            <div className="space-y-4">
              <p className="text-neutral-500">
                Notion 블록 렌더러가 구현되지 않았습니다.
                <br />
                {blocks.length}개의 블록을 불러왔습니다.
              </p>
              <pre className="overflow-auto rounded bg-neutral-100 p-4 text-xs dark:bg-neutral-800">
                {JSON.stringify(blocks.slice(0, 3), null, 2)}
              </pre>
            </div>
          </div>
        </article>
      </main>

      <BlogFooter />
    </div>
  );
}
