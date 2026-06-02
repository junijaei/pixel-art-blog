'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

import { cn } from '@/utils/utils';

interface HeroPixelStackProps {
  className?: string;
}

interface FallingPixel {
  alpha: number;
  col: number;
  delay: number;
  depth: number;
  row: number;
  speed: number;
}

const CELL_SIZE = 9;
const FALLING_PIXEL_COUNT = 46;
const CENTER_CLEAR_START = 0.2;
const CENTER_CLEAR_END = 0.55;
const CENTER_COLUMN_WEIGHT = 0.14;
const MOBILE_STATIC_QUERY = '(max-width: 639px)';
const MIN_DEPTH = 0.18;

function seededNoise(value: number) {
  const x = Math.sin(value * 12.9898) * 43758.5453;

  return x - Math.floor(x);
}

function resolveMutedForeground(element: HTMLElement, isDark: boolean) {
  const styles = getComputedStyle(element);
  const mutedForeground = styles.getPropertyValue('--muted-foreground').trim();
  const foreground = styles.getPropertyValue('--foreground').trim();

  if (!isDark) {
    return mutedForeground;
  }

  return `color-mix(in oklch, ${mutedForeground} 68%, ${foreground} 32%)`;
}

/**
 * Hero background animation that drops small pixels and lets them settle into a quiet stack.
 *
 * The canvas intentionally covers the whole hero area, while the density/opacity stays restrained
 * so the hero copy remains readable.
 */
