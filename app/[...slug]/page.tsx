/**
 * Dynamic Post Page with Category Path + Post ID
 * URL 형식: /tech/react/type/abc123
 * - slug: ["tech", "react", "type", "abc123"]
 * - categoryPath: "tech/react/type" (마지막 제외)
 * - postId: "abc123" (마지막 세그먼트)
 */

import { BlogFooter, BlogHeader } from '@/components/latouts';
import { BlockRenderer } from '@/components/notion-blocks';
import {
  Breadcrumb,
  DotDecoration,
  PixelArrow,
  PixelClock,
  TocWithScrollSpy,
  type BreadcrumbItem,
} from '@/components/ui';
import {
  getAllCategories,
  getAllPosts,
  getCategoryPath,
  getPost,
  ISR_CONFIG,
  parseCategoryPage,
  parsePostPage,
} from '@/lib/notion';
// Note: getAllPosts is used in generateStaticParams
import { getPageBlocksWithChildren } from '@/lib/notion/api/block.api';
import { parsePostLink } from '@/lib/notion/util/category';
import { extractTocItems } from '@/lib/notion/util/extract-toc';
import type { Category } from '@/types/notion';
import Link from 'next/link';
import { notFound } from 'next/navigation';

/**
 * 카테고리 경로를 breadcrumb items로 변환
 * parentId를 따라 계층 구조를 순회하여 전체 경로 생성
 *
 * 성능 최적화:
 * - Map을 사용하여 O(1) 조회
 * - 한 번의 순회로 모든 매핑 생성
 * - parentId chain을 역순으로 따라가며 breadcrumb 구축
 */
function buildBreadcrumbItems(categoryPath: string | null, allCategories: Category[]): BreadcrumbItem[] {
  // 항상 "all" 항목으로 시작
  const items: BreadcrumbItem[] = [];

  if (!categoryPath) return items;

  // 카테고리 ID -> Category 매핑 (O(1) 조회용)
  const categoryById = new Map<string, Category>();
  // 카테고리 path -> Category 매핑 (현재 path로 카테고리 찾기용)
  const categoryByPath = new Map<string, Category>();

  allCategories.forEach((cat) => {
    categoryById.set(cat.id, cat);
    categoryByPath.set(cat.path, cat);
  });

  // 현재 path로 카테고리 찾기
  const currentCategory = categoryByPath.get(categoryPath);
  if (!currentCategory) return items;

  // parentId를 따라 올라가며 경로 수집 (역순)
  const pathChain: Category[] = [];
  let current: Category | undefined = currentCategory;

  while (current) {
    pathChain.push(current);
    current = current.parentId ? categoryById.get(current.parentId) : undefined;
  }

  // 역순으로 수집했으므로 reverse하여 root -> current 순서로
  pathChain.reverse();

  // breadcrumb items 생성
  pathChain.forEach((cat) => {
    items.push({ label: cat.label, path: cat.path });
  });

  return items;
}

// ISR 재검증 시간
export const revalidate = 3600;

/**
 * generateStaticParams
 * 빌드 타임에 모든 포스트 경로 생성 (카테고리 경로 + 포스트 ID)
 */
