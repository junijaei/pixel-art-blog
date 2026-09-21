import { cn } from '@/shared/lib/utils';
import type { ReactNode } from 'react';

export interface SectionLabelProps {
  /** 레이블 텍스트 */
  children: ReactNode;
  /** 오른쪽 끝에 붙는 보조 정보 (개수 등) */
  meta?: ReactNode;
  /** 문서 구조상 heading이어야 할 때 지정 (기본은 비의미 span) */
  as?: 'span' | 'h2' | 'h3';
  className?: string;
}

export function SectionLabel({ children, meta, as: Label = 'span', className }: SectionLabelProps) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      <Label className="font-pixel text-muted-foreground text-[10px] tracking-[0.3em] uppercase">{children}</Label>
      <div className="bg-border h-px flex-1" />
      {meta && (
        <span className="font-pixel text-muted-foreground/60 text-[10px] tracking-widest tabular-nums">{meta}</span>
      )}
    </div>
  );
}
