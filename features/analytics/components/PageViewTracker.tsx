'use client';

import { usePageView } from '@/features/analytics/hooks/use-page-view';

/** Tracks page views on every SPA navigation. Renders no DOM output. */
export function PageViewTracker() {
  usePageView();
  return null;
}
