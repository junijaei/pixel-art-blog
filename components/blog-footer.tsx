import { DotDecoration } from './dot-decoration';
import { PixelDot } from './pixel-icons';

export function BlogFooter() {
  return (
    <footer className="mt-(--spacing-24) border-t border-border py-(--spacing-12)">
      <div className="mx-auto max-w-6xl px-(--spacing-6)">
        <div className="flex flex-col items-center justify-between gap-(--spacing-6) sm:flex-row">
          <div className="flex items-center gap-(--spacing-3)">
            <div className="flex items-center gap-(--spacing-1)">
              <PixelDot className="h-2 w-2 text-foreground" />
              <PixelDot className="h-2 w-2 text-muted-foreground/60" />
              <PixelDot className="h-2 w-2 text-muted-foreground/30" />
            </div>
            <span className="font-(family-name:--font-silkscreen) text-xs tracking-wider text-muted-foreground">
              PIXEL BLOG
            </span>
          </div>

          <DotDecoration variant="horizontal" />

          <p className="text-sm text-muted-foreground">© 2026 Pixel Blog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
