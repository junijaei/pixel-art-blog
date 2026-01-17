import { createPostLink } from '@/lib/notion/util/category';
import type { PostCardProps } from '@/types/notion';
import Link from 'next/link';
import { PixelClock, PixelFile } from './pixel-icons';

export function PostCard({ id, title, description, date, categoryPath, categoryLabel, tags = [] }: PostCardProps) {
  const href = createPostLink(categoryPath, id);

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
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-muted-foreground/30 h-1 w-1 rounded-full" />
          ))}
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
      </div>
    </Link>
  );
}
