import { PixelClock, PixelDecoration, PixelTag } from '@/components/ui/pixel';
import { createPostLink } from '@/lib/notion/shared';
import type { PostCardProps } from '@/types/notion';
import Link from 'next/link';

export function PostCard({ title, description, date, slug, categoryPath, categoryLabel, readingTime }: PostCardProps) {
  const href = createPostLink(categoryPath, slug);

  return (
    <Link
      href={href}
      className="group border-border bg-card hover:border-muted-foreground/30 block rounded-xl border p-6 transition-all duration-300"
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="text-muted-foreground flex items-center gap-2">
          <PixelTag className="h-3 w-3" />
          <span className="text-xs">{categoryLabel}</span>
        </div>
        <PixelDecoration layout='horizontal' dotCount={3} gradientStart='end' />
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
