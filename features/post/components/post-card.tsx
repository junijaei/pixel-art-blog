import { CategoryLabel } from '@/features/post/components/category-label';
import { PixelArrow } from '@/shared/ui/pixel';
import { createPostLink } from '@/features/post/routing';
import type { PostCardProps } from '@/features/post/model';
import Link from 'next/link';

export function PostCard({ slug, title, description, date, categoryPath, categoryLabel, index }: PostCardProps) {
  const href = createPostLink(categoryPath, slug);
  const indexLabel = index !== undefined ? String(index + 1).padStart(3, '0') : null;

  return (
    <Link
      href={href}
      className="group focus-visible:ring-ring relative block py-7 focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      <article className="flex flex-col gap-3 sm:flex-row sm:gap-10">
        {/* Index + Date */}
        <div className="flex items-baseline gap-3 sm:w-28 sm:shrink-0 sm:flex-col sm:gap-2.5">
          {indexLabel && (
            <span className="font-pixel text-muted-foreground group-hover:text-foreground text-[10px] tracking-widest transition-colors duration-200">
              {indexLabel}
            </span>
          )}
          <time className="text-muted-foreground text-xs tabular-nums">{date}</time>
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:pr-10">
          <CategoryLabel className="mb-1">{categoryLabel}</CategoryLabel>
          <h3 className="line-clamp-2 overflow-hidden text-lg leading-snug font-semibold tracking-tight break-keep text-ellipsis sm:text-xl">
            {title}
          </h3>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">{description}</p>
        </div>
      </article>

      <PixelArrow className="text-foreground absolute top-1/2 right-1 hidden h-3.5 w-3.5 -translate-x-2 -translate-y-1/2 opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0 group-hover:opacity-100 sm:block" />
    </Link>
  );
}
