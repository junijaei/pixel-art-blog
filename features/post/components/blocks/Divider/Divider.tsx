import type { DividerProps } from '@/features/post/components/blocks/Divider/index';
import { cn } from '@/shared/lib/utils';
import { ChildBlockContainer } from '../ChildBlockContainer';

export function Divider({ className, children }: DividerProps) {
  return (
    <>
      <div className={cn('my-6', className)}>
        <hr className="border-border" />
      </div>
      {children && <ChildBlockContainer>{children}</ChildBlockContainer>}
    </>
  );
}
