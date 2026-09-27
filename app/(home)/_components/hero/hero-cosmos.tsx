'use client';

import type { ThemeMode } from '@/app/(home)/_components/hero/hero-scene';
import { FrameLink } from '@/features/link-preview/components/frame-link';
import { cn } from '@/shared/lib/utils';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

// three/@react-three는 이 둘을 통해서만 들어온다. 정적 import로 바꾸면 홈 초기 번들에 다시 실린다.
const HeroBackground = dynamic(() => import('./hero-scene').then((m) => m.HeroBackground), { ssr: false });
const HeroCore = dynamic(() => import('./hero-scene').then((m) => m.HeroCore), { ssr: false });

// --- Constants ---

const HERO_SECTION_ACTIVE_CLASS =
  'bg-background relative h-[calc(100dvh-60px)] min-h-150 w-full overflow-hidden transition-colors duration-700 md:h-[calc(100dvh-65px)]';

const DECORATIVE_FRAME_SEGMENTS = [
  'top-8 left-8 h-px w-16',
  'top-8 left-8 h-16 w-px',
  'top-8 right-8 h-px w-16',
  'top-8 right-8 h-16 w-px',
  'bottom-8 left-8 h-px w-16',
  'bottom-8 left-8 h-16 w-px',
  'bottom-8 right-8 h-px w-16',
  'bottom-8 right-8 h-16 w-px',
] as const;

// --- Props ---

interface HeroCosmosProps {
  className?: string;
}

// --- Main ---

export function HeroCosmos({ className }: HeroCosmosProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  const yTranslate = useTransform(scrollY, [0, 500], [0, 100]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 400], [1, 0.95]);

  const theme: ThemeMode = resolvedTheme === 'dark' ? 'dark' : 'light';
  const reducedMotion = !!prefersReducedMotion;

  return (
    <section className={cn(HERO_SECTION_ACTIVE_CLASS, className)}>
      {/* 3D는 테마가 확정된 뒤에만 붙는다. 텍스트는 서버에서 먼저 그려진다. */}
      {mounted && <HeroBackground theme={theme} reducedMotion={reducedMotion} />}

      <HeroContent yTranslate={yTranslate} opacity={opacity} scale={scale} reducedMotion={reducedMotion} />

      {mounted && <HeroCore theme={theme} reducedMotion={reducedMotion} />}

      <DecorativeFrame />
    </section>
  );
}

function HeroContent({
  opacity,
  scale,
  yTranslate,
  reducedMotion,
}: {
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
  yTranslate: MotionValue<number>;
  reducedMotion: boolean;
}) {
  return (
    <div className="relative flex h-full items-center justify-center px-6">
      <motion.div
        style={reducedMotion ? undefined : { y: yTranslate, opacity, scale }}
        className="mx-auto max-w-5xl text-center"
      >
        <h1 className="font-mulmaru text-foreground mb-10 text-6xl leading-[1.05] tracking-tighter transition-colors duration-700 md:text-[10rem]">
          <span className="block overflow-hidden">
            <span className="text-foreground inline-block tracking-wide motion-safe:animate-[hero-rise_0.8s_cubic-bezier(0.16,1,0.3,1)_0.2s_both] sm:leading-48">
              Bit
            </span>
          </span>
          <span className="-mt-2 block overflow-hidden md:-mt-8">
            <span className="text-muted-foreground/60 inline-block tracking-wide transition-[text-stroke] duration-700 motion-safe:animate-[hero-rise_0.8s_cubic-bezier(0.16,1,0.3,1)_0.4s_both]">
              By Bit
            </span>
          </span>
        </h1>

        <div className="mx-auto mt-4 max-w-2xl motion-safe:animate-[hero-fade-up_0.6s_ease-out_0.4s_both]">
          <p className="text-foreground/70 mt-16 mb-12 text-sm leading-relaxed tracking-wide text-balance break-keep transition-colors duration-700 sm:mt-0 md:text-base">
            Bit by Bit는 작은 단위의 선택과 고민이 모여 하나의 결과를 만들어내는 흐름을 담고 있습니다.
            <br className="hidden sm:inline" /> 이 블로그에서는 프론트엔드를 설계하고 구현하며 쌓아온 생각과 경험을
            기록합니다.
          </p>

          <FrameLink href="/posts" className="relative z-30">
            전체 글 보기
          </FrameLink>
        </div>
      </motion.div>
    </div>
  );
}

function DecorativeFrame() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-30">
      {DECORATIVE_FRAME_SEGMENTS.map((style, index) => (
        <div key={index} className={cn('bg-foreground/20 absolute transition-colors duration-700', style)} />
      ))}

      <div className="font-pixel text-foreground/20 invisible absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] tracking-widest transition-colors duration-700 sm:visible">
        JUNI-JAEI / BIT-BY-BIT
      </div>
    </div>
  );
}
