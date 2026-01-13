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
        className="group bg-card border-border hover:border-muted-foreground/30 relative block rounded-xl border p-8 transition-all duration-300"
      >
        <DotDecoration variant="corner" className="absolute top-4 right-4 opacity-50" />

        <div className="mb-4 flex items-center gap-4">
          <span className="bg-foreground text-background rounded-md px-3 py-1.5 font-[family-name:var(--font-silkscreen)] text-[10px] tracking-wider">
            FEATURED
          </span>
          <div className="text-muted-foreground flex items-center gap-2">
            <PixelTag className="h-3 w-3" />
            <span className="text-xs">{post.category}</span>
          </div>
        </div>

        <h2 className="group-hover:text-muted-foreground mb-3 text-2xl leading-relaxed font-semibold transition-colors">
          {post.title}
        </h2>

        <p className="text-muted-foreground mb-6 line-clamp-2 leading-relaxed">{post.excerpt}</p>

        <div className="flex items-center justify-between">
          <div className="text-muted-foreground flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <PixelClock className="h-3 w-3" />
              <span>{post.date}</span>
            </div>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>

          <div className="flex items-center gap-2 text-sm font-medium transition-all group-hover:gap-3">
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
      className="group bg-card border-border hover:border-muted-foreground/30 block rounded-xl border p-6 transition-all duration-300"
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="text-muted-foreground flex items-center gap-2">
          <PixelFile className="h-3 w-3" />
          <span className="text-xs">{post.category}</span>
        </div>
        <div className="flex gap-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-muted-foreground/30 h-1 w-1 rounded-full" />
          ))}
        </div>
      </div>

      <h3 className="group-hover:text-muted-foreground mb-2 text-lg leading-relaxed font-medium transition-colors">
        {post.title}
      </h3>

      <p className="text-muted-foreground mb-4 line-clamp-2 text-sm leading-relaxed">{post.excerpt}</p>

      <div className="text-muted-foreground flex items-center gap-3 text-xs">
        <div className="flex items-center gap-1">
          <PixelClock className="h-2.5 w-2.5" />
          <span>{post.date}</span>
        </div>
        <span>·</span>
        <span>{post.readTime}</span>
      </div>
    </Link>
  );
}
