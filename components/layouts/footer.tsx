import { PixelDecoration, PixelDot } from '@/components/ui';

export function BlogFooter() {
  return (
    <footer className="border-border mt-12 border-t py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="hidden items-center gap-3 sm:flex">
            <div className="flex items-center gap-1">
              <PixelDot className="text-foreground h-2 w-2" />
              <PixelDot className="text-muted-foreground/60 h-2 w-2" />
              <PixelDot className="text-muted-foreground/30 h-2 w-2" />
            </div>
            <span className="text-muted-foreground font-pixel text-xs tracking-wider">BIT BY BIT</span>
          </div>

          <PixelDecoration layout="horizontal" gradientStart="center" className="hidden sm:flex" />

          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Bit by Bit Blog. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
