import { ScrollDepthTracker } from '@/features/analytics/components/ScrollDepthTracker';
import { sendGAEvent } from '@next/third-parties/google';
import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@next/third-parties/google', () => ({
  sendGAEvent: vi.fn(),
}));

let pathname = '/posts/example';

vi.mock('next/navigation', () => ({
  usePathname: () => pathname,
}));

type ObserverEntry = Pick<IntersectionObserverEntry, 'isIntersecting' | 'target'>;

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];

  readonly observe = vi.fn();
  readonly unobserve = vi.fn();
  readonly disconnect = vi.fn();

  constructor(private readonly callback: IntersectionObserverCallback) {
    MockIntersectionObserver.instances.push(this);
  }

  trigger(target: Element, isIntersecting = true) {
    this.callback(
      [{ isIntersecting, target } as ObserverEntry as IntersectionObserverEntry],
      this as unknown as IntersectionObserver
    );
  }
}

class MockResizeObserver {
  static instances: MockResizeObserver[] = [];

  readonly observe = vi.fn();
  readonly disconnect = vi.fn();

  constructor(private readonly callback: ResizeObserverCallback) {
    MockResizeObserver.instances.push(this);
  }

  trigger() {
    this.callback([], this as unknown as ResizeObserver);
  }
}

function setReadonlyNumber(target: object, property: string, value: number) {
  Object.defineProperty(target, property, {
    configurable: true,
    value,
  });
}

describe('ScrollDepthTracker', () => {
  beforeEach(() => {
    pathname = '/posts/example';
    vi.clearAllMocks();
    MockIntersectionObserver.instances = [];
    MockResizeObserver.instances = [];

    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
    vi.stubGlobal('ResizeObserver', MockResizeObserver);
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      callback(0);
      return 1;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => undefined);

    setReadonlyNumber(window, 'innerHeight', 1000);
    setReadonlyNumber(window, 'scrollY', 0);
    setReadonlyNumber(document.documentElement, 'scrollHeight', 3000);
    setReadonlyNumber(document.body, 'scrollHeight', 3000);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('uses IntersectionObserver sentinels instead of a scroll listener', () => {
    const addEventListener = vi.spyOn(window, 'addEventListener');
    const { container } = render(<ScrollDepthTracker />);
    const markers = container.querySelectorAll('[data-scroll-depth-threshold]');

    expect(markers).toHaveLength(2);
    expect(MockIntersectionObserver.instances).toHaveLength(1);
    expect(MockIntersectionObserver.instances[0].observe).toHaveBeenCalledTimes(2);
    expect(addEventListener).not.toHaveBeenCalledWith('scroll', expect.any(Function), expect.anything());
  });

  it('fires each milestone once when its sentinel intersects', () => {
    const { container } = render(<ScrollDepthTracker />);
    const marker = container.querySelector('[data-scroll-depth-threshold="50"]')!;
    const observer = MockIntersectionObserver.instances[0];

    observer.trigger(marker);
    observer.trigger(marker);

    expect(sendGAEvent).toHaveBeenCalledTimes(1);
    expect(sendGAEvent).toHaveBeenCalledWith('event', 'scroll_milestone', {
      milestone_percent: 50,
      page_path: '/posts/example',
    });
    expect(observer.unobserve).toHaveBeenCalledWith(marker);
  });

  it('fires already reached milestones on initial mount without waiting for scroll events', () => {
    setReadonlyNumber(window, 'scrollY', 1900);

    render(<ScrollDepthTracker />);

    expect(sendGAEvent).toHaveBeenCalledTimes(2);
    expect(sendGAEvent).toHaveBeenNthCalledWith(1, 'event', 'scroll_milestone', {
      milestone_percent: 50,
      page_path: '/posts/example',
    });
    expect(sendGAEvent).toHaveBeenNthCalledWith(2, 'event', 'scroll_milestone', {
      milestone_percent: 90,
      page_path: '/posts/example',
    });
  });

  it('resets fired milestones after SPA navigation', () => {
    const { container, rerender } = render(<ScrollDepthTracker />);
    const firstMarker = container.querySelector('[data-scroll-depth-threshold="50"]')!;

    MockIntersectionObserver.instances[0].trigger(firstMarker);
    pathname = '/posts/next';
    rerender(<ScrollDepthTracker />);

    const nextMarker = container.querySelector('[data-scroll-depth-threshold="50"]')!;
    MockIntersectionObserver.instances[1].trigger(nextMarker);

    expect(sendGAEvent).toHaveBeenCalledTimes(2);
    expect(sendGAEvent).toHaveBeenNthCalledWith(2, 'event', 'scroll_milestone', {
      milestone_percent: 50,
      page_path: '/posts/next',
    });
  });
});
