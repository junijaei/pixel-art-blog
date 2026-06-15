'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

import { cn } from '@/shared/lib/utils';

interface HeroBitFieldProps {
  className?: string;
}

interface BitParticle {
  alpha: number;
  depth: number;
  phase: number;
  radius: number;
  seed: number;
  size: number;
  speed: number;
  x: number;
  y: number;
}

const PARTICLE_COUNT = 118;
const STREAM_COUNT = 7;
const TARGET_FPS = 30;
const FRAME_INTERVAL = 1000 / TARGET_FPS;

function seededNoise(value: number) {
  const x = Math.sin(value * 12.9898) * 43758.5453;

  return x - Math.floor(x);
}

function resolveColor(element: HTMLElement, token: string) {
  return getComputedStyle(element).getPropertyValue(token).trim();
}

function getThemeColors(element: HTMLElement, isDark: boolean) {
  const foreground = resolveColor(element, '--foreground');
  const mutedForeground = resolveColor(element, '--muted-foreground');
  const background = resolveColor(element, '--background');

  return {
    background,
    dim: `color-mix(in oklch, ${mutedForeground} ${isDark ? 76 : 82}%, ${background} ${isDark ? 24 : 18}%)`,
    glow: `color-mix(in oklch, ${foreground} ${isDark ? 42 : 32}%, ${background} ${isDark ? 58 : 68}%)`,
    strong: `color-mix(in oklch, ${foreground} ${isDark ? 64 : 48}%, ${background} ${isDark ? 36 : 52}%)`,
  };
}

function drawPixel(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
  alpha: number
) {
  context.globalAlpha = alpha;
  context.fillStyle = color;
  context.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(size)), Math.max(1, Math.round(size)));
}

/**
 * Large hero-only pixel field animation.
 *
 * The effect uses canvas 2D instead of WebGL so it stays easy to remove and cheap enough for a blog hero.
 * It pauses when hidden/off-screen and falls back to a static composition for reduced-motion users.
 */
