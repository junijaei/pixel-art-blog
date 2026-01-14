import { renderRichText } from '@/lib/notion/rich-text-renderer';
import type { CalloutProps } from './types';
import { cn } from '@/lib/utils';

const colorMap: Record<string, string> = {
  gray: 'bg-muted/50 border-muted-foreground/20',
  brown: 'bg-muted/50 border-muted-foreground/20',
  orange: 'bg-accent/30 border-accent/50',
  yellow: 'bg-accent/20 border-accent/40',
  green: 'bg-accent/30 border-accent/50',
  blue: 'bg-muted/60 border-muted-foreground/30',
  purple: 'bg-muted/60 border-muted-foreground/30',
  pink: 'bg-muted/60 border-muted-foreground/30',
  red: 'bg-accent/30 border-accent/50',
  gray_background: 'bg-muted/50 border-muted-foreground/20',
  brown_background: 'bg-muted/50 border-muted-foreground/20',
  orange_background: 'bg-accent/30 border-accent/50',
  yellow_background: 'bg-accent/20 border-accent/40',
  green_background: 'bg-accent/30 border-accent/50',
  blue_background: 'bg-muted/60 border-muted-foreground/30',
  purple_background: 'bg-muted/60 border-muted-foreground/30',
  pink_background: 'bg-muted/60 border-muted-foreground/30',
  red_background: 'bg-accent/30 border-accent/50',
};

export function Callout({
  richText,
  icon,
  color = 'gray',
  has_children,
  children,
}: CalloutProps) {
  const colorClass = colorMap[color] || colorMap.gray;

  return (
    <div
      className={cn(
        'rounded-xl border p-4 my-4',
        'flex gap-3',
        colorClass
      )}
    >
      {icon && (
        <div className="flex-shrink-0 mt-0.5">
          {icon.type === 'emoji' && icon.emoji && (
            <span className="text-xl leading-none">{icon.emoji}</span>
          )}
          {icon.type === 'external' && icon.external && (
            <img
              src={icon.external.url}
              alt=""
              className="w-5 h-5 object-contain"
            />
          )}
          {icon.type === 'file' && icon.file && (
            <img
              src={icon.file.url}
              alt=""
              className="w-5 h-5 object-contain"
            />
          )}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="leading-relaxed">{renderRichText(richText)}</div>
        {has_children && children && (
          <div className="mt-2 space-y-1">{children}</div>
        )}
      </div>
    </div>
  );
}
