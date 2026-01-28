'use client';

import { RichText } from '@/components/notion-blocks/RichText/RichText';
import type { ToggleProps } from '@/components/notion-blocks/Toggle/index';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function Toggle({ block, children }: ToggleProps) {
  const { rich_text } = block.toggle;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="my-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          '-mx-2 flex w-full items-start gap-2 rounded-lg px-2 py-1 text-left',
          'hover:bg-muted/50 transition-colors'
        )}
        type="button"
      >
        {/* Arrow icon */}
        <span className={cn('mt-1 shrink-0 transition-transform duration-200', isOpen && 'rotate-90')}>
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
        <span className="flex-1 leading-relaxed">
          <RichText richTextArray={rich_text} />
        </span>
      </button>

      {/* Expandable children */}
      {isOpen && children && <div className="mt-1 ml-6 space-y-1">{children}</div>}
    </div>
  );
}
