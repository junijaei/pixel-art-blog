import { renderRichText } from '@/lib/notion/rich-text-renderer';
import type { ToDoProps } from './types';
import { cn } from '@/lib/utils';

export function ToDo({ richText, checked, has_children, children }: ToDoProps) {
  return (
    <div className="my-1">
      <div className="flex gap-2 items-start">
        {/* Checkbox */}
        <div className="flex-shrink-0 mt-0.5">
          <div
            className={cn(
              'w-4 h-4 rounded border border-border flex items-center justify-center',
              checked ? 'bg-foreground' : 'bg-background'
            )}
          >
            {checked && (
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-background"
              >
                <path
                  d="M2 6L5 9L10 3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div
            className={cn(
              'leading-relaxed',
              checked && 'line-through text-muted-foreground'
            )}
          >
            {renderRichText(richText)}
          </div>

          {/* Nested children */}
          {has_children && children && (
            <div className="ml-6 mt-1 space-y-1">{children}</div>
          )}
        </div>
      </div>
    </div>
  );
}
