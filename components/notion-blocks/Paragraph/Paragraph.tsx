import React from 'react';
import { renderRichText } from '@/lib/notion/rich-text-renderer';
import { getColorClass } from '@/lib/notion/color-utils';
import type { ParagraphProps } from './index';

/**
 * Notion Paragraph 블록을 렌더링하는 컴포넌트
 *
 * @param block - Notion API에서 반환된 Paragraph 블록 데이터
 */
export function Paragraph({ block }: ParagraphProps) {
  const { rich_text, color } = block.paragraph;
  const colorClass = getColorClass(color);

  return (
    <p className={`leading-relaxed mb-4 ${colorClass}`.trim()}>
      {renderRichText(rich_text)}
    </p>
  );
}
