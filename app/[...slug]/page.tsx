import { BlogFooter, BlogHeader } from '@/components/layouts';
import { BlockRenderer } from '@/components/notion-blocks';
import { Breadcrumb, DotDecoration, PixelArrow, PixelClock, TocWithScrollSpy } from '@/components/ui';
import { parsePostPage } from '@/lib/notion';
import {
  formatDateKorean,
  getBreadcrumbItems,
  getCachedPageBlocks,
  getCachedPost,
  getCachedPosts,
  getCategoryById,
  getCategoryByIdMap,
} from '@/lib/notion/api/cached';
import { parsePostLink } from '@/lib/notion/util/category-link';
import { extractTocItems } from '@/lib/notion/util/extract-toc';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// eslint-disable-next-line react-refresh/only-export-components
export async function generateStaticParams() {
  try {
    const [posts, categoryMap] = await Promise.all([getCachedPosts(), getCategoryByIdMap()]);

    return posts.map((post) => {
      const category = categoryMap.get(post.categoryId);
      const fullPath = category?.fullPath || '';
      const slugPath = fullPath ? `${fullPath}/${post.id}` : post.id;
      return { slug: slugPath.split('/').filter(Boolean) };
    });
  } catch (error) {
    console.error('Failed to generate static params:', error);
    return [];
  }
}

// eslint-disable-next-line react-refresh/only-export-components
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
    const postPage = await getCachedPost(parsed.postId);
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

export default async function PostPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug: slugSegments } = await params;

  if (slugSegments.length === 0) {
    notFound();
  }

  const parsed = parsePostLink(slugSegments);
  if (!parsed) {
    notFound();
  }

  try {
    const postPage = await getCachedPost(parsed.postId);
    const post = parsePostPage(postPage);

    const [category, blocks] = await Promise.all([getCategoryById(post.categoryId), getCachedPageBlocks(post.id)]);

    const fullPath = category?.fullPath || '';
    const breadcrumbItems = await getBreadcrumbItems(fullPath);
    const tocItems = extractTocItems(blocks);

    return (
      <div className="flex min-h-screen flex-col">
        <BlogHeader />

        <main className="max-w-dvw flex-1 px-6 py-16">
          {tocItems.length > 0 && <TocWithScrollSpy items={tocItems} />}

          <div className="mx-auto max-w-2xl">
            <Link
              href="/posts"
              className="group text-muted-foreground hover:text-foreground mb-12 inline-flex items-center gap-2 text-sm transition-colors"
            >
              <PixelArrow className="h-3 w-3 rotate-180 transition-transform group-hover:-translate-x-0.5" />
              <span>Back to posts</span>
            </Link>

            <header className="mb-12">
              <div className="mb-6 flex items-center gap-4">
                <Breadcrumb items={breadcrumbItems} currentPath={fullPath} />
                <DotDecoration variant="horizontal" className="opacity-30" />
              </div>

              <h1 className="mb-6 text-3xl leading-tight font-bold break-keep sm:text-4xl">{post.title}</h1>

              {post.description && (
                <p className="text-muted-foreground mb-6 text-lg leading-relaxed">{post.description}</p>
              )}

              <div className="text-muted-foreground flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <PixelClock className="mt-0.5 h-3 w-3" />
                  <time dateTime={post.publishedAt}>{formatDateKorean(post.publishedAt)}</time>
                </div>
                <span>·</span>
                <span>5 min read</span>
              </div>

              {post.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
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
            </header>

            <div className="mb-12 flex items-center gap-3">
              <div className="bg-border h-px flex-1" />
              <DotDecoration variant="horizontal" className="opacity-50" />
              <div className="bg-border h-px flex-1" />
            </div>

            <article className="prose prose-neutral dark:prose-invert max-w-none">
              <BlockRenderer blocks={blocks} />
            </article>

            <footer className="border-border mt-16 border-t pt-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <DotDecoration variant="corner" />
                </div>
                <Link
                  href="/posts"
                  className="group hover:text-muted-foreground flex items-center gap-2 text-sm transition-colors"
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
  } catch (error) {
    console.error('Failed to fetch post:', error);
    notFound();
  }
}
