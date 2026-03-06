import { GoogleAnalytics } from '@next/third-parties/google';
import { ScrollDepthTracker } from '@/components/ScrollDepthTracker';
import { AsyncSidebar } from '@/app/_components/async-sidebar';
import '@/app/globals.css';
import { SidebarSkeleton } from '@/components/layouts';
import { ThemeProvider } from '@/components/theme-provider';
import type { Metadata, Viewport } from 'next';
import { Geist_Mono, Silkscreen } from 'next/font/google';
import localFont from 'next/font/local';
import NextTopLoader from 'nextjs-toploader';
import { preload } from 'react-dom';
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

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  // Mulmaru.woff2 is discovered late (after CSS parse) without a preload hint.
  // Preloading it breaks the critical chain: HTML → CSS → font.
  preload('/fonts/Mulmaru.woff2', { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' });

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistMono.variable} ${silkscreen.variable} ${pretendard.variable} max-w-dvw font-sans antialiased`}
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
        <ScrollDepthTracker />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
