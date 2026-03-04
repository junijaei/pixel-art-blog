'use client';

import { sendGAEvent } from '@next/third-parties/google';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/** Scroll percentages (0-100) that trigger a GA4 event. Each fires at most once per page. */
const THRESHOLDS = [50, 90] as const;

/**
 * Fires a GA4 `scroll_milestone` event when the user reaches 50% and 90%
 * scroll depth. Thresholds reset on every SPA navigation so each page
 * gets independent tracking.
 *
 * Rendered as a null component — no DOM output.
 */
export function ScrollDepthTracker() {
  const pathname = usePathname();
  const firedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    // Reset per-page thresholds and re-attach listener on navigation.
    firedRef.current.clear();

    function handleScroll() {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0) return;

      const scrollPercent = (window.scrollY / scrollableHeight) * 100;

      for (const threshold of THRESHOLDS) {
        if (scrollPercent >= threshold && !firedRef.current.has(threshold)) {
          firedRef.current.add(threshold);
          sendGAEvent('event', 'scroll_milestone', {
            milestone_percent: threshold,
            page_path: pathname,
          });
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  return null;
}
