import { Sidebar } from '@/components/latouts';
import { getAllCategories, getAllPosts, ISR_CONFIG, parseCategoryPage, parsePostPage } from '@/lib/notion';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Silkscreen } from 'next/font/google';
import { ReactNode } from 'react';
import './globals.css';

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

const silkscreen = Silkscreen({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-silkscreen',
});

export const metadata: Metadata = {
  title: 'Pixel Blog',
  description: 'A minimal pixel-styled blog exploring design, minimalism, and creativity',
  generator: 'v0.app',
};

export const viewport: Viewport = {
  themeColor: '#fafafa',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  // 빌드 타임에 모든 카테고리와 포스트 데이터를 가져옴
  let categories: any[] = [];
  let posts: any[] = [];

  try {
    const [categoryPages, postPages] = await Promise.all([
      getAllCategories(ISR_CONFIG.CATEGORY_DATABASE_ID, { activeOnly: true }),
      getAllPosts(ISR_CONFIG.POST_DATABASE_ID, { publishedOnly: true }),
    ]);

    categories = categoryPages.map(parseCategoryPage);
    posts = postPages.map(parsePostPage);
  } catch (error) {
    console.error('Failed to fetch initial data:', error);
  }

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${silkscreen.variable} font-sans antialiased`}>
        <div className="flex">
          <Sidebar categories={categories} posts={posts} />
          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
