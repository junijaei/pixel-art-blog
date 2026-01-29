'use client';

import { PixelLink } from '@/components/ui';
import type { LinkPreviewMention, RichTextMention } from '@/types/notion';
import { cn } from '@/utils/utils';
import Image from 'next/image';
import { useState } from 'react';

export interface MentionProps {
  richText: RichTextMention;
  className?: string;
}

/**
 * Notion 멘션을 렌더링하는 컴포넌트
 * 사용자, 페이지, 데이터베이스, 날짜, 링크 프리뷰 등 다양한 멘션 타입을 지원합니다.
 */
export function Mention({ richText, className }: MentionProps) {
  const { mention } = richText;

  // link_mention 타입은 별도 렌더링
  if (mention.type === 'link_mention') {
    return <LinkPreviewMention richText={richText} className={className} />;
  }

  const content = getMentionContent(richText);
  const icon = getMentionIcon(mention.type);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5',
        'bg-muted rounded px-1 py-0.5',
        'text-foreground/80 text-sm',
        className
      )}
    >
      {icon && <span className="text-muted-foreground">{icon}</span>}
      {content}
    </span>
  );
}

/**
 * 링크 프리뷰 멘션 컴포넌트
 * favicon + title 형태로 표시하며, 클릭 시 새 탭에서 링크를 엽니다.
 */
function LinkPreviewMention({ richText, className }: MentionProps) {
  // mention.type === 'link_mention'인 경우에만 호출되므로 타입 단언 안전
  const mention = richText.mention as LinkPreviewMention;
  const { href, icon_url, title } = mention.link_mention;
  const [faviconError, setFaviconError] = useState(false);

  return (
    <a
      href={href || '/'}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center gap-1.5',
        'bg-muted hover:bg-muted/80 rounded px-1.5 py-0.5',
        'text-foreground/80 hover:text-foreground text-sm',
        'transition-colors duration-200',
        'cursor-pointer no-underline',
        className
      )}
    >
      {/* Favicon */}
      {icon_url || faviconError ? (
        <Image
          src={icon_url || '/'}
          alt=""
          width={16}
          height={16}
          className="h-4 w-4 shrink-0 rounded-sm"
          onError={() => setFaviconError(true)}
          unoptimized
        />
      ) : (
        <PixelLink className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
      )}

      {/* Title */}
      <span className="max-w-[400px] truncate font-bold">{title || href}</span>
    </a>
  );
}

/**
 * 멘션 타입에서 표시할 콘텐츠를 추출합니다.
 */
function getMentionContent(richText: RichTextMention): string {
  const { mention, plain_text } = richText;

  switch (mention.type) {
    case 'user': {
      const name = mention.user.name || 'Unknown User';
      return `@${name}`;
    }
    case 'page':
      return plain_text || 'Untitled';
    case 'database':
      return plain_text || 'Untitled Database';
    case 'date': {
      const { start, end } = mention.date;
      return end ? `${start} → ${end}` : start;
    }
    default:
      return plain_text;
  }
}

/**
 * 멘션 타입에 따른 아이콘을 반환합니다.
 */
function getMentionIcon(type: string): string | null {
  switch (type) {
    case 'user':
      return null; // @ 기호가 이름 앞에 붙음
    case 'page':
      return '📄';
    case 'database':
      return '🗃️';
    case 'date':
      return '📅';
    case 'link_mention':
      return '🔗';
    default:
      return null;
  }
}
