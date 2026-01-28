'use client';

import { useEffect } from 'react';

/**
 * Global Error Boundary
 * root layout 자체가 실패할 때 표시됩니다.
 * 외부 컴포넌트 의존 없이 자체 html/body를 포함합니다.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[Global Error]', error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '24px',
            textAlign: 'center',
          }}
        >
          {/* Pixel-style dots (inline for zero-dependency) */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '32px' }}>
            {[1, 0.6, 0.3, 0.6, 1].map((opacity, i) => (
              <div
                key={i}
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: `rgba(0, 0, 0, ${opacity})`,
                }}
              />
            ))}
          </div>

          <p
            style={{
              fontSize: '10px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#71717a',
              marginBottom: '16px',
            }}
          >
            CRITICAL ERROR
          </p>

          <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 16px' }}>알 수 없는 오류가 발생했습니다</h1>

          <p style={{ fontSize: '1.125rem', color: '#71717a', maxWidth: '28rem', margin: '0 0 40px', lineHeight: 1.6 }}>
            페이지를 표시할 수 없습니다. 잠시 후 다시 시도해 주세요.
          </p>

          <button
            onClick={reset}
            style={{
              backgroundColor: '#18181b',
              color: '#fafafa',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            다시 시도하기
          </button>
        </div>
      </body>
    </html>
  );
}
