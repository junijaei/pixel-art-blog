import { PixelArrow, PixelDecoration } from '@/shared/ui';
import Link from 'next/link';

const ERROR_FRAME_SEGMENTS = [
  'top-6 left-6 h-px w-10',
  'top-6 left-6 h-10 w-px',
  'top-6 right-6 h-px w-10',
  'top-6 right-6 h-10 w-px',
  'bottom-6 left-6 h-px w-10',
  'bottom-6 left-6 h-10 w-px',
  'bottom-6 right-6 h-px w-10',
  'bottom-6 right-6 h-10 w-px',
] as const;

export default function ErrorLayout({
  code,
  title = '문제가 발생했습니다',
  description = '페이지를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
}: {
  code?: string;
  title?: string;
  description?: string;
}) {
  const codeLabel = code ?? 'ERR';

  return (
    <main className="relative flex flex-1 items-center justify-center px-6 py-24">
      {/* Corner Frame (hero echo) */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {ERROR_FRAME_SEGMENTS.map((segment) => (
          <div key={segment} className={`bg-foreground/15 absolute ${segment}`} />
        ))}
      </div>

      <div className="mx-auto w-full max-w-md text-center">
        {/* Status Label */}
        <div className="mb-10 flex items-center justify-center gap-3">
          <PixelDecoration layout="horizontal" dotCount={3} gradientStart="end" className="opacity-40" />
          <span className="font-pixel text-muted-foreground text-[10px] tracking-[0.3em] uppercase">System Error</span>
          <PixelDecoration layout="horizontal" dotCount={3} gradientStart="start" className="opacity-40" />
        </div>

        {/* Giant Code */}
        <p aria-hidden className="font-pixel text-7xl leading-none tracking-tight sm:text-8xl">
          {codeLabel}
        </p>

        <h1 className="font-mulmaru mt-8 text-2xl leading-snug font-semibold break-keep sm:text-3xl">{title}</h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-sm text-sm leading-relaxed sm:text-base">
          {description}
        </p>

        {/* Actions */}
        <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="group bg-foreground text-background inline-flex items-center gap-2 rounded-md py-3 pr-6 pl-5 text-sm font-medium transition-opacity duration-300 hover:opacity-90"
          >
            <PixelArrow className="h-3.5 w-3.5 rotate-180 transition-transform group-hover:-translate-x-0.5" />
            <span>홈으로 돌아가기</span>
          </Link>
          <Link
            href="/posts"
            className="group border-border hover:border-muted-foreground/50 inline-flex items-center gap-2 rounded-md border px-6 py-3 text-sm transition-colors duration-300"
          >
            <span>전체 글 보기</span>
            <PixelArrow className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Status Line */}
        <p className="font-pixel text-muted-foreground/40 mt-14 text-[9px] tracking-widest uppercase">
          {codeLabel} / BIT-BY-BIT / SIGNAL LOST
        </p>
      </div>
    </main>
  );
}
