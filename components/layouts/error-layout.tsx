import Link from 'next/link';
import { PixelArrow, PixelDecoration } from '../ui';
import { BlogFooter } from './footer';
import { BlogHeader } from './header';

export default function ErrorLayout({
  code,
  title = '문제가 발생했습니다',
  description = '페이지를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
}: {
  code?: string;
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <BlogHeader />
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          {/* Pixel Dot Decoration */}
          <div className="mb-8 flex justify-center">
            <PixelDecoration layout="grid" />
          </div>
          {/* 404 Label */}
          <span className="text-muted-foreground font-pixel mb-4 inline-block text-xs tracking-widest uppercase">
            ERROR {code}
          </span>
          {/* Heading */}
          <h1 className="font-mulmaru mb-4 text-4xl leading-tight font-bold sm:text-5xl">{title}</h1>
          {/* Description */}
          <p className="text-muted-foreground mx-auto mb-10 max-w-md text-lg leading-relaxed">{description}</p>
          {/* Dot Divider */}
          <div className="mb-10 flex items-center justify-center gap-2">
            <PixelDecoration layout="horizontal" gradientStart="center" />
          </div>
          {/* Navigation Links */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="group bg-foreground text-background inline-flex items-center gap-2 rounded-lg py-3 pr-6 pl-5 text-sm font-medium transition-all duration-300 hover:opacity-90"
            >
              <PixelArrow className="h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-0.5" />
              <span>홈으로 돌아가기</span>
            </Link>
          </div>
        </div>
      </main>

      <BlogFooter />
    </div>
  );
}
