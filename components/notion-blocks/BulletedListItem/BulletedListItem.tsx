import React from 'react';
import { renderRichText } from '@/lib/notion/rich-text-renderer';
import { PixelDot } from '@/components/pixel-icons';
import type { BulletedListItemProps } from './types';

/**
 * Notion BulletedListItem 블록을 렌더링하는 컴포넌트
 * 픽셀 도트를 사용한 불릿 표시와 함께 렌더링
 *
 * @param block - Notion API에서 반환된 BulletedListItem 블록 데이터
 * @param children - 중첩된 리스트 아이템 (재귀 렌더링)
 */
export function BulletedListItem({ block, children }: BulletedListItemProps) {
  const { rich_text, color } = block.bulleted_list_item;

  // 블록 레벨 색상 적용
  const colorClass = color && color !== 'default' ? getColorClass(color) : 'text-foreground/90';

  return (
    <li className={`flex items-start gap-3 mb-2 ${colorClass}`.trim()}>
      <PixelDot className="text-muted-foreground/60 mt-2 h-1.5 w-1.5 shrink-0" />
      <span className="leading-relaxed flex-1">
        {renderRichText(rich_text)}
        {/* 중첩된 리스트가 있을 경우 렌더링 */}
        {children && <ul className="mt-2 space-y-2">{children}</ul>}
      </span>
    </li>
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
