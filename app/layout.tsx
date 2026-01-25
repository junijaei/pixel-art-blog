import '@/app/globals.css';
import { Sidebar } from '@/components/layouts';
import { ThemeProvider } from '@/components/theme-provider';
import { getCachedCategories, getCachedPosts } from '@/lib/notion/api/cached';
import type { Metadata, Viewport } from 'next';
import { Geist_Mono, Silkscreen } from 'next/font/google';
import { ReactNode } from 'react';

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

const silkscreen = Silkscreen({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-silkscreen',
});

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  title: 'Bit by Bit - junijaei blog',
  description: '프론트엔드 개발자 junijaei의 블로그 입니다.',
  icons: {
    icon: '/favicon.ico',
  },
};

// eslint-disable-next-line react-refresh/only-export-components
export const viewport: Viewport = {
  themeColor: '#fafafa',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  let categories: Awaited<ReturnType<typeof getCachedCategories>> = [];
  let posts: Awaited<ReturnType<typeof getCachedPosts>> = [];

  try {
    [categories, posts] = await Promise.all([getCachedCategories(), getCachedPosts()]);
  } catch (error) {
    console.error('Failed to fetch initial data:', error);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistMono.variable} ${silkscreen.variable} max-w-dvw font-sans antialiased`}>
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
