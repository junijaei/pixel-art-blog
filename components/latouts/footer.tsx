import { DotDecoration } from '../ui/dot-decoration';
import { PixelDot } from '../ui/pixel-icons';

export function BlogFooter() {
  return (
    <footer className="border-border mt-(--spacing-24) border-t py-(--spacing-12)">
      <div className="mx-auto max-w-6xl px-(--spacing-6)">
        <div className="flex flex-col items-center justify-between gap-(--spacing-6) sm:flex-row">
          <div className="flex items-center gap-(--spacing-3)">
            <div className="flex items-center gap-(--spacing-1)">
              <PixelDot className="text-foreground h-2 w-2" />
              <PixelDot className="text-muted-foreground/60 h-2 w-2" />
              <PixelDot className="text-muted-foreground/30 h-2 w-2" />
            </div>
            <span className="text-muted-foreground font-(family-name:--font-silkscreen) text-xs tracking-wider">
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
