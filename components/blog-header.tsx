import Link from "next/link"
import { PixelHome, PixelFile, PixelSearch, PixelUser, PixelDot } from "./pixel-icons"

export function BlogHeader() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex items-center gap-1">
              <PixelDot className="w-2 h-2 text-foreground" />
              <PixelDot className="w-2 h-2 text-muted-foreground/60" />
              <PixelDot className="w-2 h-2 text-muted-foreground/30" />
            </div>
            <span className="text-sm tracking-wider font-medium font-[family-name:var(--font-silkscreen)]">PIXEL</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <PixelHome className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <Link
              href="/posts"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <PixelFile className="w-4 h-4" />
              <span className="hidden sm:inline">Posts</span>
            </Link>
            <Link
              href="/about"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <PixelUser className="w-4 h-4" />
              <span className="hidden sm:inline">About</span>
            </Link>
            <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
              <PixelSearch className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}
