'use client';

import type { LinkPreviewData } from '@/app/api/link-preview/route';
import { PixelLink } from '@/components/ui/pixel-icons';
import { renderRichText } from '@/lib/notion/util';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { BookmarkProps } from './index';

/**
 * Notion Bookmark 블록을 렌더링하는 컴포넌트
 * 링크 미리보기 데이터를 ISR 방식으로 가져와 표시합니다
 *
 * @param block - Notion API에서 반환된 Bookmark 블록 데이터
 */
export function Bookmark({ block }: BookmarkProps) {
  const { url, caption } = block.bookmark;
  const [preview, setPreview] = useState<LinkPreviewData | null>(null);
  const [loading, setLoading] = useState(true);

  console.log(block, block.bookmark);

  useEffect(() => {
    async function loadPreview() {
      try {
        const response = await fetch(`/api/link-preview?url=${encodeURIComponent(url)}`, {
          next: {
            revalidate: 86400, // 24시간 ISR 캐싱
          },
        });

        if (response.ok) {
          const data: LinkPreviewData = await response.json();
          setPreview(data);
        }
      } catch (error) {
        console.error('Failed to load link preview:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPreview();
  }, [url]);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'border-border bg-card my-4 block rounded-xl border p-4',
        'hover:border-muted-foreground/30 transition-all duration-300',
        'group'
      )}
    >
      {loading ? (
        // Skeleton UI
        <div className="flex gap-4">
          <div className="bg-muted h-20 w-20 shrink-0 animate-pulse rounded-lg" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="bg-muted h-4 w-3/4 animate-pulse rounded" />
            <div className="bg-muted h-3 w-full animate-pulse rounded" />
            <div className="bg-muted h-3 w-2/3 animate-pulse rounded" />
          </div>
        </div>
      ) : (
        <div className="flex gap-4">
          {/* 썸네일 이미지 */}
          {preview?.image && (
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
              <Image
                src={preview.image}
                alt={preview.title || 'Bookmark preview'}
                fill
                className="object-cover"
                sizes="80px"
                unoptimized // 외부 이미지는 최적화 비활성화
              />
            </div>
          )}

          <div className="min-w-0 flex-1">
            {/* 픽셀 아이콘 + 제목 or URL */}
            <div className="mb-2 flex items-start gap-2">
              <PixelLink className="text-muted-foreground mt-0.5 h-3 w-3 shrink-0" />
              <span className="group-hover:text-muted-foreground line-clamp-1 text-sm leading-tight font-medium transition-colors">
                {preview?.title || url}
              </span>
            </div>

            {/* 설명 */}
            {preview?.description && (
              <p className="text-muted-foreground mb-2 line-clamp-2 text-xs leading-relaxed">{preview.description}</p>
            )}

            {/* URL */}
            <p className="text-muted-foreground mb-2 truncate text-xs">{url}</p>

            {/* Caption */}
            {caption.length > 0 && (
              <div className="caption-container text-muted-foreground mt-2 text-xs leading-relaxed">
                {renderRichText(caption)}
              </div>
            )}
          </div>
        </div>
      )}
    </a>
  );
}
