import Link from 'next/link';
import { PixelDot, PixelFile, PixelHome, PixelUser } from '../ui/pixel-icons';
import { ThemeToggle } from '../ui/theme-toggle';

export function BlogHeader() {
  return (
    <header className="border-border bg-card/50 sticky top-0 z-50 border-b backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3">
            <div className="hidden items-center gap-1 sm:flex">
              <PixelDot className="text-foreground h-2 w-2" />
              <PixelDot className="text-muted-foreground/60 h-2 w-2" />
              <PixelDot className="text-muted-foreground/30 h-2 w-2" />
            </div>
            <span className="font-pixel text-sm font-medium tracking-wider">BIT BY BIT</span>
          </Link>

          <div className="font-pixel flex items-center gap-6">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-xs transition-colors"
            >
              <PixelHome className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <Link
              href="/posts"
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-xs transition-colors"
            >
              <PixelFile className="h-4 w-4" />
              <span className="hidden sm:inline">Posts</span>
            </Link>
            <Link
              href="/about"
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-xs transition-colors"
            >
              <PixelUser className="h-4 w-4" />
              <span className="hidden sm:inline">About</span>
            </Link>
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
