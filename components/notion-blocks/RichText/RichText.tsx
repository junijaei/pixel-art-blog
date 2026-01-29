import { Mention } from '@/components/notion-blocks/Mention';
import { getNotionColorClass } from '@/lib/notion/shared';
import type { RichText, RichTextMention, RichTextText } from '@/types/notion';
import { cn } from '@/utils/utils';
import { Fragment, ReactNode } from 'react';

/**
 * RichText에서 표시할 콘텐츠를 추출합니다.
 * 멘션 타입은 null을 반환하여 별도 컴포넌트로 처리됩니다.
 */
function getContent(richText: RichText): string | null {
  switch (richText.type) {
    case 'text':
      return (richText as RichTextText).text.content;
    case 'equation':
      return richText.equation.expression;
    case 'mention':
      return null; // Mention 컴포넌트에서 처리
  }
}

/**
 * Notion RichText 배열을 React 요소로 렌더링하는 헬퍼 함수
 *
 * @param richTextArray - Notion API에서 반환된 RichText 배열
 * @returns 렌더링된 React 요소 배열
 */
export function RichText({ richTextArray }: { richTextArray: RichText[] }) {
  if (!richTextArray || richTextArray.length === 0) {
    return null;
  }

  return richTextArray.map((richText, index) => {
    const { annotations, href } = richText;

    // 멘션 타입은 별도 컴포넌트로 렌더링
    if (richText.type === 'mention') {
      return <Mention key={index} richText={richText as RichTextMention} />;
    }

    let element: ReactNode = getContent(richText);

    // annotations 적용 (중첩 순서: bold → italic → strikethrough → underline → code)
    if (annotations.code) {
      element = (
        <code
          key={index}
          className="bg-muted rounded px-1.5 py-0.5 font-mono text-[0.85em] whitespace-nowrap text-red-600"
        >
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

    // 링크 처리 (text 타입만 link 속성을 가짐)
    const textLink = richText.type === 'text' ? (richText as RichTextText).text.link : null;
    if (href || textLink) {
      const url = href || textLink?.url;
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

    // color 처리 (텍스트 색상과 배경 색상 모두 지원)
    if (annotations.color && annotations.color !== 'default') {
      const colorClass = getNotionColorClass(annotations.color);

      if (colorClass) {
        element = (
          <span key={index} className={cn('rounded', colorClass)}>
            {element}
          </span>
        );
      }
    }

    return <Fragment key={index}>{element}</Fragment>;
  });
}
