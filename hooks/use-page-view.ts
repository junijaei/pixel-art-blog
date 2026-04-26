'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

const SESSION_KEY = 'pv:sid';

/**
 * Returns the persistent browser session ID stored in localStorage.
 * Creates a new UUID on first call; reuses it on subsequent visits.
 * Returns null in SSR context.
 */
function getSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  let sid = localStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

/**
 * Fires a POST /api/pageview request once per SPA navigation.
 * Dedup is enforced server-side (session + path + calendar day).
 * Errors are swallowed — analytics must never break the UX.
 */
export function usePageView(): void {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname === lastPath.current) return;
    lastPath.current = pathname;

    const sessionId = getSessionId();
    if (!sessionId) return;

    fetch('/api/pageview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname, sessionId }),
    }).catch(() => undefined);
  }, [pathname]);
}
