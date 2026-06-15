import { PixelArrow } from '@/components/ui/pixel';
import { cn } from '@/utils/utils';
import Link from 'next/link';
import type { ReactNode } from 'react';

const FRAME_CORNERS = [
  'top-0 left-0 border-t border-l',
  'top-0 right-0 border-t border-r',
  'bottom-0 left-0 border-b border-l',
  'bottom-0 right-0 border-b border-r',
] as const;

interface FrameLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

/**
 * HUD 코너 브래킷 CTA.
 * 평상시에는 네 모서리 브래킷만 보이고, 호버 시 브래킷이 변을 따라
 * 자라나 하나의 프레임으로 닫힌다. (히어로 DecorativeFrame의 버튼 버전)
 */
export function FrameLink({ href, children, className }: FrameLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group bg-background/10 hover:bg-background focus-visible:ring-ring relative inline-flex items-center gap-3 px-6 py-2 backdrop-blur-sm transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 sm:px-9 sm:py-4',
        className
      )}
    >
      {FRAME_CORNERS.map((corner) => (
        <span
          key={corner}
          aria-hidden
          className={cn(
            'border-foreground/60 absolute h-2 w-2 transition-all duration-500 ease-out group-hover:h-1/2 group-hover:w-1/2',
            corner
          )}
        />
      ))}
      <span className="text-foreground text-xs tracking-wide">{children}</span>
      <PixelArrow className="text-foreground h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}
