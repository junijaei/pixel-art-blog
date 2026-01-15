import { renderRichText } from '@/lib/notion/rich-text-renderer';
import { cn } from '@/lib/utils';
import type { ToDoProps } from './index';

export function ToDo({ block, children }: ToDoProps) {
  const { rich_text, checked } = block.to_do;
  return (
    <div className="my-1">
      <div className="flex items-start gap-2">
        {/* Checkbox */}
        <div className="mt-0.5 shrink-0">
          <div
            className={cn(
              'border-border flex h-4 w-4 items-center justify-center rounded border',
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
        <div className="min-w-0 flex-1">
          <div className={cn('leading-relaxed', checked && 'text-muted-foreground line-through')}>
            {renderRichText(rich_text)}
          </div>

          {/* Nested children */}
          {children && <div className="mt-1 ml-6 space-y-1">{children}</div>}
        </div>
      </div>
    </div>
  );
}