export function HeroPixelStack({ className }: HeroPixelStackProps) {
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
    const mobileStaticQuery = window.matchMedia(MOBILE_STATIC_QUERY);
    let shouldRenderStaticOnly = reduceMotionQuery.matches || mobileStaticQuery.matches;
    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let columns = 0;
    let rows = 0;
    let maxStackHeight = 0;
    let pile: number[] = [];
    let pixels: FallingPixel[] = [];
    const isDark = resolvedTheme === 'dark';
    let color = resolveMutedForeground(wrapper, isDark);
    let isVisible = false;
    const randomSeed = window.crypto.getRandomValues(new Uint32Array(1))[0] ?? Date.now();

    const getSideLanes = () => {
      const leftEnd = Math.max(1, Math.floor(columns * CENTER_CLEAR_START));
      const rightStart = Math.min(columns - 1, Math.ceil(columns * CENTER_CLEAR_END));

      return { leftEnd, rightStart };
    };

    const getColumnWeight = (col: number) => {
      const { leftEnd, rightStart } = getSideLanes();

      return col < leftEnd || col >= rightStart ? 1 : CENTER_COLUMN_WEIGHT;
    };

    const isSideColumn = (col: number) => {
      return getColumnWeight(col) === 1;
    };

    const chooseColumn = (seed: number) => {
      const base = seededNoise(seed);
      const { leftEnd, rightStart } = getSideLanes();

      if (columns < 12 || leftEnd >= rightStart) {
        return Math.min(columns - 1, Math.max(0, Math.floor(base * columns)));
      }

      const leftWeight = leftEnd;
      const centerWidth = Math.max(0, rightStart - leftEnd);
      const centerWeight = centerWidth * CENTER_COLUMN_WEIGHT;
      const rightWeight = columns - rightStart;
      const totalWeight = Math.max(leftWeight + centerWeight + rightWeight, 1);
      const lane = seededNoise(seed + 41) * totalWeight;

      if (lane < leftWeight) {
        return Math.min(leftEnd - 1, Math.max(0, Math.floor(base * leftEnd)));
      }

      if (lane < leftWeight + centerWeight) {
        return Math.min(rightStart - 1, Math.max(leftEnd, leftEnd + Math.floor(base * centerWidth)));
      }

      return Math.min(columns - 1, rightStart + Math.floor(base * (columns - rightStart)));
    };

    const createPixel = (index: number, offset = 0): FallingPixel => {
      const seed = index * 19 + offset * 11 + columns * 3 + rows + randomSeed;
      const speedNoise = seededNoise(seed + 3);
      const depth = MIN_DEPTH + Math.pow(seededNoise(seed + 23), 0.85) * (1 - MIN_DEPTH);
      const isInitialPixel = offset === 0;
      const progress = isInitialPixel ? (index + seededNoise(seed + 17)) / FALLING_PIXEL_COUNT : seededNoise(seed + 5);
      const col = chooseColumn(seed);
      const landingRow = rows - (pile[col] ?? 0) - 1;
      const row = isInitialPixel
        ? Math.max(-1, Math.min(landingRow - 1, progress * Math.max(landingRow, 1)))
        : -seededNoise(seed + 5) * rows * 0.7 - 1;

      return {
        alpha: 0.08 + depth * 0.24 + Math.pow(seededNoise(seed + 13), 0.72) * 0.08,
        col,
        delay: isInitialPixel ? 0 : seededNoise(seed + 7) * 90,
        depth,
        row,
        speed: (0.01 + Math.pow(speedNoise, 1.35) * 0.052) * (0.68 + depth * 0.92),
      };
    };

    const reset = () => {
      const rect = wrapper.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      columns = Math.max(8, Math.ceil(width / CELL_SIZE));
      rows = Math.max(8, Math.ceil(height / CELL_SIZE));
      maxStackHeight = Math.max(4, Math.min(11, Math.floor(rows * 0.18)));
      pile = Array.from({ length: columns }, (_, col) => {
        const { leftEnd, rightStart } = getSideLanes();
        const isLeft = col < leftEnd;
        const isCenter = !isSideColumn(col);
        const laneWidth = isCenter ? rightStart - leftEnd : isLeft ? leftEnd : columns - rightStart;
        const laneIndex = isCenter
          ? Math.min(col - leftEnd + 1, rightStart - col)
          : isLeft
            ? leftEnd - col
            : col - rightStart + 1;
        const edgeWeight = laneIndex / Math.max(laneWidth, 1);
        const randomHeight = seededNoise(col * 31 + randomSeed) * maxStackHeight * 0.72;
        const wave = Math.sin((col + randomSeed) * 0.43) * 1.2;
        const columnWeight = getColumnWeight(col);
        const heightInCells = (randomHeight + edgeWeight * 2.5 + wave) * columnWeight;

        return Math.max(0, Math.min(maxStackHeight, Math.floor(heightInCells)));
      });
      pixels = Array.from({ length: FALLING_PIXEL_COUNT }, (_, index) => createPixel(index));
      color = resolveMutedForeground(wrapper, isDark);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawSquare = (col: number, row: number, alpha: number, depth = 0.56, offsetX = 0) => {
      const gap = 1.5;
      const depthScale = 0.68 + depth * 0.56;
      const size = (CELL_SIZE - gap * 2) * depthScale;
      const x = col * CELL_SIZE + gap + (CELL_SIZE - size) / 2 + offsetX;
      const y = row * CELL_SIZE + gap + (CELL_SIZE - size) / 2;

      context.globalAlpha = alpha;
      context.fillStyle = color;
      context.fillRect(x, y, size, size);
    };

    const drawPile = () => {
      for (let col = 0; col < columns; col += 1) {
        const heightInCells = pile[col] ?? 0;

        for (let level = 0; level < heightInCells; level += 1) {
          const row = rows - level - 1;
          const depth = level / Math.max(maxStackHeight, 1);
          const edgeFade = (0.88 + seededNoise(col + randomSeed) * 0.12) * getColumnWeight(col);
          const alpha = (0.1 + Math.pow(seededNoise(col * 17 + level * 29 + randomSeed), 0.68) * 0.3) * edgeFade;

          drawSquare(col, row, alpha * (1 - depth * 0.38), 0.48 + (1 - depth) * 0.22);
        }
      }
    };

    const settlePixel = (pixel: FallingPixel, index: number, frame: number) => {
      pile[pixel.col] = Math.min(maxStackHeight, (pile[pixel.col] ?? 0) + 1);

      if (pile[pixel.col] >= maxStackHeight) {
        const start = Math.max(0, pixel.col - 2);
        const end = Math.min(columns - 1, pixel.col + 2);

        for (let col = start; col <= end; col += 1) {
          pile[col] = Math.max(0, (pile[col] ?? 1) - 1);
        }
      }

      pixels[index] = createPixel(index, frame);
    };

    const drawStaticFrame = ({ showFallingPixels = true }: { showFallingPixels?: boolean } = {}) => {
      context.clearRect(0, 0, width, height);
      drawPile();

      if (showFallingPixels) {
        pixels.slice(0, 12).forEach((pixel) => {
          drawSquare(
            pixel.col,
            Math.max(0, Math.floor(rows * seededNoise(pixel.col + 9))),
            pixel.alpha * 0.72,
            pixel.depth
          );
        });
      }

      context.globalAlpha = 1;
    };

    const drawCurrentStaticMode = () => {
      drawStaticFrame({ showFallingPixels: !mobileStaticQuery.matches });
    };

    const shouldAnimate = () => !shouldRenderStaticOnly && isVisible && document.visibilityState === 'visible';

    const stopAnimation = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    };

    const startAnimation = () => {
      if (animationFrame || !shouldAnimate()) {
        return;
      }

      animationFrame = window.requestAnimationFrame(tick);
    };

    const syncAnimationState = () => {
      if (shouldAnimate()) {
        startAnimation();
        return;
      }

      stopAnimation();
    };

    const tick = (frame: number) => {
      animationFrame = 0;

      if (!shouldAnimate()) {
        return;
      }

      context.clearRect(0, 0, width, height);
      drawPile();

      pixels.forEach((pixel, index) => {
        if (pixel.delay > 0) {
          pixel.delay -= 1;
          return;
        }

        pixel.row += pixel.speed * (frame % 240 < 120 ? 1.08 : 0.92);

        const landingRow = rows - (pile[pixel.col] ?? 0) - 1;

        if (pixel.row >= landingRow) {
          settlePixel(pixel, index, frame);
          return;
        }

        if (pixel.row >= 0) {
          drawSquare(pixel.col, Math.floor(pixel.row), pixel.alpha, pixel.depth);
        }
      });

      context.globalAlpha = 1;
      startAnimation();
    };

    reset();

    if (shouldRenderStaticOnly) {
      drawCurrentStaticMode();
    }

    const resizeObserver = new ResizeObserver(() => {
      stopAnimation();
      reset();

      if (shouldRenderStaticOnly) {
        drawCurrentStaticMode();
      } else {
        syncAnimationState();
      }
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

    const handleMotionModeChange = () => {
      shouldRenderStaticOnly = reduceMotionQuery.matches || mobileStaticQuery.matches;
      stopAnimation();
      reset();

      if (shouldRenderStaticOnly) {
        drawCurrentStaticMode();
      } else {
        syncAnimationState();
      }
    };

    resizeObserver.observe(wrapper);
    intersectionObserver.observe(wrapper);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    reduceMotionQuery.addEventListener('change', handleMotionModeChange);
    mobileStaticQuery.addEventListener('change', handleMotionModeChange);

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      reduceMotionQuery.removeEventListener('change', handleMotionModeChange);
      mobileStaticQuery.removeEventListener('change', handleMotionModeChange);
      stopAnimation();
    };
  }, [resolvedTheme]);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className={cn(
        'text-foreground/80 pointer-events-none absolute inset-0 overflow-hidden',
        'mask-[linear-gradient(90deg,black_0%,black_24%,transparent_38%,transparent_62%,black_76%,black_100%)]',
        className
      )}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="via-background pointer-events-none absolute inset-y-0 left-1/2 w-[min(52rem,78%)] -translate-x-1/2 bg-linear-to-r from-transparent to-transparent" />
      <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t to-transparent" />
    </div>
  );
}