export async function generateStaticParams() {
  try {
    const [categoryPages, postPages] = await Promise.all([
      getAllCategories(ISR_CONFIG.CATEGORY_DATABASE_ID, { activeOnly: true }),
      getAllPosts(ISR_CONFIG.POST_DATABASE_ID, { publishedOnly: true }),
    ]);

    const categories = categoryPages.map(parseCategoryPage);
    const posts = postPages.map(parsePostPage);

    const paths = await Promise.all(
      posts.map(async (post) => {
        const categoryPath = await getCategoryPath(ISR_CONFIG.CATEGORY_DATABASE_ID, post.categoryId);
        const fullPath = categoryPath ? `${categoryPath}/${post.id}` : post.id;
        return fullPath.split('/').filter(Boolean);
      })
    );

    return paths.map((pathSegments) => ({
      slug: pathSegments,
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

  if (slugSegments.length === 0) {
    return { title: 'Post Not Found' };
  }

  const parsed = parsePostLink(slugSegments);
  if (!parsed) {
    return { title: 'Post Not Found' };
  }

  try {
    const postPage = await getPost(parsed.postId);
    const post = parsePostPage(postPage);

    return {
      title: post.title + ' | Bit by Bit',
      description: post.description,
      openGraph: {
        title: post.title + ' | Bit by Bit',
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

  if (slugSegments.length === 0) {
    notFound();
  }

  const parsed = parsePostLink(slugSegments);
  if (!parsed) {
    notFound();
  }

  let post = null;
  let categoryPath: string | null = null;
  let allCategories: Category[] = [];
  let blocks: any[] = [];

  try {
    // 포스트 가져오기
    const postPage = await getPost(parsed.postId);
    post = parsePostPage(postPage);

    // 카테고리 정보 가져오기
    categoryPath = await getCategoryPath(ISR_CONFIG.CATEGORY_DATABASE_ID, post.categoryId);
    const categoryPages = await getAllCategories(ISR_CONFIG.CATEGORY_DATABASE_ID, { activeOnly: true });
    allCategories = categoryPages.map(parseCategoryPage);

    // 포스트 블록 (내용) fetch - children을 재귀적으로 가져옴
    blocks = await getPageBlocksWithChildren(post.id);
  } catch (error) {
    console.error('Failed to fetch post:', error);
    notFound();
  }

  // Breadcrumb items 생성
  const breadcrumbItems = buildBreadcrumbItems(categoryPath, allCategories);

  // TOC items 생성
  const tocItems = extractTocItems(blocks);

  return (
    <div className="flex min-h-screen flex-col">
      <BlogHeader />

      <main className="flex-1 px-6 py-16">
        {/* Table of Contents - fixed on right side, hidden on mobile */}
        {tocItems.length > 0 && <TocWithScrollSpy items={tocItems} />}

        {/* Wide margin container for centered reading */}
        <div className="mx-auto max-w-2xl">
          {/* Back Link */}
          <Link
            href="/posts"
            className="group text-muted-foreground hover:text-foreground mb-12 inline-flex items-center gap-2 text-sm transition-colors"
          >
            <PixelArrow className="h-3 w-3 rotate-180 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to posts</span>
          </Link>

          {/* Article Header */}
          <header className="mb-12">
            <div className="mb-6 flex items-center gap-4">
              <Breadcrumb items={breadcrumbItems} currentPath={categoryPath || undefined} />
              <DotDecoration variant="horizontal" className="opacity-30" />
            </div>

            <h1 className="mb-6 text-3xl leading-tight font-bold break-keep sm:text-4xl">{post.title}</h1>

            {post.description && (
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">{post.description}</p>
            )}

            <div className="text-muted-foreground flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <PixelClock className="mt-0.5 h-3 w-3" />
                <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString('ko-KR')}</time>
              </div>
              <span>·</span>
              <span>5 min read</span>
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-muted text-muted-foreground rounded-full px-3 py-1 font-pixel text-[10px] tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Decorative Divider */}
          <div className="mb-12 flex items-center gap-3">
            <div className="bg-border h-px flex-1" />
            <DotDecoration variant="horizontal" className="opacity-50" />
            <div className="bg-border h-px flex-1" />
          </div>

          {/* Article Content */}
          <article className="prose prose-neutral dark:prose-invert max-w-none">
            <BlockRenderer blocks={blocks} />
          </article>

          {/* Article Footer */}
          <footer className="border-border mt-16 border-t pt-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <DotDecoration variant="corner" />
                <span className="text-muted-foreground text-sm">Thanks for reading</span>
              </div>
              <Link
                href="/posts"
                className="group hover:text-muted-foreground flex items-center gap-2 text-sm transition-colors "
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
