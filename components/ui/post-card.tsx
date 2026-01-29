import { PixelClock, PixelFile } from '@/components/ui/pixel';
import { createPostLink } from '@/lib/notion/shared';
import type { PostCardProps } from '@/types/notion';
import { cn } from '@/utils/utils';
import Link from 'next/link';

export function PostCard({
  id,
  title,
  description,
  date,
  slug,
  categoryPath,
  categoryLabel,
  readingTime,
}: PostCardProps) {
  const href = createPostLink(categoryPath, slug);

  return (
    <Link
      href={href}
      className="group border-border bg-card hover:border-muted-foreground/30 block rounded-xl border p-6 transition-all duration-300"
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="text-muted-foreground flex items-center gap-2">
          <PixelFile className="h-3 w-3" />
          <span className="text-xs">{categoryLabel}</span>
        </div>
        <div className="flex gap-1">
          {[...Array(3)].map((_, i) => {
            const color = `bg-muted-foreground/${(i + 1) * 10}`;
            return <div key={i} className={cn('h-1 w-1', color)} />;
          })}
        </div>
      </div>

      <h3 className="group-hover:text-muted-foreground mb-2 text-lg leading-relaxed font-medium transition-colors">
        {title}
      </h3>

      <p className="text-muted-foreground mb-4 line-clamp-2 text-sm leading-relaxed">{description}</p>

      <div className="text-muted-foreground flex items-center gap-3 text-xs">
        <div className="flex items-center gap-1">
          <PixelClock className="h-2.5 w-2.5" />
          <span>{date}</span>
        </div>
        {readingTime && (
          <>
            <span>·</span>
            <span>{readingTime}</span>
          </>
        )}
      </div>
    </Link>
  );
}
