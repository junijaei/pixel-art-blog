import type { DividerProps } from '@/components/notion-blocks/Divider/index';
import { cn } from '@/utils/utils';
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
