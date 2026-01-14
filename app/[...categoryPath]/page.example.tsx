/**
 * Dynamic Category Page
 * ISR 방식으로 구현된 카테고리별 포스트 목록 페이지
 * URL 형식: /front/react/hook
 * - categoryPath: ["front", "react", "hook"]
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ISR_CONFIG } from '@/lib/notion/config';
import { getAllCategoryPaths, getCategoryByPath } from '@/lib/notion/category.api';
import { getAllPosts, parsePostPage } from '@/lib/notion/post.api';
import BlogHeader from '@/components/blog-header';
import BlogFooter from '@/components/blog-footer';

// ISR 재검증 시간 (30분)
export const revalidate = ISR_CONFIG.REVALIDATE_TIME.CATEGORY_POSTS;

/**
 * generateStaticParams
 * 빌드 타임에 모든 카테고리 경로 생성
 */
export async function generateStaticParams() {
  const categoryDatabaseId = ISR_CONFIG.CATEGORY_DATABASE_ID;

  const paths = await getAllCategoryPaths(categoryDatabaseId);

  return paths.map((path) => ({
    categoryPath: path.split('/'), // "front/react/hook" → ["front", "react", "hook"]
  }));
}

/**
 * generateMetadata
 * 동적 메타데이터 생성
 */
export async function generateMetadata({ params }: { params: { categoryPath: string[] } }) {
  const categoryDatabaseId = ISR_CONFIG.CATEGORY_DATABASE_ID;
  const categoryPath = params.categoryPath.join('/');

  const categoryPage = await getCategoryByPath(categoryDatabaseId, categoryPath);

  if (!categoryPage) {
    return {
      title: 'Category Not Found',
    };
  }

  // label 추출
  const labelProp = categoryPage.properties.label;
  const label = labelProp?.type === 'title' && labelProp.title.length > 0 ? labelProp.title[0].plain_text : '';

  return {
    title: `${label} - Category`,
    description: `${label} 카테고리의 모든 포스트`,
  };
}

/**
 * Category Page Component
 */
export default async function CategoryPage({ params }: { params: { categoryPath: string[] } }) {
  const categoryDatabaseId = ISR_CONFIG.CATEGORY_DATABASE_ID;
  const postDatabaseId = ISR_CONFIG.POST_DATABASE_ID;
  const categoryPath = params.categoryPath.join('/');

  // 카테고리 정보 가져오기
  const categoryPage = await getCategoryByPath(categoryDatabaseId, categoryPath);

  if (!categoryPage) {
    notFound();
  }

  // 카테고리 정보 파싱
  const labelProp = categoryPage.properties.label;
  const categoryLabel = labelProp?.type === 'title' && labelProp.title.length > 0 ? labelProp.title[0].plain_text : '';

  // 해당 카테고리의 포스트 가져오기
  const postPages = await getAllPosts(postDatabaseId, {
    publishedOnly: true,
    categoryId: categoryPage.id,
  });

  const posts = postPages.map((page) => {
    const post = parsePostPage(page);
    return {
      ...post,
      fullPath: `${categoryPath}/${post.slug}`,
    };
  });

  return (
    <div className="flex min-h-screen flex-col">
      <BlogHeader />

      <main className="flex-1 px-6 py-16">
        <div className="mx-auto max-w-4xl">
          {/* 카테고리 헤더 */}
          <header className="mb-12">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-4">
              <ol className="flex items-center gap-2 text-sm text-neutral-500">
                <li>
                  <Link href="/" className="hover:text-neutral-900 dark:hover:text-neutral-100">
                    Home
                  </Link>
                </li>
                {params.categoryPath.map((segment, index) => {
                  const isLast = index === params.categoryPath.length - 1;
                  const path = params.categoryPath.slice(0, index + 1).join('/');

                  return (
                    <li key={index} className="flex items-center gap-2">
                      <span>/</span>
                      {isLast ? (
                        <span className="capitalize font-medium text-neutral-900 dark:text-neutral-100">{segment}</span>
                      ) : (
                        <Link href={`/${path}`} className="capitalize hover:text-neutral-900 dark:hover:text-neutral-100">
                          {segment}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>

            <h1 className="text-4xl font-bold">{categoryLabel}</h1>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">{posts.length}개의 포스트</p>
          </header>

          {/* 포스트 목록 */}
          {posts.length > 0 ? (
            <div className="space-y-8">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="border-b border-neutral-200 pb-8 last:border-0 dark:border-neutral-800"
                >
                  <Link href={`/${post.fullPath}`} className="group block">
                    {/* 제목 */}
                    <h2 className="mb-2 text-2xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {post.title}
                    </h2>

                    {/* 설명 */}
                    {post.description && (
                      <p className="mb-4 text-neutral-600 line-clamp-2 dark:text-neutral-400">{post.description}</p>
                    )}

                    {/* 메타 정보 */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500">
                      <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString('ko-KR')}</time>

                      {/* 태그 */}
                      {post.tags.length > 0 && (
                        <>
                          <span>·</span>
                          <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                              <span key={tag} className="text-blue-600 dark:text-blue-400">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-neutral-500">
              <p>이 카테고리에는 아직 포스트가 없습니다.</p>
            </div>
          )}
        </div>
      </main>

      <BlogFooter />
    </div>
  );
}
