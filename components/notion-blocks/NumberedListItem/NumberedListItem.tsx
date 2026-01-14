import React from 'react';
import { renderRichText } from '@/lib/notion/rich-text-renderer';
import type { NumberedListItemProps } from './types';

/**
 * Notion NumberedListItem 블록을 렌더링하는 컴포넌트
 * 픽셀 폰트를 사용한 번호 표시와 함께 렌더링
 */
export function NumberedListItem({ block, children, index = 0 }: NumberedListItemProps) {
  const { rich_text, color } = block.numbered_list_item;

  const colorClass = color && color !== 'default' ? getColorClass(color) : '';

  return (
    <li className={`flex items-start gap-3 mb-2 ${colorClass}`.trim()}>
      <span className="text-muted-foreground mt-1 w-4 font-(family-name:--font-silkscreen) text-[10px]">
        {index + 1}
      </span>
      <span className="leading-relaxed flex-1">
        {renderRichText(rich_text)}
        {children && <ol className="mt-2 space-y-2">{children}</ol>}
      </span>
    </li>
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
