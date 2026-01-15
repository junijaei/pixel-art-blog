import type { RichText } from '@/types/notion';
import { Fragment, ReactNode } from 'react';

/**
 * Notion RichText 배열을 React 요소로 렌더링하는 헬퍼 함수
 *
 * @param richTextArray - Notion API에서 반환된 RichText 배열
 * @returns 렌더링된 React 요소 배열
 */
export function renderRichText(richTextArray: RichText[]): ReactNode {
  if (!richTextArray || richTextArray.length === 0) {
    return null;
  }

  return richTextArray.map((richText, index) => {
    const { text, annotations, href } = richText;
    let element: ReactNode = text.content;

    // annotations 적용 (중첩 순서: bold → italic → strikethrough → underline → code)
    if (annotations.code) {
      element = (
        <code key={index} className="bg-muted rounded px-1.5 py-0.5 font-mono text-sm">
          {element}
        </code>
      );
    }

    if (annotations.underline) {
      element = (
        <u key={index} className="underline">
          {element}
        </u>
      );
    }

    if (annotations.strikethrough) {
      element = (
        <s key={index} className="line-through">
          {element}
        </s>
      );
    }

    if (annotations.italic) {
      element = (
        <em key={index} className="italic">
          {element}
        </em>
      );
    }

    if (annotations.bold) {
      element = (
        <strong key={index} className="font-semibold">
          {element}
        </strong>
      );
    }

    // 링크 처리
    if (href || text.link) {
      const url = href || text.link?.url;
      element = (
        <a
          key={index}
          href={url || '#'}
          className="text-blue-600 hover:underline dark:text-blue-400"
          target="_blank"
          rel="noopener noreferrer"
        >
          {element}
        </a>
      );
    }

    // color 처리
    if (annotations.color && annotations.color !== 'default') {
      const colorClass = getColorClass(annotations.color);
      element = (
        <span key={index} className={colorClass}>
          {element}
        </span>
      );
    }

    return <Fragment key={index}>{element}</Fragment>;
  });
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
