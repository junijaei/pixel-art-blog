/**
 * 개별 포스트 페이지 (ISR 적용)
 * 실제 구현 시 page.tsx로 이름 변경
 */

import { notFound } from 'next/navigation';
import { getAllPostSlugs, getPostBySlug, getPageBlocks } from '@/lib/notion/api';
import { ISR_CONFIG } from '@/lib/notion/config';
import { BlogHeader } from '@/components/blog-header';
import { BlogFooter } from '@/components/blog-footer';

// ISR: 이 페이지는 빌드 타임에 생성되고, 1시간마다 재검증됨
export const revalidate = ISR_CONFIG.REVALIDATE_TIME.POST_DETAIL;

// 동적 라우트 파라미터를 정적으로 생성
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs(ISR_CONFIG.DATABASE_ID);

  return slugs.map((slug) => ({
    slug,
  }));
}

// 메타데이터 생성
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(ISR_CONFIG.DATABASE_ID, params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  // Title 속성에서 제목 추출
  const titleProperty = post.properties.Title;
  const title =
    titleProperty?.type === 'title' && titleProperty.title.length > 0 ? titleProperty.title[0].plain_text : 'Untitled';

  // Excerpt 속성에서 설명 추출
  const excerptProperty = post.properties.Excerpt;
  const description =
    excerptProperty?.type === 'rich_text' && excerptProperty.rich_text.length > 0
      ? excerptProperty.rich_text[0].plain_text
      : '';

  return {
    title: `${title} | Pixel Blog`,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
    },
  };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  // 포스트 데이터 fetch
  const post = await getPostBySlug(ISR_CONFIG.DATABASE_ID, params.slug);

  if (!post) {
    notFound();
  }

  // 포스트 블록 (내용) fetch
  const blocks = await getPageBlocks(post.id);

  // Title 추출
  const titleProperty = post.properties.Title;
  const title =
    titleProperty?.type === 'title' && titleProperty.title.length > 0 ? titleProperty.title[0].plain_text : 'Untitled';

  // Created 날짜 추출
  const createdProperty = post.properties.Created;
  const createdDate =
    createdProperty?.type === 'created_time' ? new Date(createdProperty.created_time).toLocaleDateString() : '';

  return (
    <div className="flex min-h-screen flex-col">
      <BlogHeader />

      <main className="flex-1 px-6 py-16">
        <article className="prose prose-neutral dark:prose-invert mx-auto max-w-2xl">
          {/* 포스트 헤더 */}
          <header className="mb-8">
            <h1 className="mb-4">{title}</h1>
            <time className="text-muted-foreground text-sm">{createdDate}</time>
          </header>

          {/* 포스트 내용 */}
          <div>
            {/* TODO: Notion 블록을 React 컴포넌트로 렌더링 */}
            {/* react-notion-x 또는 커스텀 렌더러 사용 */}
            <pre>{JSON.stringify(blocks, null, 2)}</pre>
          </div>
        </article>
      </main>

      <BlogFooter />
    </div>
  );
}
