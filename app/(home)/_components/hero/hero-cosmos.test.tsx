import { act } from 'react';
import type { ReactNode } from 'react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { HeroCosmos } from '@/app/(home)/_components/hero/hero-cosmos';

const { themeState } = vi.hoisted(() => ({ themeState: { resolvedTheme: undefined as string | undefined } }));

vi.mock('next-themes', () => ({ useTheme: () => themeState }));
vi.mock('@/app/(home)/_components/hero/hero-motion', () => ({ useHeroReducedMotion: () => false }));
vi.mock('@/app/(home)/_components/hero/hero-scene', () => ({
  HeroBackground: ({ theme }: { theme: string }) =>
    theme === 'light' ? <svg data-testid="light-background" /> : <div data-testid="dark-background" />,
  HeroCore: () => null,
}));
vi.mock('motion/react', () => ({
  motion: { div: ({ children }: { children: ReactNode }) => <div>{children}</div> },
  useScroll: () => ({ scrollYProgress: 0 }),
  useTransform: () => 0,
}));

describe('HeroCosmos hydration', () => {
  afterEach(() => {
    themeState.resolvedTheme = undefined;
    vi.unstubAllGlobals();
  });

  it.each([
    [undefined, 'dark'],
    ['dark', 'light'],
  ])('hydrates from %s before applying %s', async (serverTheme, clientTheme) => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
    themeState.resolvedTheme = serverTheme;
    const container = document.createElement('div');
    container.innerHTML = renderToString(<HeroCosmos />);
    expect(container.querySelector('[data-testid="light-background"]')).not.toBeNull();

    themeState.resolvedTheme = clientTheme;
    const errors: Error[] = [];
    let root: ReturnType<typeof hydrateRoot> | undefined;
    try {
      await act(async () => {
        root = hydrateRoot(container, <HeroCosmos />, { onRecoverableError: (error) => errors.push(error) });
      });
      expect(errors).toHaveLength(0);
      expect(container.querySelector(`[data-testid="${clientTheme}-background"]`)).not.toBeNull();
    } finally {
      await act(async () => root?.unmount());
    }
  });
});
