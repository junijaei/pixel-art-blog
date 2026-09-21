import '@/app/globals.css';
import { PageViewTracker } from '@/features/analytics/components/PageViewTracker';
import { ScrollDepthTracker } from '@/features/analytics/components/ScrollDepthTracker';
import { getCategories } from '@/features/post';
import { CategorySidebar, SidebarSkeleton } from '@/features/post/components/sidebar';
import { ThemeProvider } from '@/features/theme/components/theme-provider';
import { BlogFooter, BlogHeader } from '@/shared/layouts';
import { cn } from '@/shared/lib';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import type { Metadata, Viewport } from 'next';
import { Silkscreen } from 'next/font/google';
import localFont from 'next/font/local';
import NextTopLoader from 'nextjs-toploader';
import ReactDOM from 'react-dom';
import { ReactNode, Suspense } from 'react';

const silkscreen = Silkscreen({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-silkscreen',
});

// Pretendard는 unicode-range로 쪼갠 @font-face(shared/styles/fonts/pretendard.css)로 로드한다.
// 경로를 바꾸면 그 파일의 url()도 같이 고쳐야 한다.
const PRETENDARD_LATIN_SUBSET = '/fonts/pretendard-v1.3.9/PretendardVariable.subset.91.woff2';

const d2coding = localFont({
  src: '../shared/assets/fonts/D2Coding.woff2',
  variable: '--font-d2coding',
  display: 'swap',
  preload: false,
  weight: '400',
});

const galmuri9 = localFont({
  src: '../shared/assets/fonts/Galmuri9.woff2',
  variable: '--font-galmuri9',
  display: 'swap',
  preload: false,
  weight: '400',
});

const mulmaru = localFont({
  src: '../shared/assets/fonts/Mulmaru.woff2',
  variable: '--font-mulmaru',
  display: 'swap',
  preload: false,
  weight: '400',
});

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
  ),
  title: {
    default: 'Bit by Bit',
    template: '%s | Bit by Bit',
  },
  description: '프론트엔드 개발자 전희재의 블로그입니다. 설계와 구현 과정의 생각과 경험을 기록합니다.',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Bit by Bit',
    description: '프론트엔드 개발자 전희재의 블로그입니다. 설계와 구현 과정의 생각과 경험을 기록합니다.',
    url: '/',
    siteName: 'Bit by Bit',
    locale: 'ko_KR',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Bit by Bit' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bit by Bit',
    description: '프론트엔드 개발자 전희재의 블로그입니다. 설계와 구현 과정의 생각과 경험을 기록합니다.',
    creator: '@junijaei',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// eslint-disable-next-line react-refresh/only-export-components
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  // 라틴 + 최빈 한글 chunk. 모든 페이지가 쓰므로 이것만 미리 받는다.
  ReactDOM.preload(PRETENDARD_LATIN_SUBSET, { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' });

  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={cn(
          silkscreen.variable,
          galmuri9.variable,
          d2coding.variable,
          mulmaru.variable,
          'font-pretendard w-full antialiased'
        )}
      >
        <NextTopLoader
          color="var(--foreground)"
          height={2}
          showSpinner={false}
          shadow={false}
          easing="ease"
          speed={200}
          crawlSpeed={200}
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <a
            href="#main-content"
            className="focus:bg-background focus:text-foreground focus:border-border focus:ring-ring sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-70 focus:rounded-md focus:border focus:px-4 focus:py-2 focus:ring-2"
          >
            본문으로 건너뛰기
          </a>
          <div className="flex min-h-screen">
            <Suspense fallback={<SidebarSkeleton />}>
              <AsyncCategorySidebar />
            </Suspense>
            <div className="flex min-w-0 flex-1 flex-col">
              <BlogHeader />
              {children}
              <BlogFooter />
            </div>
          </div>
        </ThemeProvider>
        <PageViewTracker />
        <ScrollDepthTracker />
        {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
        {process.env.NEXT_PUBLIC_GTM_ID && <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />}
      </body>
    </html>
  );
}

async function AsyncCategorySidebar() {
  const { tree } = await getCategories();
  return <CategorySidebar categories={tree} />;
}
