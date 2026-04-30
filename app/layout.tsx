import { AsyncSidebar } from '@/app/_components/async-sidebar';
import '@/app/globals.css';
import { SidebarSkeleton } from '@/components/layouts';
import { PageViewTracker } from '@/components/PageViewTracker';
import { ScrollDepthTracker } from '@/components/ScrollDepthTracker';
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/utils';
import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata, Viewport } from 'next';
import { Geist_Mono, Silkscreen } from 'next/font/google';
import localFont from 'next/font/local';
import NextTopLoader from 'nextjs-toploader';
import { ReactNode, Suspense } from 'react';

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

const silkscreen = Silkscreen({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-silkscreen',
});

const pretendard = localFont({
  src: '../public/fonts/PretendardVariable.woff2',
  variable: '--font-pretendard',
  display: 'swap',
  preload: true,
  weight: '45 920',
});

const d2coding = localFont({
  src: '../public/fonts/D2Coding.ttf',
  variable: '--font-d2coding',
  display: 'swap',
  preload: true,
  weight: '45 920',
});

const galmuri9 = localFont({
  src: '../public/fonts/Galmuri9.woff2',
  variable: '--font-galmuri9',
  display: 'swap',
  preload: true,
  weight: '400',
});

const galmuri11 = localFont({
  src: '../public/fonts/Galmuri11.woff2',
  variable: '--font-galmuri11',
  display: 'swap',
  preload: true,
  weight: '400',
});

const mulmaru = localFont({
  src: '../public/fonts/Mulmaru.woff2',
  variable: '--font-mulmaru',
  display: 'swap',
  preload: true,
  weight: '400',
});

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
  ),
  title: {
    default: 'Bit by Bit — junijaei blog',
    template: '%s | Bit by Bit',
  },
  description: '프론트엔드 개발자 junijaei의 블로그입니다. 설계와 구현 과정의 생각과 경험을 기록합니다.',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Bit by Bit — junijaei blog',
    description: '프론트엔드 개발자 junijaei의 블로그입니다. 설계와 구현 과정의 생각과 경험을 기록합니다.',
    url: '/',
    siteName: 'Bit by Bit',
    locale: 'ko_KR',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Bit by Bit — junijaei blog' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bit by Bit — junijaei blog',
    description: '프론트엔드 개발자 junijaei의 블로그입니다. 설계와 구현 과정의 생각과 경험을 기록합니다.',
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
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={cn(
          geistMono.variable,
          silkscreen.variable,
          pretendard.variable,
          d2coding.variable,
          galmuri9.variable,
          galmuri11.variable,
          mulmaru.variable,
          'font-pretendard max-w-dvw antialiased'
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
          <div className="flex">
            <Suspense fallback={<SidebarSkeleton />}>
              <AsyncSidebar />
            </Suspense>
            <div className="flex-1">{children}</div>
          </div>
        </ThemeProvider>
        <PageViewTracker />
        <ScrollDepthTracker />
        {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
      </body>
    </html>
  );
}
