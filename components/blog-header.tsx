import Link from 'next/link';
import { PixelHome, PixelFile, PixelSearch, PixelUser, PixelDot } from './pixel-icons';

export function BlogHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-(--spacing-6) py-(--spacing-4)">
        <nav className="flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-(--spacing-3)">
            <div className="flex items-center gap-(--spacing-1)">
              <PixelDot className="h-2 w-2 text-foreground" />
              <PixelDot className="h-2 w-2 text-muted-foreground/60" />
              <PixelDot className="h-2 w-2 text-muted-foreground/30" />
            </div>
            <span className="font-(family-name:--font-silkscreen) text-sm font-medium tracking-wider">PIXEL</span>
          </Link>

          <div className="flex items-center gap-(--spacing-6)">
            <Link
              href="/"
              className="flex items-center gap-(--spacing-2) text-sm text-muted-foreground transition-colors duration-(--duration-normal) hover:text-foreground"
            >
              <PixelHome className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <Link
              href="/posts"
              className="flex items-center gap-(--spacing-2) text-sm text-muted-foreground transition-colors duration-(--duration-normal) hover:text-foreground"
            >
              <PixelFile className="h-4 w-4" />
              <span className="hidden sm:inline">Posts</span>
            </Link>
            <Link
              href="/about"
              className="flex items-center gap-(--spacing-2) text-sm text-muted-foreground transition-colors duration-(--duration-normal) hover:text-foreground"
            >
              <PixelUser className="h-4 w-4" />
              <span className="hidden sm:inline">About</span>
            </Link>
            <button className="rounded-lg p-(--spacing-2) transition-colors duration-(--duration-normal) hover:bg-secondary">
              <PixelSearch className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
