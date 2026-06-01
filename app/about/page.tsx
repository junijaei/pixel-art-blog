import { BlogFooter } from '@/components/layouts/footer';
import { BlogHeader } from '@/components/layouts/header';
import {
  PixelArrow,
  PixelDecoration,
  PixelFile,
  PixelGithub,
  PixelLinkedin,
  PixelMail,
  PixelUser,
} from '@/components/ui';
import type { Metadata } from 'next';
import Link from 'next/link';

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  title: 'About',
  description: '프론트엔드 개발자 전희재(junijaei)를 소개합니다.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About',
    description: '프론트엔드 개발자 전희재(junijaei)를 소개합니다.',
    url: '/about',
    type: 'profile',
    firstName: '희재',
    lastName: '전',
    username: 'junijaei',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About | 전희재',
    description: '프론트엔드 개발자 전희재(junijaei)를 소개합니다.',
    creator: '@junijaei',
    images: ['/og-image.png'],
  },
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: '전희재',
            alternateName: 'junijaei',
            jobTitle: '프론트엔드 개발자',
            url: 'https://github.com/junijaei',
            email: 'hjhj7895598@gmail.com',
            sameAs: ['https://github.com/junijaei', 'https://linkedin.com/in/junijaei'],
          }),
        }}
      />
      <BlogHeader />

      <main className="flex-1 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 sm:mb-12">
            <div className="mb-6 flex items-center gap-4">
              <PixelUser className="text-muted-foreground h-5 w-5" />
              <span className="text-muted-foreground font-pixel text-[10px] tracking-widest uppercase">About</span>
            </div>

            <h1 className="font-mulmaru mb-6 text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
              프론트엔드 개발자,
              <br className="inline sm:hidden" />
              전희재입니다.
            </h1>
          </div>

          <div className="border-border/80 bg-card/70 relative mx-auto mb-8 flex max-w-xl flex-col items-center gap-8 rounded-2xl border p-5 sm:mb-12 sm:flex-row sm:items-start sm:p-6">
            <div className="bg-secondary border-border/80 flex h-44 w-44 shrink-0 items-center justify-center rounded-xl border">
              <img
                src="/profile.png"
                width={176}
                height={176}
                alt="프로필 이미지. 엘모가 컴퓨터 앞에 앉아 코딩을 하고 있다."
                className="rounded-xl"
              />
            </div>

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
          </div>

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
          </div>

          <div className="my-8 flex justify-center sm:my-16">
            <PixelDecoration layout="horizontal" gradientStart="center" />
          </div>

          <div>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              더 자세한 경험이 궁금하다면, 아래 이력서를 확인해 주세요.
            </p>
            <Link
              href="https://assets.junijaei.co.kr/resume/FE_%E1%84%8C%E1%85%A5%E1%86%AB%E1%84%92%E1%85%B4%E1%84%8C%E1%85%A2_%E1%84%8B%E1%85%B5%E1%84%85%E1%85%A7%E1%86%A8%E1%84%89%E1%85%A5.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="border-border bg-secondary/40 hover:border-muted-foreground/30 hover:bg-secondary focus-visible:ring-ring group mx-auto flex max-w-xl items-center justify-between rounded-xl border px-5 py-4 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              <div className="flex items-center gap-4">
                <div className="bg-foreground/5 border-border flex h-10 w-10 items-center justify-center rounded-lg border">
                  <PixelFile className="text-muted-foreground h-5 w-5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-foreground text-sm font-medium">전희재 이력서</span>
                  <span className="text-muted-foreground font-pixel text-[9px] tracking-wider">PDF · FE DEVELOPER</span>
                </div>
              </div>
              <PixelArrow className="text-muted-foreground group-hover:text-foreground h-4 w-4 -rotate-45 transition-colors duration-300" />
            </Link>
          </div>
        </div>
      </main>

      <BlogFooter />
    </div>
  );
}
