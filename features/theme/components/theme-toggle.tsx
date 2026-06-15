'use client';

import { PixelMoon, PixelSun } from '@/shared/ui/pixel';
import { cn } from '@/shared/lib/utils';
import { useTheme } from 'next-themes';
import { type CSSProperties, type MouseEvent, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

export interface ThemeToggleProps {
  className?: string;
}

type ThemeMode = 'dark' | 'light';

interface ThemeTransitionState {
  color: string;
  radius: number;
  x: number;
  y: number;
}

const THEME_TRANSITION_DURATION = 600;
const THEME_TRANSITION_EASING = 'cubic-bezier(.47,-0.12,1,1)';
const DARK_OVERLAY_COLOR = 'oklch(0.08 0 0)';
const LIGHT_OVERLAY_COLOR = 'oklch(1 0 0)';

/**
 * 다크/라이트 모드 전환 버튼.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [fallbackTransition, setFallbackTransition] = useState<ThemeTransitionState | null>(null);
  const fallbackClearTimerRef = useRef<number | null>(null);
  const fallbackThemeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);

    return () => {
      if (fallbackClearTimerRef.current) {
        window.clearTimeout(fallbackClearTimerRef.current);
      }

      if (fallbackThemeTimerRef.current) {
        window.clearTimeout(fallbackThemeTimerRef.current);
      }
    };
  }, []);

  if (!mounted) {
    return (
      <button
        className={cn('hover:bg-muted/70 cursor-pointer rounded-lg p-2 transition-colors', className)}
        aria-label="테마 전환 버튼"
      >
        <div className="h-4 w-4" />
      </button>
    );
  }

  const isDark = resolvedTheme === 'dark';
  const nextTheme: ThemeMode = isDark ? 'light' : 'dark';

  const calculateTransition = (element: HTMLElement): ThemeTransitionState => {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    return {
      color: nextTheme === 'dark' ? DARK_OVERLAY_COLOR : LIGHT_OVERLAY_COLOR,
      radius,
      x,
      y,
    };
  };

  const shouldReduceMotion = () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  const runFallbackTransition = (transition: ThemeTransitionState) => {
    if (fallbackThemeTimerRef.current) {
      window.clearTimeout(fallbackThemeTimerRef.current);
    }

    if (fallbackClearTimerRef.current) {
      window.clearTimeout(fallbackClearTimerRef.current);
    }

    setFallbackTransition(transition);

    fallbackThemeTimerRef.current = window.setTimeout(() => {
      setTheme(nextTheme);
      fallbackThemeTimerRef.current = null;
    }, THEME_TRANSITION_DURATION * 0.45);

    fallbackClearTimerRef.current = window.setTimeout(() => {
      setFallbackTransition(null);
      fallbackClearTimerRef.current = null;
    }, THEME_TRANSITION_DURATION);
  };

  const toggleTheme = (event: MouseEvent<HTMLButtonElement>) => {
    if (shouldReduceMotion()) {
      setTheme(nextTheme);
      return;
    }

    const transition = calculateTransition(event.currentTarget);
    const startViewTransition =
      'startViewTransition' in document ? document.startViewTransition.bind(document) : undefined;

    if (!startViewTransition) {
      runFallbackTransition(transition);
      return;
    }

    const viewTransition = startViewTransition(() => {
      flushSync(() => {
        setTheme(nextTheme);
      });
    });

    viewTransition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0 at ${transition.x}px ${transition.y}px)`,
            `circle(${transition.radius}px at ${transition.x}px ${transition.y}px)`,
          ],
        },
        {
          duration: THEME_TRANSITION_DURATION,
          easing: THEME_TRANSITION_EASING,
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  };

  return (
    <>
      <button
        onClick={toggleTheme}
        className={cn('hover:bg-muted/70 cursor-pointer rounded-lg p-2 transition-colors', className)}
        aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
      >
        {isDark ? (
          <PixelSun className="text-muted-foreground h-4 w-4 transition-transform hover:rotate-12" />
        ) : (
          <PixelMoon className="text-muted-foreground h-4 w-4 transition-transform hover:-rotate-12" />
        )}
      </button>

      {fallbackTransition && (
        <div
          aria-hidden="true"
          className="theme-transition-fallback"
          style={
            {
              '--theme-transition-color': fallbackTransition.color,
              '--theme-transition-radius': `${fallbackTransition.radius}px`,
              '--theme-transition-x': `${fallbackTransition.x}px`,
              '--theme-transition-y': `${fallbackTransition.y}px`,
            } as CSSProperties
          }
        />
      )}
    </>
  );
}
