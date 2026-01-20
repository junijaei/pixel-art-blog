import Link from 'next/link';
import { PixelDot, PixelFile, PixelHome, PixelSearch, PixelUser } from '../ui/pixel-icons';

export function BlogHeader() {
  return (
    <header className="border-border bg-card/50 sticky top-0 z-50 border-b backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex items-center gap-1">
              <PixelDot className="text-foreground h-2 w-2" />
              <PixelDot className="text-muted-foreground/60 h-2 w-2" />
              <PixelDot className="text-muted-foreground/30 h-2 w-2" />
            </div>
            <span className="font-(family-name:--font-silkscreen) text-sm font-medium tracking-wider">BIT BY BIT</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors duration-(--duration-normal)"
            >
              <PixelHome className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <Link
              href="/posts"
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors duration-(--duration-normal)"
            >
              <PixelFile className="h-4 w-4" />
              <span className="hidden sm:inline">Posts</span>
            </Link>
            <Link
              href="/about"
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors duration-(--duration-normal)"
            >
              <PixelUser className="h-4 w-4" />
              <span className="hidden sm:inline">About</span>
            </Link>
            <button className="hover:bg-secondary rounded-lg p-2 transition-colors duration-(--duration-normal)">
              <PixelSearch className="text-muted-foreground h-4 w-4" />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
