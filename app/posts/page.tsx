import { BlogHeader } from "@/components/blog-header"
import { BlogFooter } from "@/components/blog-footer"
import { PostCard } from "@/components/post-card"
import { DotDecoration } from "@/components/dot-decoration"
import { PixelDot } from "@/components/pixel-icons"
import { demoPosts } from "@/lib/demo-posts"

export default function PostsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <BlogHeader />

      <main className="flex-1 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <DotDecoration variant="horizontal" />
              <span className="text-[10px] tracking-widest text-muted-foreground uppercase font-[family-name:var(--font-silkscreen)]">
                Archive
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold mb-4">All Posts</h1>

            <p className="text-muted-foreground">
              {demoPosts.length} articles about design, development, and creativity.
            </p>
          </div>

          {/* Posts Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>

          {/* Bottom Decoration */}
          <div className="flex justify-center mt-16">
            <div className="flex items-center gap-2">
              {[...Array(7)].map((_, i) => (
                <PixelDot
                  key={i}
                  className={`w-1.5 h-1.5 ${i === 3 ? "text-foreground" : "text-muted-foreground/30"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      <BlogFooter />
    </div>
  )
}
