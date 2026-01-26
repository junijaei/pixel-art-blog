import { BlogFooter } from '@/components/layouts/footer';
import { BlogHeader } from '@/components/layouts/header';
import { PixelDecoration } from '@/components/ui/dot-decoration';
import { PixelGithub, PixelLinkedin, PixelMail, PixelUser } from '@/components/ui/pixel';
import Link from 'next/link';

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
              <span className="text-muted-foreground font-pixel text-[10px] tracking-widest uppercase">About</span>
              <PixelDecoration variant="horizontal" className="opacity-30" />
            </div>

            <h1 className="font-mulmaru mb-6 text-3xl font-bold sm:text-4xl">
              프론트엔드 개발자,
              <br className="inline sm:hidden" />
              전희재입니다.
            </h1>
          </div>

          {/* Avatar/Visual */}
          <div className="relative mb-12 flex flex-col gap-8 sm:flex-row sm:items-start">
            <div className="bg-secondary border-border flex h-48 w-48 shrink-0 items-center justify-center rounded-xl border">
              <img
                src="/profile.png"
                alt="프로필 이미지. 엘모가 컴퓨터 앞에 앉아 코딩을 하고 있다."
                className="rounded-xl"
              />
            </div>

            {/* Contact Links */}
            <div className="mr-6 flex flex-col gap-3">
              <span className="text-muted-foreground font-pixel mb-1 text-[10px] tracking-wider">CONTACT</span>
              <div className="flex flex-col gap-2">
                <Link
                  href="mailto:hjhj7895598@gmail.com"
                  className="text-muted-foreground hover:text-foreground hover:bg-secondary group flex items-center gap-3 rounded-lg px-3 py-2 transition-colors"
                >
                  <PixelMail className="h-4 w-4 shrink-0" />
                  <span className="text-sm">hjhj7895598@gmail.com</span>
                </Link>
                <Link
                  href="https://github.com/junijaei"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground hover:bg-secondary group flex items-center gap-3 rounded-lg px-3 py-2 transition-colors"
                >
                  <PixelGithub className="h-4 w-4 shrink-0" />
                  <span className="text-sm">github.com/junijaei</span>
                </Link>
                <Link
                  href="https://linkedin.com/in/junijaei"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground hover:bg-secondary group flex items-center gap-3 rounded-lg px-3 py-2 transition-colors"
                >
                  <PixelLinkedin className="h-4 w-4 shrink-0" />
                  <span className="text-sm">linkedin.com/in/junijaei</span>
                </Link>
              </div>
            </div>

            <PixelDecoration variant="corner" className="absolute -right-2 -bottom-2 hidden sm:grid" />
          </div>

          {/* Bio Content */}
          <div className="space-y-6">
            <p className="text-foreground/90 text-md leading-relaxed sm:text-lg">
              Bit by Bit는 작은 단위의 선택과 고민이 모여 하나의 결과를 만든다는 의미를 담고 있습니다.
              <br />이 블로그에는 프로젝트를 설계하고 구현하며 쌓아온 생각과 경험을 기록합니다.
            </p>

            <p className="text-muted-foreground sm:text-md text-sm leading-relaxed">
              정답을 정리하기보다는, 왜 그런 선택을 했는지와 그 과정에서 생긴 시행착오를 남깁니다.
              <br />
              선택과 선택으로 이어지는 결과들의 연결을 스스로 납득하기 위해 글을 씁니다.
              <br />
              <br />이 블로그는 제 태도와 생각을 bit 단위로 쌓아가는 기록장입니다.
            </p>

            {/* <div className="py-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex gap-1.5">
                  {[...Array(3)].map((_, i) => (
                    <PixelDot key={i} className="text-foreground h-2 w-2" />
                  ))}
                </div>
                <span className="text-muted-foreground font-pixel text-[10px] tracking-wider">FOCUS</span>
              </div>

              <ul className="space-y-3">
                {[
                  '프론트엔드 구조와 설계',
                  '코드 품질을 유지하는 방법',
                  'UI 구현과 인터랙션 디테일',
                  '학습 과정과 성장 기록',
                ].map((item) => (
                  <li key={item} className="text-foreground/90 flex items-center gap-3">
                    <PixelDot className="text-muted-foreground/60 h-1.5 w-1.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div> */}

            {/* <p className="text-muted-foreground leading-relaxed">
              Feel free to explore the posts and reach out if you'd like to discuss design, collaborate on a project, or
              just chat about pixels.
            </p> */}
          </div>

          {/* Decorative Footer */}
          <div className="mt-16 flex justify-center">
            <PixelDecoration variant="horizontal" />
          </div>
        </div>
      </main>

      <BlogFooter />
    </div>
  );
}
