import { BlogFooter } from '@/components/blog-footer';
import { BlogHeader } from '@/components/blog-header';
import { DotDecoration } from '@/components/dot-decoration';
import { PixelDot, PixelUser } from '@/components/pixel-icons';

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <BlogHeader />

      <main className="flex-1 px-6 py-16">
        <div className="mx-auto max-w-2xl">
          {/* Page Header */}
          <div className="mb-12">
            <div className="mb-6 flex items-center gap-4">
              <PixelUser className="text-muted-foreground h-5 w-5" />
              <span className="text-muted-foreground font-(family-name:--font-silkscreen) text-[10px] tracking-widest uppercase">
                About
              </span>
              <DotDecoration variant="horizontal" className="opacity-30" />
            </div>

            <h1 className="mb-6 text-3xl font-bold sm:text-4xl">Hello, I'm the Pixel Designer</h1>
          </div>

          {/* Avatar/Visual */}
          <div className="relative mb-12">
            <div className="bg-secondary border-border flex h-32 w-32 items-center justify-center rounded-xl border">
              <div className="grid grid-cols-5 gap-1.5">
                {[...Array(25)].map((_, i) => {
                  const pattern = [0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0];
                  return (
                    <div key={i} className={`h-3 w-3 rounded-sm ${pattern[i] ? 'bg-foreground' : 'bg-transparent'}`} />
                  );
                })}
              </div>
            </div>
            <DotDecoration variant="corner" className="absolute -right-2 -bottom-2" />
          </div>

          {/* Bio Content */}
          <div className="space-y-6">
            <p className="text-foreground/90 text-lg leading-relaxed">
              I'm passionate about the intersection of retro aesthetics and modern design. This blog is where I explore
              ideas about minimalism, pixel art, and the philosophy of digital creation.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              Every pixel tells a story. In a world of infinite resolution, choosing to work within constraints becomes
              a statement about intentionality and craft.
            </p>

            <div className="py-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex gap-1.5">
                  {[...Array(3)].map((_, i) => (
                    <PixelDot key={i} className="text-foreground h-2 w-2" />
                  ))}
                </div>
                <span className="text-muted-foreground font-(family-name:--font-silkscreen) text-[10px] tracking-wider">
                  FOCUS
                </span>
              </div>

              <ul className="space-y-3">
                {['Pixel Art & Retro Design', 'Minimalist Interfaces', 'Design Systems', 'Typography'].map((item) => (
                  <li key={item} className="text-foreground/90 flex items-center gap-3">
                    <PixelDot className="text-muted-foreground/60 h-1.5 w-1.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              Feel free to explore the posts and reach out if you'd like to discuss design, collaborate on a project, or
              just chat about pixels.
            </p>
          </div>

          {/* Decorative Footer */}
          <div className="mt-16 flex justify-center">
            <div className="flex items-center gap-2">
              {[...Array(9)].map((_, i) => (
                <PixelDot
                  key={i}
                  className={`h-1.5 w-1.5 ${i === 4 ? 'text-foreground' : 'text-muted-foreground/20'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      <BlogFooter />
    </div>
  );
}
