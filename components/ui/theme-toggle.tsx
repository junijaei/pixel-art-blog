'use client';

import { PixelMoon, PixelSun } from '@/components/ui/pixel';
import { cn } from '@/utils/utils';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export interface ThemeToggleProps {
  className?: string;
}

/**
 * 다크/라이트 모드 토글 버튼
 * 시스템 테마가 기본값이며, 클릭 시 토글 전환
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Hydration mismatch 방지
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // 서버 렌더링 시 placeholder
    return (
      <button
        className={cn('hover:bg-secondary cursor-pointer rounded-lg p-2 transition-colors', className)}
        aria-label="Toggle theme"
      >
        <div className="h-4 w-4" />
      </button>
    );
  }

  const isDark = resolvedTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn('hover:bg-secondary cursor-pointer rounded-lg p-2 transition-colors', className)}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <PixelSun className="text-muted-foreground h-4 w-4 transition-transform hover:rotate-12" />
      ) : (
        <PixelMoon className="text-muted-foreground h-4 w-4 transition-transform hover:-rotate-12" />
      )}
    </button>
  );
}
