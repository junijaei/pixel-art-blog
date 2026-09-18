'use client';

import ErrorLayout from '@/shared/layouts/error-layout';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[Error Page]', error);
  }, [error]);

  return <ErrorLayout onRetry={reset} />;
}
