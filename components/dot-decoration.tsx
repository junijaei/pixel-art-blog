import { cn } from '@/lib/utils';

export function DotDecoration({
  className,
  variant = 'horizontal',
}: {
  className?: string;
  variant?: 'horizontal' | 'vertical' | 'corner' | 'grid';
}) {
  if (variant === 'horizontal') {
    return (
      <div className={cn('flex items-center gap-(--spacing-1.5)', className)}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={cn('h-1.5 w-1.5 rounded-full bg-muted-foreground/30', i === 2 && 'bg-muted-foreground/60')}
          />
        ))}
      </div>
    );
  }

  if (variant === 'vertical') {
    return (
      <div className={cn('flex flex-col items-center gap-(--spacing-1.5)', className)}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={cn('h-1.5 w-1.5 rounded-full bg-muted-foreground/30', i === 2 && 'bg-muted-foreground/60')}
          />
        ))}
      </div>
    );
  }

  if (variant === 'corner') {
    return (
      <div className={cn('grid grid-cols-3 gap-(--spacing-1)', className)}>
        <div className="h-1 w-1 rounded-full bg-muted-foreground/40" />
        <div className="h-1 w-1 rounded-full bg-muted-foreground/20" />
        <div className="h-1 w-1 rounded-full bg-muted-foreground/10" />
        <div className="h-1 w-1 rounded-full bg-muted-foreground/20" />
        <div className="h-1 w-1 rounded-full bg-muted-foreground/10" />
        <div className="h-1 w-1" />
        <div className="h-1 w-1 rounded-full bg-muted-foreground/10" />
        <div className="h-1 w-1" />
        <div className="h-1 w-1" />
      </div>
    );
  }

  const gridPattern = [1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0];
  return (
    <div className={cn('grid grid-cols-4 gap-(--spacing-2)', className)}>
      {gridPattern.map((val, i) => (
        <div
          key={i}
          className={cn('h-1 w-1 rounded-full', val ? 'bg-muted-foreground/40' : 'bg-muted-foreground/20')}
        />
      ))}
    </div>
  );
}
