'use client';

import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';

const GiscusWidget = dynamic(() => import('@giscus/react'), {
  ssr: false,
});

export function GiscusComments() {
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  // Avoid theme hydration mismatch before the client is mounted.
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || shouldLoad) return;

    const container = containerRef.current;
    if (!container) return;

    if (!('IntersectionObserver' in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;

        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: '600px 0px' }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [mounted, shouldLoad]);

  const giscusTheme = resolvedTheme === 'dark' ? 'transparent_dark' : 'noborder_light';

  return (
    <div ref={containerRef} className="min-h-px">
      {mounted && shouldLoad && (
        <GiscusWidget
          repo="junijaei/pixel-art-blog"
          repoId="R_kgDOQ419Nw"
          category="Announcements"
          categoryId="DIC_kwDOQ419N84C4EOj"
          mapping="pathname"
          strict="0"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme={giscusTheme}
          lang="ko"
        />
      )}
    </div>
  );
}
