import type { CalloutProps } from '@/components/notion-blocks/Callout/index';
import { getBlockBackgroundClass } from '@/lib/notion/shared';
import { cn } from '@/utils/utils';
import { RichText } from '../RichText';

export function Callout({ block, children }: CalloutProps) {
  const { rich_text, icon, color } = block.callout;
  const backgroundColorClass = getBlockBackgroundClass(color);

  return (
    <div className={cn('my-4 rounded-xl border p-4 shadow', 'flex gap-3', backgroundColorClass)}>
      {icon && 'emoji' in icon && icon.emoji && (
        <div className="mt-0.5 shrink-0">
          <span className="text-xl leading-none">{icon.emoji}</span>
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="leading-relaxed">
          <RichText richTextArray={rich_text} />
        </div>
        {children && <div className="mt-2 space-y-1">{children}</div>}
      </div>
    </div>
  );
}
