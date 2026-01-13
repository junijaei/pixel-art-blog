import { DotDecoration } from './dot-decoration';
import { PixelDot } from './pixel-icons';

export function BlogFooter() {
  return (
    <footer className="border-border mt-24 border-t py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <PixelDot className="text-foreground h-2 w-2" />
              <PixelDot className="text-muted-foreground/60 h-2 w-2" />
              <PixelDot className="text-muted-foreground/30 h-2 w-2" />
            </div>
            <span className="text-muted-foreground font-[family-name:var(--font-silkscreen)] text-xs tracking-wider">
              PIXEL BLOG
            </span>
          </div>

          <DotDecoration variant="horizontal" />

          <p className="text-muted-foreground text-sm">© 2026 Pixel Blog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
