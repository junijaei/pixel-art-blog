import { PixelArrow } from '@/shared/ui/pixel';
import { cn } from '@/shared/lib/utils';
import Link from 'next/link';
import type { ReactNode } from 'react';

interface FrameLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

/** A restrained text link for secondary calls to action. */
export function FrameLink({ href, children, className }: FrameLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group focus-visible:ring-ring inline-flex items-center gap-2 rounded-md text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:outline-none active:translate-y-px',
        className
      )}
    >
      <span>{children}</span>
      <PixelArrow className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
    </Link>
  );
}
