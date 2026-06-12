import { PixelArrow } from '@/components/ui/pixel';
import { createPostLink } from '@/lib/notion/routing';
import type { PostCardProps } from '@/types/notion';
import Link from 'next/link';

export function PostCard({ slug, title, description, date, categoryPath, categoryLabel, index }: PostCardProps) {
  const href = createPostLink(categoryPath, slug);
  const indexLabel = index !== undefined ? String(index + 1).padStart(3, '0') : null;

  return (
    <Link
      href={href}
      className="group focus-visible:ring-ring relative block rounded-lg py-7 focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      <article className="flex flex-col gap-3 sm:flex-row sm:gap-10">
        {/* Index + Date */}
        <div className="flex items-baseline gap-3 sm:w-28 sm:shrink-0 sm:flex-col sm:gap-2.5 sm:pt-1.5">
          {indexLabel && (
            <span className="font-pixel text-muted-foreground/40 group-hover:text-foreground text-[10px] tracking-widest transition-colors duration-300">
              {indexLabel}
            </span>
          )}
          <time className="text-muted-foreground text-xs tabular-nums">{date}</time>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1 sm:pr-10">
          <span className="font-galmuri9 text-muted-foreground mb-2.5 inline-block text-[10px] tracking-wider uppercase">
            {categoryLabel}
          </span>
          <h3 className="mb-2.5 text-lg leading-snug font-semibold tracking-tight break-keep sm:text-xl">{title}</h3>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">{description}</p>
        </div>
      </article>

      <PixelArrow className="text-foreground absolute top-1/2 right-1 hidden h-3.5 w-3.5 -translate-x-2 -translate-y-1/2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 sm:block" />
    </Link>
  );
}
