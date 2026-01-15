import React from 'react';
import { renderRichText } from '@/lib/notion/rich-text-renderer';
import { getColorClass } from '@/lib/notion/color-utils';
import type { QuoteProps } from './index';

/**
 * Notion Quote 블록을 렌더링하는 컴포넌트
 */
export function Quote({ block }: QuoteProps) {
  const { rich_text, color } = block.quote;
  const colorClass = getColorClass(color);

  return (
    <blockquote
      className={`border-l-4 border-muted-foreground/30 pl-4 py-2 my-4 italic ${colorClass}`.trim()}
    >
      {renderRichText(rich_text)}
    </blockquote>
  );
}
