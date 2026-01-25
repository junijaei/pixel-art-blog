import type { DividerProps } from '@/components/notion-blocks/Divider/index';
import { cn } from '@/lib/utils';

export function Divider({ className }: DividerProps) {
  return (
    <div className={cn('my-6', className)}>
      <hr className="border-border" />
    </div>
  );
}
