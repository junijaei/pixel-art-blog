'use client';

import ErrorLayout from '@/components/layouts/error-layout';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[Error Page]', error);
  }, [error]);

  return <ErrorLayout />;
}
