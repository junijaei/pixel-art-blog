'use client';

import { PixelClose } from '@/components/ui/pixel-icons';
import { cn } from '@/lib/utils';
import { useCallback, useEffect } from 'react';

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
  // Handle Escape key press
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
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
      role="dialog"
      aria-modal="true"
      aria-label={`Enlarged view of ${alt || 'image'}`}
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        // Backdrop
        'backdrop-blur-sm',
        className
      )}
      data-testid="modal-backdrop"
      onClick={handleBackdropClick}
    >
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close modal"
        className={cn(
          'absolute top-4 right-4 z-10',
          'rounded-lg p-2',
          'bg-muted/50 hover:bg-muted',
          'text-muted-foreground hover:text-foreground',
          'transition-colors ',
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
          className={cn('max-h-[85vh] max-w-full rounded-lg', 'border-border border shadow-2xl', 'object-contain')}
        />
        {caption && <p className="text-muted-foreground mt-4 text-center text-sm">{caption}</p>}
      </div>
    </div>
  );
}
