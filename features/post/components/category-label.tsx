import { PixelTag } from '@/shared/ui/pixel';
import { cn } from '@/shared/lib/utils';
import type { ReactNode } from 'react';

export interface CategoryLabelProps {
  children: ReactNode;
  className?: string;
}

export function CategoryLabel({ children, className }: CategoryLabelProps) {
  return (
    <span className={cn('text-muted-foreground flex items-center gap-2', className)}>
      <PixelTag className="h-3 w-3 shrink-0" />
      <span className="font-pixel truncate text-[10px] tracking-widest uppercase">{children}</span>
    </span>
  );
}
