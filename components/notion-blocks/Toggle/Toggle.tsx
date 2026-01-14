'use client';

import { useState } from 'react';
import { renderRichText } from '@/lib/notion/rich-text-renderer';
import type { ToggleProps } from './types';
import { cn } from '@/lib/utils';

export function Toggle({ richText, has_children, children }: ToggleProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="my-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-start gap-2 text-left py-1 px-2 -mx-2 rounded-lg',
          'hover:bg-muted/50 transition-colors'
        )}
        type="button"
      >
        {/* Arrow icon */}
        <span
          className={cn(
            'flex-shrink-0 mt-0.5 transition-transform duration-200',
            isOpen && 'rotate-90'
          )}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-muted-foreground"
          >
            <path
              d="M6 4L10 8L6 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        {/* Content */}
        <span className="flex-1 leading-relaxed">{renderRichText(richText)}</span>
      </button>

      {/* Expandable children */}
      {isOpen && has_children && children && (
        <div className="ml-6 mt-1 space-y-1">{children}</div>
      )}
    </div>
  );
}
