'use client';

import { PixelClose } from '@/shared/ui/pixel';
import { cn } from '@/shared/lib/utils';
import { useCallback, useEffect, useRef } from 'react';

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
 */
export function ImageModal({ src, alt, isOpen, onClose, caption, className }: ImageModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

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
    if (!isOpen) return;

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
  }, [isOpen, handleKeyDown]);

  if (!isOpen) {
    return null;
  }

  // Handle backdrop click (not image click)
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`확장된 크기의 ${alt || '이미지'} 모달`}
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        // Backdrop: 라이트·다크 모두에서 뒤 페이지를 눌러주는 무채색 스크림
        'overscroll-contain bg-black/70 backdrop-blur-sm',
        className
      )}
      data-testid="modal-backdrop"
      onClick={handleBackdropClick}
    >
      {/* Close button */}
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        aria-label="모달 닫기"
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
      </button>

      {/* Image container */}
      <div className="relative max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
        <img
          src={src}
          alt={alt}
          className={cn('max-h-[85vh] max-w-full rounded-lg', 'border-border border', 'object-contain')}
        />
        {caption && <p className="text-muted-foreground mt-4 text-center text-sm whitespace-pre-wrap">{caption}</p>}
      </div>
    </div>
  );
}
