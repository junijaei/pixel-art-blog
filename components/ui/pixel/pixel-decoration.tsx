import { cn } from '@/utils/utils';

export function PixelDecoration({
  className,
  variant = 'horizontal',
}: {
  className?: string;
  variant?: 'horizontal' | 'vertical' | 'corner' | 'grid';
}) {
  if (variant === 'horizontal') {
    return (
      <div className={cn('flex items-center gap-1.5', className)}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className={cn('bg-muted-foreground/20 h-1 w-1', i === 2 && 'bg-muted-foreground/40')} />
        ))}
      </div>
    );
  }

  if (variant === 'vertical') {
    return (
      <div className={cn('flex flex-col items-center gap-1.5', className)}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className={cn('bg-muted-foreground/20 h-1 w-1', i === 2 && 'bg-muted-foreground/40')} />
        ))}
      </div>
    );
  }

  if (variant === 'corner') {
    return (
      <div className={cn('grid grid-cols-3 gap-1', className)}>
        <div className="bg-muted-foreground/40 h-1 w-1" />
        <div className="bg-muted-foreground/20 h-1 w-1" />
        <div className="bg-muted-foreground/10 h-1 w-1" />
        <div className="bg-muted-foreground/20 h-1 w-1" />
        <div className="bg-muted-foreground/10 h-1 w-1" />
        <div className="h-1 w-1" />
        <div className="bg-muted-foreground/10 h-1 w-1" />
        <div className="h-1 w-1" />
        <div className="h-1 w-1" />
      </div>
    );
  }

  const gridPattern = [1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0];
  return (
    <div className={cn('grid grid-cols-4 gap-2', className)}>
      {gridPattern.map((val, i) => (
        <div key={i} className={cn('h-1 w-1', val ? 'bg-muted-foreground/40' : 'bg-muted-foreground/20')} />
      ))}
    </div>
  );
}
