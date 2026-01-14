import React from 'react';
import { renderRichText } from '@/lib/notion/rich-text-renderer';
import type { ParagraphProps } from './types';

/**
 * Notion Paragraph 블록을 렌더링하는 컴포넌트
 *
 * @param block - Notion API에서 반환된 Paragraph 블록 데이터
 */
export function Paragraph({ block }: ParagraphProps) {
  const { rich_text, color } = block.paragraph;

  // 블록 레벨 색상 적용
  const colorClass = color && color !== 'default' ? getColorClass(color) : '';

  return (
    <p className={`leading-relaxed mb-4 ${colorClass}`.trim()}>
      {renderRichText(rich_text)}
    </p>
  );
}

/**
 * Notion color를 Tailwind CSS 클래스로 변환
 */
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
