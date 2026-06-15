'use client';

import { PixelChevronRight, PixelDecoration, PixelPencil } from '@/shared/ui/pixel';
import type { NotionComment } from '@/features/post/model';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface CommentWrapperProps {
  comments: NotionComment[];
  children: React.ReactNode;
}

function renderText(comment: NotionComment) {
  const text = comment.rich_text.map((rt) => rt.plain_text).join('');
  return text.split('\n').map((line, i, arr) => (
    <span key={i}>
      {line}
      {i < arr.length - 1 && <br />}
    </span>
  ));
}

export function CommentWrapper({ comments, children }: CommentWrapperProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [popoverStyle, setPopoverStyle] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const popoverWidth = Math.min(360, window.innerWidth - 16);
    setPopoverStyle({
      top: rect.bottom + window.scrollY + 8,
      left: Math.max(8, rect.right - popoverWidth + window.scrollX),
    });
  }, []);

  const handleToggle = useCallback(
    (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
      if (!open) updatePosition();
      setOpen((prev) => !prev);
    },
    [open, updatePosition]
  );

  useEffect(() => {
    if (!open) return;

    const onOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      const inContainer = containerRef.current?.contains(target) ?? false;
      const inPopover = popoverRef.current?.contains(target) ?? false;
      if (!inContainer && !inPopover) setOpen(false);
    };

    const onScroll = () => updatePosition();
    const onResize = () => updatePosition();

    document.addEventListener('mousedown', onOutside);
    document.addEventListener('touchstart', onOutside);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      document.removeEventListener('mousedown', onOutside);
      document.removeEventListener('touchstart', onOutside);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [open, updatePosition]);

  return (
    <div
      ref={containerRef}
      onClick={handleToggle}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleToggle(e)}
      role="button"
      tabIndex={0}
      aria-expanded={open}
      aria-label={`추가 설명 ${comments.length}개 — 클릭하여 보기`}
      className="group relative my-4 cursor-pointer select-none focus:outline-none"
    >
      {/* 블록 본문 */}
      <div className="pointer-events-none transition-all duration-150 group-hover:underline decoration-muted-foreground/40 group-hover:underline-offset-2">
        {children}
      </div>

      {/* 하단 레이블 */}
      <div
        aria-hidden
        className={[
          'mt-2 flex items-center gap-1.5 text-[11px] font-medium tracking-wide transition-colors duration-150',
          open ? 'text-muted-foreground' : 'text-muted-foreground/50 group-hover:text-muted-foreground/70',
        ].join(' ')}
      >
        <PixelDecoration
          layout="horizontal"
          dotCount={3}
          gradientStart="start"
          size="sm"
          className={`transition-opacity duration-150 ${open ? 'opacity-100' : 'opacity-60 group-hover:opacity-80'}`}
        />
        <PixelPencil className="h-3 w-3" aria-hidden />
        <span>추가 설명</span>
        {comments.length > 1 && (
          <span className="font-pixel rounded-full bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground">
            {comments.length}
          </span>
        )}
        <PixelChevronRight
          className={`h-2.5 w-2.5 transition-transform duration-200${open ? ' rotate-90' : ''}`}
          aria-hidden
        />
      </div>

      {/* 팝오버 (Portal) */}
      {mounted &&
        open &&
        createPortal(
          <div
            ref={popoverRef}
            style={{
              position: 'absolute',
              top: popoverStyle.top,
              left: popoverStyle.left,
              width: 'min(360px, calc(100vw - 16px))',
              zIndex: 40,
            }}
            className="overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-xl pointer-events-auto [&_*]:pointer-events-auto"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* 헤더 */}
            <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2.5">
              <div className="flex items-center gap-2 text-muted-foreground">
                <PixelDecoration layout="horizontal" dotCount={3} gradientStart="start" size="sm" />
                <PixelPencil className="h-3 w-3" aria-hidden />
                <span className="text-xs font-semibold tracking-wide">추가 설명</span>
                {comments.length > 1 && (
                  <span className="font-pixel rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground/70">
                    {comments.length}
                  </span>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                }}
                className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground/50 transition-colors hover:bg-muted hover:text-foreground"
                aria-label="닫기"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                  <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* 설명 목록 */}
            <div className="max-h-96 overflow-y-auto">
              {comments.map((comment, i) => (
                <div key={comment.id}>
                  <div className="flex items-start gap-3 px-4 py-3.5">
                    {comments.length > 1 && (
                      <span className="font-pixel mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-muted text-[9px] text-muted-foreground">
                        {i + 1}
                      </span>
                    )}
                    <p className="text-sm leading-relaxed text-foreground">{renderText(comment)}</p>
                  </div>
                  {i < comments.length - 1 && (
                    <div aria-hidden className="flex items-center gap-2 px-4">
                      <div className="h-px flex-1 bg-border" />
                      <PixelDecoration layout="horizontal" dotCount={3} gradientStart="center" size="sm" />
                      <div className="h-px flex-1 bg-border" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
