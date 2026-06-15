import { PixelDecoration, PostCardSkeleton, Skeleton } from '@/components/ui';

const HERO_FRAME_SEGMENTS = [
  'top-8 left-8 h-px w-16',
  'top-8 left-8 h-16 w-px',
  'top-8 right-8 h-px w-16',
  'top-8 right-8 h-16 w-px',
  'bottom-8 left-8 h-px w-16',
  'bottom-8 left-8 h-16 w-px',
  'bottom-8 right-8 h-px w-16',
  'bottom-8 right-8 h-16 w-px',
] as const;

export default function HomeLoading() {
  return (
    <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-background relative h-[calc(100vh-60px)] min-h-150 w-full overflow-hidden md:h-[calc(100vh-65px)]">
          <div className="absolute inset-0 z-0">
            <div className="via-background/20 to-background absolute inset-0 bg-radial-[circle_at_50%_50%] from-transparent" />
            <div className="from-background absolute inset-x-0 bottom-0 h-40 bg-linear-to-t to-transparent" />
          </div>

          <div className="relative z-10 flex h-full items-center justify-center px-6">
            <div className="mx-auto max-w-5xl text-center">
              <Skeleton className="mx-auto mb-6 h-2.5 w-48 rounded-sm sm:h-3 sm:w-60" />

              <div className="mb-10 space-y-3 md:space-y-4">
                <Skeleton className="mx-auto h-16 w-44 rounded-xl sm:h-24 sm:w-72 md:h-36 md:w-104" />
                <Skeleton className="mx-auto h-16 w-72 rounded-xl opacity-60 sm:h-24 sm:w-120 md:h-36 md:w-152" />
              </div>

              <div className="mx-auto mt-32 max-w-2xl space-y-3 sm:mt-0">
                <Skeleton className="mx-auto h-3 w-full sm:h-4" />
                <Skeleton className="mx-auto h-3 w-4/5 sm:h-4" />
                <Skeleton className="mx-auto mt-12 h-12 w-40 rounded-sm sm:h-14 sm:w-44" />
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0 z-30">
            {HERO_FRAME_SEGMENTS.map((style) => (
              <div key={style} className={`bg-foreground/20 absolute ${style}`} />
            ))}

            <div className="font-pixel text-foreground/20 invisible absolute bottom-10 left-1/2 -translate-x-1/2 text-[9px] tracking-widest sm:visible sm:text-[11px]">
              02.13.2026 / JUNI-JAEI / BIT-BY-BIT
            </div>
          </div>
        </section>

        <div className="flex w-full items-center gap-3">
          <div className="bg-border h-px flex-1" />
          <PixelDecoration layout="horizontal" dotCount={3} gradientStart="center" className="opacity-30" />
          <div className="bg-border h-px flex-1" />
        </div>

        {/* Recent Posts */}
        <section className="px-6 py-14 sm:py-20">
          <div className="mx-auto max-w-2xl">
            <div className="flex items-center gap-3">
              <Skeleton className="h-3 w-28" />
              <div className="bg-border h-px flex-1" />
              <Skeleton className="h-3 w-16" />
            </div>

            <div className="divide-border/60 border-border/60 mt-3 divide-y border-b">
              <PostCardSkeleton />
              <PostCardSkeleton />
              <PostCardSkeleton />
              <PostCardSkeleton />
              <PostCardSkeleton />
            </div>

            <Skeleton className="mx-auto mt-12 h-12 w-40 rounded-sm" />
          </div>
        </section>
    </main>
  );
}
