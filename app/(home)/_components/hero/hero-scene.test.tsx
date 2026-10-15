import { act, cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { HeroBackground, HeroCore } from '@/app/(home)/_components/hero/hero-scene';
import { createHeroRenderer } from '@/app/(home)/_components/hero/hero-webgl';

vi.mock('@/app/(home)/_components/hero/hero-webgl', () => ({ createHeroRenderer: vi.fn() }));

describe('hero canvas lifecycle', () => {
  let frames: Map<number, FrameRequestCallback>;
  let resizeObservers: { observe: ReturnType<typeof vi.fn>; disconnect: ReturnType<typeof vi.fn> }[];
  let intersectionObservers: { observe: ReturnType<typeof vi.fn>; disconnect: ReturnType<typeof vi.fn> }[];
  let renderer: {
    resize: ReturnType<typeof vi.fn>;
    render: ReturnType<typeof vi.fn>;
    dispose: ReturnType<typeof vi.fn>;
  };

  const flushFrame = (time = 0) => {
    const callbacks = [...frames.values()];
    frames.clear();
    act(() => callbacks.forEach((callback) => callback(time)));
  };

  beforeEach(() => {
    frames = new Map();
    resizeObservers = [];
    intersectionObservers = [];
    renderer = { resize: vi.fn(), render: vi.fn(), dispose: vi.fn() };
    vi.mocked(createHeroRenderer).mockReturnValue(renderer);
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(false);
    let nextFrame = 0;
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((callback: FrameRequestCallback) => {
        frames.set(++nextFrame, callback);
        return nextFrame;
      })
    );
    vi.stubGlobal(
      'cancelAnimationFrame',
      vi.fn((id: number) => frames.delete(id))
    );
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe = vi.fn();
        disconnect = vi.fn();
        constructor() {
          resizeObservers.push(this);
        }
      }
    );
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        observe = vi.fn();
        disconnect = vi.fn();
        constructor() {
          intersectionObservers.push(this);
        }
      }
    );
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('initializes each layer once and draws after mount', () => {
    const { container } = render(
      <section>
        <HeroBackground theme="dark" reducedMotion={false} />
        <HeroCore theme="dark" reducedMotion={false} />
      </section>
    );
    const canvases = container.querySelectorAll('canvas');
    expect(createHeroRenderer).toHaveBeenNthCalledWith(1, canvases[0], 'background');
    expect(createHeroRenderer).toHaveBeenNthCalledWith(2, canvases[1], 'core');
    expect(renderer.resize).toHaveBeenCalledTimes(2);
    flushFrame();
    expect(renderer.render).toHaveBeenCalledWith(0, 'dark');
    expect(frames.size).toBe(2);
  });

  it('updates theme and reduced motion without rebuilding GPU resources', () => {
    const { rerender } = render(
      <section>
        <HeroBackground theme="dark" reducedMotion={false} />
      </section>
    );
    flushFrame();
    rerender(
      <section>
        <HeroBackground theme="light" reducedMotion />
      </section>
    );
    flushFrame(100);
    expect(createHeroRenderer).toHaveBeenCalledTimes(1);
    expect(renderer.dispose).not.toHaveBeenCalled();
    expect(renderer.render).toHaveBeenLastCalledWith(0, 'light');
    expect(frames.size).toBe(0);
  });

  it('disposes a lost context and restores a new renderer with current settings', () => {
    const { container, rerender } = render(
      <section>
        <HeroCore theme="dark" reducedMotion={false} />
      </section>
    );
    const canvas = container.querySelector('canvas')!;
    const lost = new Event('webglcontextlost', { cancelable: true });
    act(() => canvas.dispatchEvent(lost));
    expect(lost.defaultPrevented).toBe(true);
    expect(renderer.dispose).toHaveBeenCalledOnce();
    expect(frames.size).toBe(0);
    rerender(
      <section>
        <HeroCore theme="light" reducedMotion />
      </section>
    );
    const restored = { resize: vi.fn(), render: vi.fn(), dispose: vi.fn() };
    vi.mocked(createHeroRenderer).mockReturnValueOnce(restored);
    act(() => canvas.dispatchEvent(new Event('webglcontextrestored')));
    expect(createHeroRenderer).toHaveBeenCalledTimes(2);
    expect(restored.resize).toHaveBeenCalledOnce();
    flushFrame();
    expect(restored.render).toHaveBeenCalledWith(0, 'light');
    expect(frames.size).toBe(0);
  });

  it('releases observers, context listeners and the animation loop on unmount', () => {
    const { container, unmount } = render(
      <section>
        <HeroBackground theme="dark" reducedMotion={false} />
      </section>
    );
    const canvas = container.querySelector('canvas')!;
    flushFrame();
    expect(frames.size).toBe(1);
    unmount();
    expect(renderer.dispose).toHaveBeenCalledOnce();
    expect(resizeObservers[0].disconnect).toHaveBeenCalledOnce();
    expect(intersectionObservers[0].disconnect).toHaveBeenCalledOnce();
    expect(frames.size).toBe(0);
    act(() => {
      canvas.dispatchEvent(new Event('webglcontextrestored'));
      document.dispatchEvent(new Event('visibilitychange'));
    });
    expect(createHeroRenderer).toHaveBeenCalledTimes(1);
    expect(frames.size).toBe(0);
  });
});
