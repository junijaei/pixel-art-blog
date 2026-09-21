'use client';

import type { CodeBlock, CodeProps } from '@/features/post/components/blocks/Code/index';
import { MermaidDiagram } from '@/features/post/components/blocks/Code/MermaidDiagram';
import { highlightCode } from '@/features/post/highlight';
import { cn } from '@/shared/lib/utils';
import { useMemo, useState } from 'react';
import { ChildBlockContainer } from '../ChildBlockContainer';
import { RichText } from '../RichText';

const COLLAPSE_LINE_THRESHOLD = 50;
const COLLAPSED_MAX_HEIGHT = 300; // px

export function Code({ block, children }: CodeProps) {
  const { rich_text, language, caption } = block.code as CodeBlock['code'];
  const codeText = rich_text.map((item) => item.plain_text).join('');
  const [isCopied, setIsCopied] = useState(false);

  // 색상은 CSS 변수라 테마와 무관하다. 테마 변경으로 재계산하지 말 것.
  const highlightedHtml = useMemo(() => highlightCode(codeText, language), [codeText, language]);

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

  if (language === 'mermaid') {
    return (
      <>
        <div className="my-6">
          <MermaidDiagram code={codeText} />
          {caption && caption.length > 0 && (
            <div className="text-muted-foreground mt-2 text-center text-sm">
              <RichText richTextArray={caption} />
            </div>
          )}
        </div>
        {children && <ChildBlockContainer>{children}</ChildBlockContainer>}
      </>
    );
  }

  return (
    <>
      <div className="my-6">
        <div className="border-border bg-muted/30 overflow-hidden rounded-xl border">
          <div className="border-border bg-muted/50 flex items-center justify-between border-b px-4 py-2">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground font-code text-xs tracking-wider">{language}</span>
              {shouldCollapse && <span className="text-muted-foreground/60 text-xs">({lineCount} lines)</span>}
            </div>
            <div className="flex items-center gap-2">
              {shouldCollapse && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted/50 focus-visible:ring-ring rounded-md px-2 py-1 text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none active:translate-y-px"
                  aria-expanded={isExpanded}
                  aria-label={isExpanded ? 'Collapse code' : 'Expand code'}
                >
                  {isExpanded ? 'Collapse' : 'Expand'}
                </button>
              )}
              <button
                onClick={copyToClipboard}
                className="text-muted-foreground hover:text-foreground hover:bg-muted/50 focus-visible:ring-ring rounded-md px-2 py-1 text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none active:translate-y-px"
                aria-label={isCopied ? 'Code copied' : 'Copy code'}
              >
                {isCopied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div
            className={cn('relative transition-[max-height] duration-200 ease-out', !isExpanded && 'overflow-hidden')}
            style={{
              maxHeight: isExpanded ? 'none' : `${COLLAPSED_MAX_HEIGHT}px`,
            }}
          >
            <div
              className="code-block [&_code]:font-code [&_code]:text-sm [&_code]:leading-relaxed [&_pre]:m-0 [&_pre]:overflow-x-auto [&_pre]:bg-transparent! [&_pre]:p-4"
              dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            />

            {shouldCollapse && !isExpanded && (
              <div className="from-muted/0 via-muted/80 to-muted pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-b" />
            )}
          </div>

          {shouldCollapse && !isExpanded && (
            <div className="border-border bg-muted/50 border-t px-4 py-2">
              <button
                onClick={() => setIsExpanded(true)}
                className="text-muted-foreground hover:text-foreground w-full cursor-pointer text-center text-xs transition-colors"
                aria-label="Expand code"
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
      {children && <ChildBlockContainer>{children}</ChildBlockContainer>}
    </>
  );
}
