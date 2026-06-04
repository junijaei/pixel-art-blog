import { PixelClock, PixelTag } from '@/components/ui/pixel';
import { createPostLink } from '@/lib/notion/routing';
import type { PostCardProps } from '@/types/notion';
import Link from 'next/link';

export function PostCard({ slug, title, description, date, categoryPath, categoryLabel }: PostCardProps) {
  const href = createPostLink(categoryPath, slug);

  return (
    <Link
      href={href}
      className="group border-border/80 bg-card/80 hover:border-muted-foreground/35 hover:bg-card focus-visible:ring-ring block w-full rounded-xl border p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="text-muted-foreground flex min-w-0 items-center gap-2">
          <PixelTag className="h-3 w-3" />
          <span className="truncate text-xs">{categoryLabel}</span>
        </div>
        <div className="text-muted-foreground flex shrink-0 items-center gap-1 text-xs tabular-nums">
          <PixelClock className="h-2.5 w-2.5" />
          <span>{date}</span>
        </div>
      </div>

      <h3 className="group-hover:text-foreground/75 mb-2.5 text-lg leading-snug font-semibold tracking-[-0.01em] transition-colors">
        {title}
      </h3>

      <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">{description}</p>
    </Link>
  );
}
