'use client';

import { useTheme } from 'next-themes';
import { useEffect, useId, useRef, useState } from 'react';

interface MermaidDiagramProps {
  code: string;
}

export function MermaidDiagram({ code }: MermaidDiagramProps) {
  const { resolvedTheme } = useTheme();
  const id = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function render() {
      try {
        setIsLoading(true);
        const mermaid = (await import('mermaid')).default;

        mermaid.initialize({
          startOnLoad: false,
          theme: resolvedTheme === 'dark' ? 'dark' : 'neutral',
          securityLevel: 'loose',
          fontFamily: 'var(--font-code)',
          themeVariables: {
            fontFamily: 'var(--font-code)',
          },
        });

        // useId()는 ':' 문자를 포함하므로 제거
        const safeId = `mermaid-${id.replace(/:/g, '')}`;
        const { svg } = await mermaid.render(safeId, code);

        if (isMounted && containerRef.current) {
          containerRef.current.innerHTML = svg;
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : '렌더링 실패');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    render();

    return () => {
      isMounted = false;
    };
  }, [code, resolvedTheme, id]);

  if (error) {
    return (
      <div className="border-border bg-muted/30 rounded-xl border p-4">
        <p className="text-muted-foreground text-sm">Mermaid 렌더링 실패: {error}</p>
        <pre className="text-foreground/70 font-code mt-2 text-xs">{code}</pre>
      </div>
    );
  }

  return (
    <div className="border-border bg-muted/10 overflow-x-auto rounded-xl border p-6">
      {isLoading && (
        <div className="text-muted-foreground flex h-24 items-center justify-center text-sm">렌더링 중...</div>
      )}
      <div ref={containerRef} className={isLoading ? 'hidden' : 'font-code flex justify-center'} />
    </div>
  );
}
