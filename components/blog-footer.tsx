import { DotDecoration } from "./dot-decoration"
import { PixelDot } from "./pixel-icons"

export function BlogFooter() {
  return (
    <footer className="border-t border-border mt-24 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <PixelDot className="w-2 h-2 text-foreground" />
              <PixelDot className="w-2 h-2 text-muted-foreground/60" />
              <PixelDot className="w-2 h-2 text-muted-foreground/30" />
            </div>
            <span className="text-xs tracking-wider text-muted-foreground font-[family-name:var(--font-silkscreen)]">
              PIXEL BLOG
            </span>
          </div>

          <DotDecoration variant="horizontal" />

          <p className="text-sm text-muted-foreground">© 2026 Pixel Blog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
