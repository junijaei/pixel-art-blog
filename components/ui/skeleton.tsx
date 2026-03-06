import { cn } from '@/utils/utils';

interface SkeletonProps {
  className?: string;
}

/**
 * Base skeleton placeholder with pulse animation.
 * Size is controlled entirely via className.
 */
export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('bg-muted animate-pulse rounded-md', className)} />;
}
