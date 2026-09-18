import { cn } from '@/shared/lib/utils';
import type { ReactNode } from 'react';

export interface SectionLabelProps {
  /** 레이블 텍스트 */
  children: ReactNode;
  /** 오른쪽 끝에 붙는 보조 정보 (개수 등). 실제 데이터가 있을 때만 넘긴다. */
  meta?: ReactNode;
  /** 문서 구조상 heading이어야 할 때 지정 (기본은 비의미 span) */
  as?: 'span' | 'h2' | 'h3';
  className?: string;
}

/**
 * 섹션 시작을 표시하는 레이블.
 *
 * 레이블 + 헤어라인 한 줄로만 구성한다. 점 장식 같은 부가 요소를 두지 않는 것이
 * 이 컴포넌트의 요점이다 — 이전에는 같은 모티프가 7곳에 인라인으로 복사되면서
 * 장식 유무와 opacity가 제각각이었다.
 *
 * 주의: 레이블은 font-pixel(Silkscreen)로 렌더된다. Silkscreen은 라틴 전용이라
 * 한글이 들어오면 스택 끝의 cursive로 폴백돼 깨져 보인다. 한글 레이블이 필요하면
 * 한글 픽셀 폰트인 font-galmuri9를 쓰도록 이 컴포넌트를 먼저 확장할 것.
 */
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
