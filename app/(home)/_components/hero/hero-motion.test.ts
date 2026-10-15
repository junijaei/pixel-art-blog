import { act, renderHook } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

import { useHeroReducedMotion } from '@/app/(home)/_components/hero/hero-motion';

afterEach(() => vi.unstubAllGlobals());

it('reacts to motion preference changes and removes its subscription on unmount', () => {
  const media = new EventTarget();
  let matches = true;
  const remove = vi.spyOn(media, 'removeEventListener');
  vi.stubGlobal('matchMedia', () => ({
    get matches() {
      return matches;
    },
    addEventListener: media.addEventListener.bind(media),
    removeEventListener: media.removeEventListener.bind(media),
  }));
  const { result, unmount } = renderHook(useHeroReducedMotion);
  expect(result.current).toBe(true);
  act(() => {
    matches = false;
    media.dispatchEvent(new Event('change'));
  });
  expect(result.current).toBe(false);
  unmount();
  expect(remove).toHaveBeenCalledWith('change', expect.any(Function));
});
