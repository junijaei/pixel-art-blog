'use client';

import GiscusWidget from '@giscus/react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function GiscusComments() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 클라이언트 마운트 전엔 렌더링 생략 (테마 hydration mismatch 방지)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const giscusTheme = resolvedTheme === 'dark' ? 'transparent_dark' : 'noborder_light';

  return (
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
  );
}
