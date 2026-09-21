'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { PixelFile, PixelHome, PixelUser } from '@/shared/ui/pixel/pixel-icons';
import { ThemeToggle } from '@/features/theme/components/theme-toggle';
import { cn } from '@/shared/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: PixelHome },
  { href: '/posts', label: 'Posts', icon: PixelFile },
  { href: '/about', label: 'About', icon: PixelUser },
];

export function BlogHeader() {
  const pathname = usePathname();

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <header className="border-border/70 bg-background/85 sticky top-0 z-50 border-b backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-6 py-3.5">
        <nav aria-label="주요 내비게이션" className="flex items-center justify-between gap-4 sm:gap-6">
          <Link
            href="/"
            className="group focus-visible:ring-ring flex min-w-0 items-center gap-3 rounded-lg py-1 focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            <span className="font-pixel truncate text-xs tracking-wider">BIT BY BIT</span>
          </Link>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);

              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'focus-visible:ring-ring flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm',
                    'transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 active:translate-y-px',
                    active
                      ? 'text-foreground bg-muted'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              );
            })}
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