export function HeroBitField({ className }: HeroBitFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;

    if (!canvas || !wrapper) {
      return;
    }

    const context = canvas.getContext('2d');

    if (!context) {
      return;
    }

    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isDark = resolvedTheme === 'dark';
    const randomSeed = window.crypto.getRandomValues(new Uint32Array(1))[0] ?? Date.now();
    let animationFrame = 0;
    let columns = 0;
    let height = 0;
    let isVisible = false;
    let lastFrameAt = 0;
    let particles: BitParticle[] = [];
    let rows = 0;
    let width = 0;
    let colors = getThemeColors(wrapper, isDark);

    const createParticle = (index: number): BitParticle => {
      const seed = randomSeed + index * 37;
      const depth = 0.22 + Math.pow(seededNoise(seed + 4), 0.72) * 0.78;

      return {
        alpha: 0.08 + depth * 0.22 + seededNoise(seed + 7) * 0.1,
        depth,
        phase: seededNoise(seed + 11) * Math.PI * 2,
        radius: 0.18 + seededNoise(seed + 13) * 0.82,
        seed,
        size: 2 + Math.round(depth * 5),
        speed: 0.00008 + seededNoise(seed + 17) * 0.00022,
        x: seededNoise(seed + 19),
        y: seededNoise(seed + 23),
      };
    };

    const resize = () => {
      const rect = wrapper.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      columns = Math.max(12, Math.ceil(width / 14));
      rows = Math.max(8, Math.ceil(height / 14));
      colors = getThemeColors(wrapper, isDark);
      particles = Array.from({ length: PARTICLE_COUNT }, (_, index) => createParticle(index));

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawGrid = (time: number) => {
      const cell = 14;
      const pulse = (Math.sin(time * 0.0012) + 1) / 2;

      for (let col = 0; col <= columns; col += 1) {
        const edgeBias = Math.abs(col / Math.max(columns, 1) - 0.5) * 2;

        if (edgeBias < 0.26) {
          continue;
        }

        for (let row = 0; row <= rows; row += 1) {
          const noise = seededNoise(col * 29 + row * 43 + randomSeed);

          if (noise < 0.82) {
            continue;
          }

          const alpha = (0.035 + noise * 0.055 + pulse * 0.025) * Math.min(1, edgeBias + 0.12);
          drawPixel(context, col * cell, row * cell, 2, colors.dim, alpha);
        }
      }
    };

    const drawStreams = (time: number) => {
      for (let stream = 0; stream < STREAM_COUNT; stream += 1) {
        const seed = randomSeed + stream * 101;
        const side = seededNoise(seed) > 0.46 ? 1 : -1;
        const startX =
          side > 0 ? width * (0.6 + seededNoise(seed + 2) * 0.32) : width * (0.08 + seededNoise(seed + 2) * 0.26);
        const startY = height * (0.12 + seededNoise(seed + 3) * 0.74);
        const length = 14 + Math.floor(seededNoise(seed + 5) * 18);
        const speed = 0.00018 + seededNoise(seed + 7) * 0.00022;
        const progressOffset = (time * speed + seededNoise(seed + 9)) % 1;

        for (let index = 0; index < length; index += 1) {
          const progress = (index / length + progressOffset) % 1;
          const arc = Math.sin(progress * Math.PI);
          const x = startX + side * progress * width * (0.24 + seededNoise(seed + 11) * 0.18);
          const y = startY + Math.sin(progress * Math.PI * 2 + seed) * 26 - arc * height * 0.16;
          const size = 2 + arc * 5;
          const alpha = (1 - Math.abs(progress - 0.5) * 1.8) * 0.32;

          if (alpha > 0) {
            drawPixel(context, x, y, size, colors.strong, alpha);
          }
        }
      }
    };

    const drawOrbit = (time: number) => {
      const centerX = width * 0.5;
      const centerY = height * 0.48;
      const maxRadius = Math.min(width, height) * 0.58;

      particles.forEach((particle) => {
        const angle = particle.phase + time * particle.speed * (0.7 + particle.depth);
        const radius = maxRadius * particle.radius;
        const squash = 0.34 + particle.depth * 0.36;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius * squash;
        const centerFade = Math.min(1, Math.abs(x / Math.max(width, 1) - 0.5) * 3.2 + 0.18);
        const alpha = particle.alpha * centerFade;

        drawPixel(context, x, y, particle.size, particle.depth > 0.72 ? colors.strong : colors.glow, alpha);
      });
    };

    const drawStaticComposition = () => {
      context.clearRect(0, 0, width, height);
      drawGrid(1200);
      drawStreams(1800);
      drawOrbit(2400);
      context.globalAlpha = 1;
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      drawGrid(time);
      drawStreams(time);
      drawOrbit(time);
      context.globalAlpha = 1;
    };

    const shouldAnimate = () => !reduceMotionQuery.matches && isVisible && document.visibilityState === 'visible';

    const stopAnimation = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    };

    const tick = (time: number) => {
      animationFrame = 0;

      if (!shouldAnimate()) {
        return;
      }

      if (time - lastFrameAt >= FRAME_INTERVAL) {
        draw(time);
        lastFrameAt = time;
      }

      animationFrame = window.requestAnimationFrame(tick);
    };

    const syncAnimationState = () => {
      if (!shouldAnimate()) {
        stopAnimation();
        if (reduceMotionQuery.matches) {
          drawStaticComposition();
        }
        return;
      }

      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(tick);
      }
    };

    resize();
    drawStaticComposition();

    const resizeObserver = new ResizeObserver(() => {
      stopAnimation();
      resize();
      drawStaticComposition();
      syncAnimationState();
    });

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = Boolean(entry?.isIntersecting);
        syncAnimationState();
      },
      { threshold: 0.01 }
    );

    const handleVisibilityChange = () => {
      syncAnimationState();
    };

    const handleMotionChange = () => {
      stopAnimation();
      drawStaticComposition();
      syncAnimationState();
    };

    resizeObserver.observe(wrapper);
    intersectionObserver.observe(wrapper);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    reduceMotionQuery.addEventListener('change', handleMotionChange);

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      reduceMotionQuery.removeEventListener('change', handleMotionChange);
      stopAnimation();
    };
  }, [resolvedTheme]);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,var(--foreground)_0%,transparent_8%),radial-gradient(circle_at_18%_26%,var(--muted-foreground)_0%,transparent_22%),radial-gradient(circle_at_82%_68%,var(--muted-foreground)_0%,transparent_24%)] opacity-[0.035] dark:opacity-[0.075]" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="from-background/95 via-background/72 to-background/18 pointer-events-none absolute inset-0 bg-linear-to-r" />
      <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t to-transparent" />
      <div className="from-background pointer-events-none absolute inset-x-0 top-0 h-16 bg-linear-to-b to-transparent" />
    </div>
  );
}
