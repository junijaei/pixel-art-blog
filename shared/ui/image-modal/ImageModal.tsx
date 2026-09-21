'use client';

import { PixelClose } from '@/shared/ui/pixel';
import { cn } from '@/shared/lib/utils';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export interface ImageModalProps {
  /** Image source URL */
  src: string;
  /** Image alt text */
  alt: string;
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal is closed */
  onClose: () => void;
  /** Optional caption to display below the image */
  caption?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Full-screen image modal component
 * Displays image in a larger view with backdrop overlay
 * Closes on backdrop click, X button, or Escape key
 *
 * document.body로 포탈된다. 인라인 렌더 시 조상의 stacking context나
 * transform이 fixed 오버레이를 가둬 백드롭 클릭이 막힐 수 있다.
 */
export function ImageModal({ src, alt, isOpen, onClose, caption, className }: ImageModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  // 루트에 variants를 주지 말 것 — backdrop-blur의 조상에서 opacity를
  // 애니메이션하면 매 프레임 blur를 재합성해 계단 현상이 생긴다.
  const enter = prefersReducedMotion ? { duration: 0 } : { duration: 0.2, ease: 'easeOut' as const };
  const exit = prefersReducedMotion ? { duration: 0 } : { duration: 0.13, ease: 'easeIn' as const };

  const overlayVariants = {
    hidden: { opacity: 0, transition: exit },
    visible: { opacity: 1, transition: enter },
  };
  const contentVariants = {
    hidden: { opacity: 0, scale: 0.96, transition: exit },
    visible: { opacity: 1, scale: 1, transition: enter },
  };

  // Escape로 닫고, Tab은 다이얼로그 안에 가둔다
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      const insideDialog = dialogRef.current.contains(active);

      if (event.shiftKey && (active === first || !insideDialog)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !insideDialog)) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose]
  );

  useEffect(() => {
    // mounted를 의존성에 포함해야, isOpen=true로 첫 마운트되는 경우에도
    // 포탈이 붙은 뒤 포커스가 다이얼로그로 들어간다.
    if (!isOpen || !mounted) return;

    // 열기 전 포커스를 기억했다가 닫을 때 되돌려준다
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    document.addEventListener('keydown', handleKeyDown);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      previouslyFocusedRef.current?.focus();
    };
  }, [isOpen, mounted, handleKeyDown]);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`확장된 크기의 ${alt || '이미지'} 모달`}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className={cn('fixed inset-0 z-60 flex items-center justify-center overscroll-contain', className)}
        >
          {/*
            백드롭을 콘텐츠 뒤에 깔린 별도 레이어로 둔다.
            이미지·캡션이 덮지 않은 모든 영역이 이 레이어이므로 사각지대 없이 클릭하면 닫힌다.
            (라이트·다크 모두에서 뒤 페이지를 눌러주는 무채색 스크림)
          */}
          <motion.div
            aria-hidden
            data-testid="modal-backdrop"
            onClick={onClose}
            variants={overlayVariants}
            className="absolute inset-0 backdrop-blur-sm"
          />

          {/* Close button */}
          <motion.button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="모달 닫기"
            variants={overlayVariants}
            className={cn(
              'absolute top-4 right-4 z-10',
              'rounded-lg p-2',
              'bg-muted/50 hover:bg-muted',
              'text-muted-foreground hover:text-foreground',
              'transition-colors',
              'focus:ring-ring focus:ring-2 focus:ring-offset-2 focus:outline-none'
            )}
          >
            <PixelClose className="h-4 w-4" />
          </motion.button>

          {/* Image container — 클릭이 백드롭까지 내려가지 않도록 포인터 이벤트를 흡수한다 */}
          <motion.div variants={contentVariants} className="relative z-10 max-h-[90vh] max-w-[90vw]">
            <img
              src={src}
              alt={alt}
              className={cn('max-h-[85vh] max-w-full rounded-lg', 'border-border border', 'object-contain')}
            />
            {caption && (
              <p className="text-muted-foreground mt-4 text-center text-sm whitespace-pre-wrap">{caption}</p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
