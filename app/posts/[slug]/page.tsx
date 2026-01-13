import { BlogHeader } from "@/components/blog-header"
import { BlogFooter } from "@/components/blog-footer"
import { DotDecoration } from "@/components/dot-decoration"
import { PixelClock, PixelTag, PixelArrow, PixelDot } from "@/components/pixel-icons"
import { getPost, demoPosts } from "@/lib/demo-posts"
import { notFound } from "next/navigation"
import Link from "next/link"

export function generateStaticParams() {
  return demoPosts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <BlogHeader />

      <main className="flex-1 py-16 px-6">
        {/* Wide margin container for centered reading */}
        <div className="max-w-2xl mx-auto">
          {/* Back Link */}
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12 group"
          >
            <PixelArrow className="w-3 h-3 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to posts</span>
          </Link>

          {/* Article Header */}
          <header className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <PixelTag className="w-3 h-3" />
                <span className="text-xs">{post.category}</span>
              </div>
              <DotDecoration variant="horizontal" className="opacity-30" />
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold mb-6 leading-tight text-balance">{post.title}</h1>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <PixelClock className="w-3 h-3" />
                <span>{post.date}</span>
              </div>
              <span>·</span>
              <span>{post.readTime}</span>
            </div>
          </header>

          {/* Decorative Divider */}
          <div className="flex items-center gap-3 mb-12">
            <div className="flex-1 h-px bg-border" />
            <div className="flex gap-1.5">
              {[...Array(5)].map((_, i) => (
                <PixelDot
                  key={i}
                  className={`w-1.5 h-1.5 ${i === 2 ? "text-foreground" : "text-muted-foreground/30"}`}
                />
              ))}
            </div>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Article Content */}
          <article className="prose prose-zinc dark:prose-invert max-w-none">
            {post.content.split("\n\n").map((paragraph, index) => {
              // Handle headings
              if (paragraph.startsWith("## ")) {
                return (
                  <h2 key={index} className="text-xl font-semibold mt-10 mb-4 flex items-center gap-3">
                    <PixelDot className="w-2 h-2 text-muted-foreground" />
                    {paragraph.replace("## ", "")}
                  </h2>
                )
              }
              if (paragraph.startsWith("### ")) {
                return (
                  <h3 key={index} className="text-lg font-medium mt-8 mb-3 text-muted-foreground">
                    {paragraph.replace("### ", "")}
                  </h3>
                )
              }
              // Handle lists
              if (paragraph.startsWith("- ")) {
                const items = paragraph.split("\n").filter((line) => line.startsWith("- "))
                return (
                  <ul key={index} className="my-4 space-y-2">
                    {items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-foreground/90">
                        <PixelDot className="w-1.5 h-1.5 mt-2 flex-shrink-0 text-muted-foreground/60" />
                        <span className="leading-relaxed">{item.replace("- ", "").replace(/\*\*/g, "")}</span>
                      </li>
                    ))}
                  </ul>
                )
              }
              // Handle numbered lists
              if (paragraph.match(/^\d+\./)) {
                const items = paragraph.split("\n").filter((line) => line.match(/^\d+\./))
                return (
                  <ol key={index} className="my-4 space-y-2">
                    {items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-foreground/90">
                        <span className="text-[10px] text-muted-foreground mt-1 w-4 font-[family-name:var(--font-silkscreen)]">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed">{item.replace(/^\d+\.\s*/, "")}</span>
                      </li>
                    ))}
                  </ol>
                )
              }
              // Regular paragraphs
              if (paragraph.trim()) {
                return (
                  <p key={index} className="text-foreground/90 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                )
              }
              return null
            })}
          </article>

          {/* Article Footer */}
          <footer className="mt-16 pt-8 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <DotDecoration variant="corner" />
                <span className="text-sm text-muted-foreground">Thanks for reading</span>
              </div>

              <Link
                href="/posts"
                className="flex items-center gap-2 text-sm hover:text-muted-foreground transition-colors group"
              >
                <span>More posts</span>
                <PixelArrow className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </footer>
        </div>
      </main>

      <BlogFooter />
    </div>
  )
}
