import { getColorClass } from '@/lib/notion/color-utils';
import { renderRichText } from '@/lib/notion/rich-text-renderer';
import { cn } from '@/lib/utils';
import type { CalloutProps } from './index';

export function Callout({ block, children }: CalloutProps) {
  const { rich_text, icon, color } = block.callout;
  const colorClass = getColorClass(color, 'background');

  return (
    <div className={cn('my-4 rounded-xl border p-4', 'flex gap-3', colorClass)}>
      {icon && 'emoji' in icon && icon.emoji && (
        <div className="mt-0.5 shrink-0">
          <span className="text-xl leading-none">{icon.emoji}</span>
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="leading-relaxed">{renderRichText(rich_text)}</div>
        {children && <div className="mt-2 space-y-1">{children}</div>}
      </div>
    </div>
  );
}
