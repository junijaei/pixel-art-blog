'use client';

import { useEffect, useRef } from 'react';
import PixelSnow from '@/app/(home)/_components/hero/pixel-snow';
import type { MotionValue } from 'motion/react';

export type ThemeMode = 'light' | 'dark';

export interface HeroSceneProps {
  reducedMotion: boolean;
  opacity: MotionValue<number>;
  theme: ThemeMode;
}

/** Pixel snow fills the hero while the HTML headline and CTA stay above it. */
export function HeroBackground({ opacity, theme, reducedMotion }: HeroSceneProps) {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const isLight = theme === 'light';

  useEffect(() => {
    const background = backgroundRef.current;
    if (!background) return;

    const updateOpacity = (value: number) => {
      background.style.opacity = String(reducedMotion ? 1 : value);
    };

    updateOpacity(opacity.get());
    return opacity.on('change', updateOpacity);
  }, [opacity, reducedMotion]);

  return (
    <div
      ref={backgroundRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0"
      style={{ opacity: 1 }}
    >
      <PixelSnow
        className="absolute inset-0"
        color={isLight ? '#5c5c5c' : '#dedede'}
        variant="square"
        density={0.6}
        speed={reducedMotion ? 0.25 : 1}
        wind={reducedMotion ? 0.05 : 0.25}
        sway={reducedMotion ? 0.18 : 0.5}
        flakeSize={1}
        pixelSize={3}
        depth={0.6}
        brightness={1}
        glow={0.8}
        twinkle={reducedMotion ? 0 : 0.35}
        accumulate
        mouseInteraction={!reducedMotion}
        intro={!reducedMotion}
        fade={0}
        opacity={1}
        lightMode={isLight}
      />
    </div>
  );
}
