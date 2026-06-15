import { PixelArrow, PixelDecoration, PixelFile, PixelGithub, PixelLinkedin, PixelMail } from '@/shared/ui';
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

const PROFILE_FRAME_SEGMENTS = [
  '-top-2 -left-2 h-px w-5',
  '-top-2 -left-2 h-5 w-px',
  '-top-2 -right-2 h-px w-5',
  '-top-2 -right-2 h-5 w-px',
  '-bottom-2 -left-2 h-px w-5',
  '-bottom-2 -left-2 h-5 w-px',
  '-bottom-2 -right-2 h-px w-5',
  '-bottom-2 -right-2 h-5 w-px',
] as const;

const CONTACT_LINKS = [
  {
    label: 'Mail',
    value: 'hjhj7895598@gmail.com',
    href: 'mailto:hjhj7895598@gmail.com',
    icon: PixelMail,
    external: false,
  },
  {
    label: 'Github',
    value: 'github.com/junijaei',
    href: 'https://github.com/junijaei',
    icon: PixelGithub,
    external: true,
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/junijaei',
    href: 'https://linkedin.com/in/junijaei',
    icon: PixelLinkedin,
    external: true,
  },
] as const;

function SectionLabel({ label, meta }: { label: string; meta?: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-pixel text-muted-foreground text-[10px] tracking-[0.3em] uppercase">{label}</span>
      <PixelDecoration layout="horizontal" dotCount={3} gradientStart="start" className="opacity-35" />
      <div className="bg-border h-px flex-1" />
      {meta && (
        <span className="font-pixel text-muted-foreground/50 hidden text-[10px] tracking-widest uppercase sm:inline">
          {meta}
        </span>
      )}
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
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
      <main className="flex-1 px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-2xl">
          {/* Page Header */}
          <SectionLabel label="About" meta="Juni-Jaei / FE" />

          <h1 className="font-mulmaru mt-7 text-4xl leading-tight font-semibold tracking-tight break-keep sm:text-5xl">
            프론트엔드 개발자,
            <br className="inline sm:hidden" />
            전희재입니다.
          </h1>

          {/* Profile + Intro */}
          <div className="mt-12 flex flex-col gap-10 sm:mt-16 sm:flex-row sm:items-start sm:gap-12">
            <figure className="mx-auto w-fit shrink-0 sm:mx-0">
              <div className="relative">
                {PROFILE_FRAME_SEGMENTS.map((segment) => (
                  <span key={segment} aria-hidden className={`bg-foreground/25 absolute ${segment}`} />
                ))}
                <img
                  src="/profile-light.png"
                  width={176}
                  height={176}
                  alt="프로필 이미지. 엘모가 컴퓨터 앞에 앉아 코딩을 하고 있다."
                  className="border-border/80 rounded-xl border dark:hidden"
                />
                <img
                  src="/profile-dark.png"
                  width={176}
                  height={176}
                  alt="프로필 이미지. 엘모가 컴퓨터 앞에 앉아 코딩을 하고 있다."
                  className="border-border/80 hidden rounded-xl border dark:block"
                />
              </div>
              <figcaption className="font-pixel text-muted-foreground/50 mt-4 text-center text-[9px] tracking-widest uppercase">
                Junijaei / FE Developer
              </figcaption>
            </figure>

            <div className="space-y-5">
              <p className="text-foreground/90 text-base leading-relaxed break-keep sm:text-lg">
                Bit by Bit는 작은 단위의 선택과 고민이 모여 하나의 결과를 만든다는 의미를 담고 있습니다. 이 블로그에는
                프로젝트를 설계하고 구현하며 쌓아온 생각과 경험을 기록합니다.
              </p>

              <p className="text-muted-foreground text-sm leading-relaxed break-keep sm:text-base">
                정답을 정리하기보다는, 왜 그런 선택을 했는지와 그 과정에서 생긴 시행착오를 남깁니다. 선택과 선택으로
                이어지는 결과들의 연결을 스스로 납득하기 위해 글을 씁니다.
              </p>

              <p className="text-muted-foreground text-sm leading-relaxed break-keep sm:text-base">
                이 블로그는 제 태도와 생각을 bit 단위로 쌓아가는 기록장입니다.
              </p>
            </div>
          </div>

          {/* Contact */}
          <section className="mt-16 sm:mt-20">
            <SectionLabel label="Contact" />

            <ul className="divide-border/60 border-border/60 mt-3 divide-y border-b">
              {CONTACT_LINKS.map(({ label, value, href, icon: Icon, external }) => (
                <li key={label}>
                  <Link
                    href={href}
                    {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
                    className="group focus-visible:ring-ring flex items-center gap-4 rounded-lg py-4 focus-visible:ring-2 focus-visible:ring-offset-2"
                  >
                    <Icon className="text-muted-foreground group-hover:text-foreground h-4 w-4 shrink-0 transition-colors duration-300" />
                    <span className="font-pixel text-muted-foreground/50 w-20 shrink-0 text-[9px] tracking-widest uppercase">
                      {label}
                    </span>
                    <span className="text-muted-foreground group-hover:text-foreground truncate text-sm transition-colors duration-300">
                      {value}
                    </span>
                    <PixelArrow className="text-foreground ml-auto h-3 w-3 shrink-0 -rotate-45 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Resume */}
          <section className="mt-16 sm:mt-20">
            <SectionLabel label="Resume" />

            <p className="text-muted-foreground mt-6 mb-6 text-sm leading-relaxed">
              더 자세한 경험이 궁금하다면, 아래 이력서를 확인해 주세요.
            </p>

            <Link
              href="https://assets.junijaei.co.kr/resume/FE_%E1%84%8C%E1%85%A5%E1%86%AB%E1%84%92%E1%85%B4%E1%84%8C%E1%85%A2_%E1%84%8B%E1%85%B5%E1%84%85%E1%85%A7%E1%86%A8%E1%84%89%E1%85%A5.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group border-border hover:border-muted-foreground/40 hover:bg-card focus-visible:ring-ring flex items-center justify-between rounded-xl border px-5 py-4 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              <div className="flex items-center gap-4">
                <div className="border-border bg-secondary/40 flex h-10 w-10 items-center justify-center rounded-lg border">
                  <PixelFile className="text-muted-foreground h-4 w-4" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-foreground text-sm font-medium">전희재 이력서</span>
                  <span className="font-pixel text-muted-foreground text-[9px] tracking-wider uppercase">
                    PDF / FE Developer
                  </span>
                </div>
              </div>
              <PixelArrow className="text-muted-foreground group-hover:text-foreground h-4 w-4 -rotate-45 transition-all duration-300 group-hover:translate-x-0.5" />
            </Link>
          </section>
        </div>
      </main>
    </>
  );
}
