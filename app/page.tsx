import { BlogHeader } from "@/components/blog-header"
import { BlogFooter } from "@/components/blog-footer"
import { PostCard } from "@/components/post-card"
import { DotDecoration } from "@/components/dot-decoration"
import { PixelArrow, PixelDot } from "@/components/pixel-icons"
import { demoPosts } from "@/lib/demo-posts"
import Link from "next/link"

export default function HomePage() {
  const featuredPost = demoPosts[0]
  const recentPosts = demoPosts.slice(1, 5)

  return (
    <div className="min-h-screen flex flex-col">
      <BlogHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <DotDecoration variant="horizontal" />
              <span className="text-[10px] tracking-widest text-muted-foreground uppercase font-[family-name:var(--font-silkscreen)]">
                Personal Blog
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-balance">
              Thoughts on design,
              <br />
              <span className="text-muted-foreground">pixels & minimalism</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed mb-8">
              Exploring the intersection of pixel aesthetics and modern design principles.
            </p>

            <div className="flex items-center gap-2">
              {[...Array(8)].map((_, i) => (
                <PixelDot key={i} className={`w-2 h-2 ${i < 3 ? "text-foreground" : "text-muted-foreground/30"}`} />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="px-6 mb-16">
          <div className="max-w-6xl mx-auto">
            <PostCard post={featuredPost} featured />
          </div>
        </section>

        {/* Recent Posts */}
        <section className="px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <h2 className="text-xs tracking-wider font-[family-name:var(--font-silkscreen)]">RECENT POSTS</h2>
                <DotDecoration variant="horizontal" className="opacity-50" />
              </div>

              <Link
                href="/posts"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <span>View all</span>
                <PixelArrow className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {recentPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <BlogFooter />
    </div>
  )
}
