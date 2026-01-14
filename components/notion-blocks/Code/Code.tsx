'use client';

import React from 'react';
import { renderRichText } from '@/lib/notion/rich-text-renderer';
import type { CodeProps } from './types';

export function Code({ richText, language = 'plain text', caption }: CodeProps) {
  const codeText = richText.map((item) => item.plain_text).join('');
  const [isCopied, setIsCopied] = React.useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="my-6">
      <div className="rounded-xl border border-border bg-muted/30 overflow-hidden">
        {/* Header with language and copy button */}
        <div className="px-4 py-2 border-b border-border bg-muted/50 flex items-center justify-between">
          <span className="text-xs font-(family-name:--font-geist-mono) text-muted-foreground tracking-wider">
            {language}
          </span>
          <button
            onClick={copyToClipboard}
            className="px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50"
            aria-label={isCopied ? 'Copied!' : 'Copy code'}
          >
            {isCopied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        {/* Code content with line numbers */}
        <div className="flex">
          {/* Line numbers */}
          <div className="px-4 py-4 border-r border-border bg-muted/50 select-none">
            <pre className="text-sm font-(family-name:--font-geist-mono) text-muted-foreground/60 text-right leading-relaxed">
              {codeText.split('\n').map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </pre>
          </div>

          {/* Code content */}
          <pre className="p-4 overflow-x-auto flex-1">
            <code className="text-sm font-(family-name:--font-geist-mono) leading-relaxed">
              {codeText}
            </code>
          </pre>
        </div>
      </div>

      {/* Caption */}
      {caption && caption.length > 0 && (
        <div className="mt-2 text-sm text-muted-foreground text-center">
          {renderRichText(caption)}
        </div>
      )}
    </div>
  );
}
