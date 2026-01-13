import { BlogHeader } from "@/components/blog-header"
import { BlogFooter } from "@/components/blog-footer"
import { DotDecoration } from "@/components/dot-decoration"
import { PixelUser, PixelDot } from "@/components/pixel-icons"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <BlogHeader />

      <main className="flex-1 py-16 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Page Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <PixelUser className="w-5 h-5 text-muted-foreground" />
              <span className="text-[10px] tracking-widest text-muted-foreground uppercase font-[family-name:var(--font-silkscreen)]">
                About
              </span>
              <DotDecoration variant="horizontal" className="opacity-30" />
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold mb-6">Hello, I'm the Pixel Designer</h1>
          </div>

          {/* Avatar/Visual */}
          <div className="relative mb-12">
            <div className="w-32 h-32 bg-secondary rounded-xl flex items-center justify-center border border-border">
              <div className="grid grid-cols-5 gap-1.5">
                {[...Array(25)].map((_, i) => {
                  const pattern = [0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0]
                  return (
                    <div key={i} className={`w-3 h-3 rounded-sm ${pattern[i] ? "bg-foreground" : "bg-transparent"}`} />
                  )
                })}
              </div>
            </div>
            <DotDecoration variant="corner" className="absolute -bottom-2 -right-2" />
          </div>

          {/* Bio Content */}
          <div className="space-y-6">
            <p className="text-lg leading-relaxed text-foreground/90">
              I'm passionate about the intersection of retro aesthetics and modern design. This blog is where I explore
              ideas about minimalism, pixel art, and the philosophy of digital creation.
            </p>

            <p className="leading-relaxed text-muted-foreground">
              Every pixel tells a story. In a world of infinite resolution, choosing to work within constraints becomes
              a statement about intentionality and craft.
            </p>

            <div className="py-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex gap-1.5">
                  {[...Array(3)].map((_, i) => (
                    <PixelDot key={i} className="w-2 h-2 text-foreground" />
                  ))}
                </div>
                <span className="text-[10px] tracking-wider text-muted-foreground font-[family-name:var(--font-silkscreen)]">
                  FOCUS
                </span>
              </div>

              <ul className="space-y-3">
                {["Pixel Art & Retro Design", "Minimalist Interfaces", "Design Systems", "Typography"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-foreground/90">
                    <PixelDot className="w-1.5 h-1.5 text-muted-foreground/60" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="leading-relaxed text-muted-foreground">
              Feel free to explore the posts and reach out if you'd like to discuss design, collaborate on a project, or
              just chat about pixels.
            </p>
          </div>

          {/* Decorative Footer */}
          <div className="flex justify-center mt-16">
            <div className="flex items-center gap-2">
              {[...Array(9)].map((_, i) => (
                <PixelDot
                  key={i}
                  className={`w-1.5 h-1.5 ${i === 4 ? "text-foreground" : "text-muted-foreground/20"}`}
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
