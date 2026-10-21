import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ThemeToggle } from '@/features/theme/components/theme-toggle';

const { themeMock } = vi.hoisted(() => ({ themeMock: { onSetTheme: null as null | ((theme: string) => void) } }));

vi.mock('next-themes', () => ({
  useTheme: () => ({ resolvedTheme: 'dark', setTheme: (theme: string) => themeMock.onSetTheme?.(theme) }),
}));

describe('ThemeToggle animated hero', () => {
  afterEach(() => {
    themeMock.onSetTheme = null;
    Reflect.deleteProperty(document, 'startViewTransition');
    document.querySelector('[data-hero-chart]')?.remove();
    vi.unstubAllGlobals();
  });

  it('holds the light chart at the captured position until the view transition finishes', async () => {
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    const chart = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    chart.dataset.heroChart = '';
    chart.pauseAnimations = vi.fn();
    chart.unpauseAnimations = vi.fn();
    chart.setCurrentTime = vi.fn();
    themeMock.onSetTheme = () => document.body.append(chart);

    let finishTransition: (() => void) | undefined;
    const finished = new Promise<void>((resolve) => {
      finishTransition = resolve;
    });
    let pausedBeforeCapture = false;
    Object.defineProperty(document, 'startViewTransition', {
      configurable: true,
      value: (update: () => void) => {
        update();
        pausedBeforeCapture =
          vi.mocked(chart.setCurrentTime).mock.calls.length > 0 &&
          vi.mocked(chart.pauseAnimations).mock.calls.length > 0;
        return { ready: new Promise(() => {}), finished };
      },
    });

    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole('button'));
    expect(pausedBeforeCapture).toBe(true);
    expect(chart.unpauseAnimations).not.toHaveBeenCalled();

    await act(async () => finishTransition?.());
    expect(chart.unpauseAnimations).toHaveBeenCalledOnce();
  });
});
