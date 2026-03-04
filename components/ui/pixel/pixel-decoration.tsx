import { cn } from '@/utils/utils';

type BaseProps = {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
};

type GridOrCornerProps = BaseProps & {
  layout: 'grid' | 'corner';
};

type GradientProps = BaseProps & {
  layout: 'horizontal' | 'vertical';
  gradientStart?: 'center' | 'start' | 'end';
  dotCount?: number;
};

type PixelDecorationProps = GridOrCornerProps | GradientProps;

const COLOR_STEP_VALUES = [10, 20, 30, 40, 50] as const;
const MAX_INDEX = COLOR_STEP_VALUES.length - 1;

const colorMap = {
  0: 'bg-muted-foreground/10',
  1: 'bg-muted-foreground/20',
  2: 'bg-muted-foreground/30',
  3: 'bg-muted-foreground/40',
  4: 'bg-muted-foreground/50',
} as Record<number, string>;
const sizeMap = {
  sm: 'size-1',
  md: 'size-1.5',
  lg: 'size-2',
};

const getGradientColors = (dotCount: number = 5, gradientStart: 'center' | 'start' | 'end') => {
  if (dotCount <= 0) return [];

  if (gradientStart === 'center') {
    const mid = (dotCount - 1) / 2;
    const maxDistance = mid || 1;

    return Array.from({ length: dotCount }, (_, i) => {
      const distance = Math.abs(i - mid);
      const normalized = 1 - distance / maxDistance;
      const index = Math.round(normalized * MAX_INDEX);
      return colorMap[index];
    });
  }

  const gradientColors = Array.from({ length: dotCount }, (_, i) => {
    const index = Math.floor((i / (dotCount - 1 || 1)) * MAX_INDEX);
    return colorMap[index];
  });

  return gradientStart === 'start' ? gradientColors.reverse() : gradientColors;
};

export function PixelDecoration({ className, size = 'sm', layout, ...rest }: PixelDecorationProps) {
  if (layout === 'horizontal' || layout === 'vertical') {
    const { dotCount, gradientStart } = rest as GradientProps;
    const colors = getGradientColors(dotCount || 5, gradientStart || 'start');
    return (
      <div className={cn('flex items-center gap-1.5', layout === 'vertical' && 'flex-col', className)}>
        {colors.map((color, i) => (
          <div key={i} className={cn(color, sizeMap[size])} />
        ))}
      </div>
    );
  }

  if (layout === 'corner') {
    return (
      <div className={cn('grid grid-cols-3 gap-1', className)}>
        <div className={cn('bg-muted-foreground/40', sizeMap[size])} />
        <div className={cn('bg-muted-foreground/20', sizeMap[size])} />
        <div className={cn('bg-muted-foreground/10', sizeMap[size])} />
        <div className={cn('bg-muted-foreground/20', sizeMap[size])} />
        <div className={cn('bg-muted-foreground/10', sizeMap[size])} />
        <div className={cn(sizeMap[size])} />
        <div className={cn('bg-muted-foreground/10', sizeMap[size])} />
        <div className={cn(sizeMap[size])} />
        <div className={cn(sizeMap[size])} />
      </div>
    );
  }

  const gridPattern = [1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0];
  return (
    <div className={cn('grid grid-cols-4 gap-2', className)}>
      {gridPattern.map((val, i) => (
        <div key={i} className={cn(sizeMap[size], val ? 'bg-muted-foreground/40' : 'bg-muted-foreground/20')} />
      ))}
    </div>
  );
}
