import Link from "next/link"
import { PixelFile, PixelClock, PixelTag, PixelArrow } from "./pixel-icons"
import { DotDecoration } from "./dot-decoration"

interface PostCardProps {
  post: {
    slug: string
    title: string
    excerpt: string
    date: string
    category: string
    readTime: string
  }
  featured?: boolean
}

export function PostCard({ post, featured = false }: PostCardProps) {
  if (featured) {
    return (
      <Link
        href={`/posts/${post.slug}`}
        className="group block relative bg-card border border-border rounded-xl p-8 hover:border-muted-foreground/30 transition-all duration-300"
      >
        <DotDecoration variant="corner" className="absolute top-4 right-4 opacity-50" />

        <div className="flex items-center gap-4 mb-4">
          <span className="text-[10px] px-3 py-1.5 bg-foreground text-background rounded-md tracking-wider font-[family-name:var(--font-silkscreen)]">
            FEATURED
          </span>
          <div className="flex items-center gap-2 text-muted-foreground">
            <PixelTag className="w-3 h-3" />
            <span className="text-xs">{post.category}</span>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-3 group-hover:text-muted-foreground transition-colors leading-relaxed">
          {post.title}
        </h2>

        <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-2">{post.excerpt}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <PixelClock className="w-3 h-3" />
              <span>{post.date}</span>
            </div>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>

          <div className="flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all">
            <span>Read</span>
            <PixelArrow className="w-4 h-4" />
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group block bg-card border border-border rounded-xl p-6 hover:border-muted-foreground/30 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <PixelFile className="w-3 h-3" />
          <span className="text-xs">{post.category}</span>
        </div>
        <div className="flex gap-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-muted-foreground/30" />
          ))}
        </div>
      </div>

      <h3 className="text-lg font-medium mb-2 group-hover:text-muted-foreground transition-colors leading-relaxed">
        {post.title}
      </h3>

      <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2">{post.excerpt}</p>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <PixelClock className="w-2.5 h-2.5" />
          <span>{post.date}</span>
        </div>
        <span>·</span>
        <span>{post.readTime}</span>
      </div>
    </Link>
  )
}
