import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createHeroAnimation } from '@/app/(home)/_components/hero/hero-animation';

describe('hero animation scheduling', () => {
  let callbacks: Map<number, FrameRequestCallback>;
  let nextId: number;
  const tick = (time: number) => {
    const pending = [...callbacks.values()];
    callbacks.clear();
    pending.forEach((callback) => callback(time));
  };

  beforeEach(() => {
    callbacks = new Map();
    nextId = 0;
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callbacks.set(++nextId, callback);
      return nextId;
    });
    vi.stubGlobal('cancelAnimationFrame', (id: number) => callbacks.delete(id));
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(false);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('stops rendering outside the viewport and resumes without jumping ahead', () => {
    const draw = vi.fn();
    const animation = createHeroAnimation(draw, false);
    tick(0);
    tick(40);
    const previousTime = draw.mock.lastCall![0];
    animation.setVisible(false);
    const draws = draw.mock.calls.length;
    tick(5000);
    expect(draw).toHaveBeenCalledTimes(draws);
    expect(callbacks.size).toBe(0);
    animation.setVisible(true);
    tick(10000);
    expect(draw.mock.lastCall![0]).toBe(previousTime);
    animation.dispose();
  });

  it('draws reduced motion once, updates on demand, and leaves no running frame loop', () => {
    const draw = vi.fn();
    const animation = createHeroAnimation(draw, true);
    tick(0);
    expect(draw).toHaveBeenCalledWith(0);
    expect(callbacks.size).toBe(0);
    animation.invalidate();
    tick(100);
    expect(draw).toHaveBeenCalledTimes(2);
    expect(callbacks.size).toBe(0);
    animation.setReducedMotion(false);
    tick(200);
    expect(callbacks.size).toBe(1);
    animation.dispose();
  });

  it('cancels scheduled work in a hidden tab and removes the listener on disposal', () => {
    const animation = createHeroAnimation(vi.fn(), false);
    tick(0);
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
    document.dispatchEvent(new Event('visibilitychange'));
    expect(callbacks.size).toBe(0);
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(false);
    document.dispatchEvent(new Event('visibilitychange'));
    expect(callbacks.size).toBe(1);
    animation.dispose();
    document.dispatchEvent(new Event('visibilitychange'));
    expect(callbacks.size).toBe(0);
  });

  it('limits draws on high refresh rate displays', () => {
    const draw = vi.fn();
    const animation = createHeroAnimation(draw, false);
    for (let time = 0; time <= 1000; time += 5) tick(time);
    expect(draw.mock.calls.length).toBeGreaterThanOrEqual(28);
    expect(draw.mock.calls.length).toBeLessThanOrEqual(31);
    animation.dispose();
  });
});
