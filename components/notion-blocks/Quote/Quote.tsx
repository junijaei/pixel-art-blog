import React from 'react';
import { renderRichText } from '@/lib/notion/rich-text-renderer';
import type { QuoteProps } from './types';

/**
 * Notion Quote 블록을 렌더링하는 컴포넌트
 */
export function Quote({ block }: QuoteProps) {
  const { rich_text, color } = block.quote;

  const colorClass = color && color !== 'default' ? getColorClass(color) : '';

  return (
    <blockquote
      className={`border-l-4 border-muted-foreground/30 pl-4 py-2 my-4 italic ${colorClass}`.trim()}
    >
      {renderRichText(rich_text)}
    </blockquote>
  );
}

function getColorClass(color: string): string {
  const colorMap: Record<string, string> = {
    gray: 'text-gray-600 dark:text-gray-400',
    brown: 'text-amber-700 dark:text-amber-400',
    orange: 'text-orange-600 dark:text-orange-400',
    yellow: 'text-yellow-600 dark:text-yellow-400',
    green: 'text-green-600 dark:text-green-400',
    blue: 'text-blue-600 dark:text-blue-400',
    purple: 'text-purple-600 dark:text-purple-400',
    pink: 'text-pink-600 dark:text-pink-400',
    red: 'text-red-600 dark:text-red-400',
  };

  return colorMap[color] || '';
}
