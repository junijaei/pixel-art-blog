'use client';

import { useTheme } from 'next-themes';
import { useEffect, useId, useRef, useState } from 'react';

interface MermaidDiagramProps {
  code: string;
}

export function MermaidDiagram({ code }: MermaidDiagramProps) {
  const { resolvedTheme } = useTheme();
  const id = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const container = wrapperRef.current;
    if (!container || shouldRender) return;

    if (!('IntersectionObserver' in window)) {
      setShouldRender(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;

        setShouldRender(true);
        observer.disconnect();
      },
      { rootMargin: '400px 0px' }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [shouldRender]);

  useEffect(() => {
    if (!shouldRender) return;

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

        // Remove ':' from useId() before using it as a Mermaid DOM id.
        const safeId = `mermaid-${id.replace(/:/g, '')}`;
        const { svg } = await mermaid.render(safeId, code);

        if (isMounted && svgRef.current) {
          svgRef.current.innerHTML = svg;
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Render failed');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    render();

    return () => {
      isMounted = false;
    };
  }, [code, resolvedTheme, id, shouldRender]);

  if (error) {
    return (
      <div className="border-border bg-muted/30 rounded-xl border p-4">
        <p className="text-muted-foreground text-sm">Mermaid render failed: {error}</p>
        <pre className="text-foreground/70 font-code mt-2 text-xs">{code}</pre>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="border-border bg-muted/10 overflow-x-auto rounded-xl border p-6">
      {(!shouldRender || isLoading) && (
        <div className="text-muted-foreground flex h-24 items-center justify-center text-sm">Rendering...</div>
      )}
      <div ref={svgRef} className={isLoading ? 'hidden' : 'font-code flex justify-center'} />
    </div>
  );
}
