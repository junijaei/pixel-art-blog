'use client';

import { useEffect, useId, useRef } from 'react';

import { createHeroAnimation } from '@/app/(home)/_components/hero/hero-animation';
import { createHeroRenderer } from '@/app/(home)/_components/hero/hero-webgl';

export type ThemeMode = 'light' | 'dark';

export interface HeroSceneProps {
  reducedMotion: boolean;
  theme: ThemeMode;
}

function SceneCanvas({ layer, theme, reducedMotion }: HeroSceneProps & { layer: 'background' | 'core' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const settingsRef = useRef({ theme, reducedMotion });
  const animationRef = useRef<ReturnType<typeof createHeroAnimation> | null>(null);

  useEffect(() => {
    settingsRef.current = { theme, reducedMotion };
    animationRef.current?.setReducedMotion(reducedMotion);
    animationRef.current?.invalidate();
  }, [theme, reducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = canvas?.closest('section');
    if (!canvas || !section) return;

    let renderer: ReturnType<typeof createHeroRenderer> = null;
    let visible = true;

    const resize = () => {
      // Preserve sharp core edges without drawing a second full-screen retina canvas.
      const ratio = Math.min(window.devicePixelRatio || 1, layer === 'core' ? 1.5 : 1);
      renderer?.resize(canvas.clientWidth, canvas.clientHeight, ratio, section.clientHeight);
      animationRef.current?.invalidate();
    };

    const initialize = () => {
      renderer = createHeroRenderer(canvas, layer);
      if (!renderer) return;
      animationRef.current = createHeroAnimation(
        (time) => renderer?.render(time, settingsRef.current.theme),
        settingsRef.current.reducedMotion
      );
      animationRef.current.setVisible(visible);
      resize();
    };

    const onContextLost = (event: Event) => {
      event.preventDefault();
      animationRef.current?.dispose();
      animationRef.current = null;
      renderer?.dispose();
      renderer = null;
    };

    canvas.addEventListener('webglcontextlost', onContextLost);
    canvas.addEventListener('webglcontextrestored', initialize);
    initialize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(section);
    resizeObserver.observe(canvas);
    const intersectionObserver = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
      animationRef.current?.setVisible(visible);
    });
    intersectionObserver.observe(section);

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      canvas.removeEventListener('webglcontextlost', onContextLost);
      canvas.removeEventListener('webglcontextrestored', initialize);
      animationRef.current?.dispose();
      animationRef.current = null;
      renderer?.dispose();
    };
  }, [layer]);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none block h-full w-full" />;
}

export function HeroBackground(props: HeroSceneProps) {
  if (props.theme === 'light') return <CelestialChart reducedMotion={props.reducedMotion} />;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
      <SceneCanvas {...props} layer="background" />
      <div className="via-background/20 to-background pointer-events-none absolute inset-0 bg-radial-[circle_at_50%_50%] from-transparent transition-colors duration-700" />
      <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-t to-transparent transition-colors duration-700" />
    </div>
  );
}

export function HeroCore(props: HeroSceneProps) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20">
      <div className="absolute top-1/2 left-1/2 aspect-square h-2/5 max-w-full -translate-x-1/2 -translate-y-1/2">
        <SceneCanvas {...props} layer="core" />
      </div>
    </div>
  );
}

const CHART_ORBIT = 'M 50 370 a 670 230 0 1 0 1340 0 a 670 230 0 1 0 -1340 0';

function CelestialChart({ reducedMotion }: Pick<HeroSceneProps, 'reducedMotion'>) {
  const id = useId();

  return (
    <svg
      data-hero-chart
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1440 840"
      preserveAspectRatio="xMidYMid slice"
      className="text-foreground pointer-events-none absolute inset-0 h-full w-full"
    >
      <defs>
        <radialGradient id={`${id}-fade`}>
          <stop offset="0.3" stopColor="black" />
          <stop offset="0.85" stopColor="white" />
        </radialGradient>
        <mask id={`${id}-mask`}>
          <rect width="1440" height="840" fill={`url(#${id}-fade)`} />
        </mask>
      </defs>

      <g mask={`url(#${id}-mask)`}>
        <g transform="rotate(-20 720 370)" fill="none" stroke="currentColor" strokeWidth="0.8">
          <path d={CHART_ORBIT} opacity="0.25" />
          <ellipse cx="720" cy="370" rx="790" ry="310" opacity="0.1" />
          <g opacity="0.5" transform={reducedMotion ? 'translate(720 140)' : undefined}>
            <circle r="3" fill="currentColor" stroke="none" />
            <circle r="10" opacity="0.4" />
            {!reducedMotion && <animateMotion dur="44s" begin="-10s" repeatCount="indefinite" path={CHART_ORBIT} />}
          </g>
          <g opacity="0.65">
            {reducedMotion ? (
              <circle cx="50" cy="370" r="3" fill="currentColor" stroke="none" />
            ) : (
              <circle r="3" fill="currentColor" stroke="none">
                <animateMotion dur="28s" begin="-20s" repeatCount="indefinite" path={CHART_ORBIT} />
              </circle>
            )}
          </g>
        </g>
        <g fill="currentColor" opacity="0.25">
          <rect x="368" y="620" width="2" height="2" />
          <rect x="1100" y="240" width="2" height="2" />
          <rect x="190" y="430" width="2" height="2" />
        </g>
      </g>
    </svg>
  );
}
