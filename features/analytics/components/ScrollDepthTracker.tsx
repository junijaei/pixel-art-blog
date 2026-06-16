'use client';

import { sendGAEvent } from '@next/third-parties/google';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/** Scroll percentages (0-100) that trigger a GA4 event. Each fires at most once per page. */
const THRESHOLDS = [50, 90] as const;
type ScrollThreshold = (typeof THRESHOLDS)[number];

/**
 * Fires a GA4 `scroll_milestone` event when the user reaches 50% and 90%
 * scroll depth. Thresholds reset on every SPA navigation so each page
 * gets independent tracking.
 *
 * Uses invisible IntersectionObserver sentinels instead of a scroll listener,
 * so regular scrolling does not repeatedly read layout metrics.
 */
export function ScrollDepthTracker() {
  const pathname = usePathname();
  const firedRef = useRef<Set<number>>(new Set());
  const markerRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    firedRef.current.clear();

    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    const markers = markerRefs.current.filter((marker): marker is HTMLSpanElement => marker !== null);
    if (markers.length === 0) {
      return;
    }

    let animationFrameId: number | null = null;
    let observer: IntersectionObserver | null = null;

    const fireMilestone = (threshold: ScrollThreshold) => {
      if (firedRef.current.has(threshold)) return;

      firedRef.current.add(threshold);
      sendGAEvent('event', 'scroll_milestone', {
        milestone_percent: threshold,
        page_path: pathname,
      });
    };

    const fireAlreadyReachedMilestones = (scrollableHeight: number) => {
      if (scrollableHeight <= 0) return;

      const scrollPercent = (window.scrollY / scrollableHeight) * 100;

      THRESHOLDS.forEach((threshold, index) => {
        if (scrollPercent >= threshold) {
          fireMilestone(threshold);
          observer?.unobserve(markers[index]);
        }
      });
    };

    const updateMarkerPositions = () => {
      animationFrameId = null;

      for (const marker of markers) {
        marker.style.top = '0px';
        marker.style.height = '0px';
      }

      const documentHeight = Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight ?? 0);
      const viewportHeight = window.innerHeight;
      const scrollableHeight = Math.max(0, documentHeight - viewportHeight);

      if (scrollableHeight <= 0) {
        return;
      }

      THRESHOLDS.forEach((threshold, index) => {
        const marker = markers[index];
        if (!marker) return;

        const triggerTop = viewportHeight + (scrollableHeight * threshold) / 100;
        marker.style.top = `${triggerTop}px`;
        marker.style.height = `${Math.max(1, documentHeight - triggerTop)}px`;
      });

      fireAlreadyReachedMilestones(scrollableHeight);
    };

    const scheduleMarkerUpdate = () => {
      if (animationFrameId !== null) return;
      animationFrameId = window.requestAnimationFrame(updateMarkerPositions);
    };

    const currentObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;

        const threshold = Number((entry.target as HTMLElement).dataset.scrollDepthThreshold) as ScrollThreshold;
        if (!THRESHOLDS.includes(threshold)) continue;

        fireMilestone(threshold);
        currentObserver.unobserve(entry.target);
      }
    });
    observer = currentObserver;

    markers.forEach((marker) => currentObserver.observe(marker));
    updateMarkerPositions();

    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(scheduleMarkerUpdate);
    resizeObserver?.observe(document.documentElement);
    if (document.body) {
      resizeObserver?.observe(document.body);
    }

    window.addEventListener('resize', scheduleMarkerUpdate, { passive: true });

    return () => {
      currentObserver.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener('resize', scheduleMarkerUpdate);
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [pathname]);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute top-0 left-0 h-0 w-0">
      {THRESHOLDS.map((threshold, index) => (
        <span
          key={threshold}
          ref={(element) => {
            markerRefs.current[index] = element;
          }}
          data-scroll-depth-threshold={threshold}
          className="pointer-events-none absolute left-0 w-px opacity-0"
        />
      ))}
    </div>
  );
}
