import { Sidebar } from '@/components/latouts';
import { ThemeProvider } from '@/components/theme-provider';
import { getAllCategories, getAllPosts, ISR_CONFIG, parseCategoryPage, parsePostPage } from '@/lib/notion';
import type { Metadata, Viewport } from 'next';
import { Geist_Mono, Silkscreen } from 'next/font/google';
import { ReactNode } from 'react';
import './globals.css';

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
  title: 'Bit by Bit - junijaei blog',
  description: '프론트엔드 개발자 junijaei의 블로그 입니다.',
  icons: {
    icon: '/favicon.ico',
  },
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistMono.variable} ${silkscreen.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex">
            <Sidebar categories={categories} posts={posts} />
            <div className="flex-1">{children}</div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
