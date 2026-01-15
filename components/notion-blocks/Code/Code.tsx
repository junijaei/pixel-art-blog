'use client';

import { renderRichText } from '@/lib/notion/rich-text-renderer';
import { highlightCode } from '@/lib/notion/shiki-highlighter';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import type { CodeBlock, CodeProps } from './index';

export function Code({ block }: CodeProps) {
  const { rich_text, language, caption } = block.code as CodeBlock['code'];
  const codeText = rich_text.map((item) => item.plain_text).join('');
  const [isCopied, setIsCopied] = useState(false);
  const [highlightedHtml, setHighlightedHtml] = useState<string>('');
  const { theme } = useTheme();

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

  return (
    <div className="my-6">
      <div className="border-border bg-muted/30 overflow-hidden rounded-xl border">
        <div className="border-border bg-muted/50 flex items-center justify-between border-b px-4 py-2">
          <span className="text-muted-foreground font-(family-name:--font-geist-mono) text-xs tracking-wider">
            {language}
          </span>
          <button
            onClick={copyToClipboard}
            className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md px-2 py-1 text-xs transition-colors"
            aria-label={isCopied ? 'Copied!' : 'Copy code'}
          >
            {isCopied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        {highlightedHtml ? (
          <div
            className="shiki-code-block [&_code]:font-(family-name:--font-geist-mono) [&_code]:text-sm [&_code]:leading-relaxed [&_pre]:m-0 [&_pre]:overflow-x-auto [&_pre]:!bg-transparent [&_pre]:p-4"
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        ) : (
          <pre className="flex-1 overflow-x-auto p-4">
            <code className="font-(family-name:--font-geist-mono) text-sm leading-relaxed">{codeText}</code>
          </pre>
        )}
      </div>

      {caption && caption.length > 0 && (
        <div className="text-muted-foreground mt-2 text-center text-sm">{renderRichText(caption)}</div>
      )}
    </div>
  );
}
