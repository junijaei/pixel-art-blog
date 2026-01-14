import React from 'react';
import { renderRichText } from '@/lib/notion/rich-text-renderer';
import type { HeadingProps } from './types';

/**
 * Notion Heading 블록을 렌더링하는 컴포넌트
 * heading_1, heading_2, heading_3를 지원
 *
 * @param block - Notion API에서 반환된 Heading 블록 데이터
 */
export function Heading({ block }: HeadingProps) {
  const type = block.type;

  // 블록 타입에 따라 콘텐츠 추출
  const content = block[type];
  const { rich_text, color } = content;

  // 블록 레벨 색상 적용
  const colorClass = color && color !== 'default' ? getColorClass(color) : '';

  // 공통 스타일
  const baseClass = 'font-bold mb-4 mt-8';

  // 헤딩 레벨에 따른 스타일
  const headingClasses = {
    heading_1: 'text-4xl',
    heading_2: 'text-3xl',
    heading_3: 'text-2xl',
  };

  const className = `${baseClass} ${headingClasses[type]} ${colorClass}`.trim();
  const renderedText = renderRichText(rich_text);

  // 타입에 따라 적절한 헤딩 태그 렌더링
  switch (type) {
    case 'heading_1':
      return <h1 className={className}>{renderedText}</h1>;
    case 'heading_2':
      return <h2 className={className}>{renderedText}</h2>;
    case 'heading_3':
      return <h3 className={className}>{renderedText}</h3>;
    default:
      return null;
  }
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
