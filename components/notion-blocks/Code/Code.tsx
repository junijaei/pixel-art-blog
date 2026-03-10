'use client';

import type { CodeBlock, CodeProps } from '@/components/notion-blocks/Code/index';
import { MermaidDiagram } from '@/components/notion-blocks/Code/MermaidDiagram';
import { highlightCode } from '@/lib/notion/shared';
import { cn } from '@/utils/utils';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { RichText } from '../RichText';

const COLLAPSE_LINE_THRESHOLD = 50;
const COLLAPSED_MAX_HEIGHT = 300; // px

export function Code({ block }: CodeProps) {
  const { rich_text, language, caption } = block.code as CodeBlock['code'];
  const codeText = rich_text.map((item) => item.plain_text).join('');
  const [isCopied, setIsCopied] = useState(false);
  const [highlightedHtml, setHighlightedHtml] = useState<string>('');
  const { theme } = useTheme();

  // 줄 수 계산
  const lineCount = codeText.split('\n').length;
  const shouldCollapse = lineCount > COLLAPSE_LINE_THRESHOLD;
  const [isExpanded, setIsExpanded] = useState(!shouldCollapse);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function highlight() {
      const isDark = theme === 'dark';
      const html = await highlightCode(codeText, language, isDark);
      if (isMounted) {
        setHighlightedHtml(html);
      }
    }

    highlight();

    return () => {
      isMounted = false;
    };
  }, [codeText, language, theme]);

  // mermaid 다이어그램 분기 처리
  if (language === 'mermaid') {
    return (
      <div className="my-6">
        <MermaidDiagram code={codeText} />
        {caption && caption.length > 0 && (
          <div className="text-muted-foreground mt-2 text-center text-sm">
            <RichText richTextArray={caption} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="my-6">
      <div className="border-border bg-muted/30 overflow-hidden rounded-xl border">
        {/* Header */}
        <div className="border-border bg-muted/50 flex items-center justify-between border-b px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground font-code text-xs tracking-wider">{language}</span>
            {shouldCollapse && <span className="text-muted-foreground/60 text-xs">({lineCount} lines)</span>}
          </div>
          <div className="flex items-center gap-2">
            {shouldCollapse && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md px-2 py-1 text-xs transition-colors"
                aria-expanded={isExpanded}
                aria-label={isExpanded ? '코드 접기' : '코드 펼치기'}
              >
                {isExpanded ? 'Collapse' : 'Expand'}
              </button>
            )}
            <button
              onClick={copyToClipboard}
              className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md px-2 py-1 text-xs transition-colors"
              aria-label={isCopied ? '코드 복사됨' : '코드 복사하기'}
            >
              {isCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Code content with collapse animation */}
        <div
          className={cn('relative transition-all duration-300 ease-in-out', !isExpanded && 'overflow-hidden')}
          style={{
            maxHeight: isExpanded ? 'none' : `${COLLAPSED_MAX_HEIGHT}px`,
          }}
        >
          {highlightedHtml ? (
            <div
              className="shiki-code-block [&_code]:font-code [&_code]:text-sm [&_code]:leading-relaxed [&_pre]:m-0 [&_pre]:overflow-x-auto [&_pre]:bg-transparent! [&_pre]:p-4"
              dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            />
          ) : (
            <pre className="flex-1 overflow-x-auto p-4">
              <code className="font-code text-sm leading-relaxed">{codeText}</code>
            </pre>
          )}

          {/* Gradient overlay when collapsed */}
          {shouldCollapse && !isExpanded && (
            <div className="from-muted/0 via-muted/80 to-muted pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-b" />
          )}
        </div>

        {/* Expand button at bottom when collapsed */}
        {shouldCollapse && !isExpanded && (
          <div className="border-border bg-muted/50 border-t px-4 py-2">
            <button
              onClick={() => setIsExpanded(true)}
              className="text-muted-foreground hover:text-foreground w-full cursor-pointer text-center text-xs transition-colors"
              aria-label="코드 펼치기"
            >
              Show all {lineCount} lines
            </button>
          </div>
        )}
      </div>

      {caption && caption.length > 0 && (
        <div className="text-muted-foreground mt-2 text-center text-sm">
          <RichText richTextArray={caption} />
        </div>
      )}
    </div>
  );
}
