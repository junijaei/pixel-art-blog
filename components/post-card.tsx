import Link from 'next/link';
import { PixelFile, PixelClock, PixelTag, PixelArrow } from './pixel-icons';
import { DotDecoration } from './dot-decoration';

interface PostCardProps {
  post: {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    category: string;
    readTime: string;
  };
  featured?: boolean;
}

export function PostCard({ post, featured = false }: PostCardProps) {
  if (featured) {
    return (
      <Link
        href={`/posts/${post.slug}`}
        className="group relative block rounded-xl border border-border bg-card p-(--spacing-8) transition-all duration-(--duration-slow) hover:border-muted-foreground/30"
      >
        <DotDecoration variant="corner" className="absolute right-(--spacing-4) top-(--spacing-4) opacity-50" />

        <div className="mb-(--spacing-4) flex items-center gap-(--spacing-4)">
          <span className="rounded-md bg-foreground px-(--spacing-3) py-(--spacing-1.5) font-(family-name:--font-silkscreen) text-[10px] tracking-wider text-background">
            FEATURED
          </span>
          <div className="flex items-center gap-(--spacing-2) text-muted-foreground">
            <PixelTag className="h-3 w-3" />
            <span className="text-xs">{post.category}</span>
          </div>
        </div>

        <h2 className="mb-(--spacing-3) text-2xl font-semibold leading-relaxed transition-colors duration-(--duration-normal) group-hover:text-muted-foreground">
          {post.title}
        </h2>

        <p className="mb-(--spacing-6) line-clamp-2 leading-relaxed text-muted-foreground">{post.excerpt}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-(--spacing-4) text-sm text-muted-foreground">
            <div className="flex items-center gap-(--spacing-1.5)">
              <PixelClock className="h-3 w-3" />
              <span>{post.date}</span>
            </div>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>

          <div className="flex items-center gap-(--spacing-2) text-sm font-medium transition-all duration-(--duration-normal) group-hover:gap-(--spacing-3)">
            <span>Read</span>
            <PixelArrow className="h-4 w-4" />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group block rounded-xl border border-border bg-card p-(--spacing-6) transition-all duration-(--duration-slow) hover:border-muted-foreground/30"
    >
      <div className="mb-(--spacing-3) flex items-start justify-between">
        <div className="flex items-center gap-(--spacing-2) text-muted-foreground">
          <PixelFile className="h-3 w-3" />
          <span className="text-xs">{post.category}</span>
        </div>
        <div className="flex gap-(--spacing-1)">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-1 w-1 rounded-full bg-muted-foreground/30" />
          ))}
        </div>
      </div>

      <h3 className="mb-(--spacing-2) text-lg font-medium leading-relaxed transition-colors duration-(--duration-normal) group-hover:text-muted-foreground">
        {post.title}
      </h3>

      <p className="mb-(--spacing-4) line-clamp-2 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>

      <div className="flex items-center gap-(--spacing-3) text-xs text-muted-foreground">
        <div className="flex items-center gap-(--spacing-1)">
          <PixelClock className="h-2.5 w-2.5" />
          <span>{post.date}</span>
        </div>
        <span>·</span>
        <span>{post.readTime}</span>
      </div>
    </Link>
  );
}
