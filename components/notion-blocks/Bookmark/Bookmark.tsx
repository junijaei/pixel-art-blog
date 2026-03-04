import type { LinkPreviewData } from '@/app/api/link-preview/route';
import type { BookmarkProps } from '@/components/notion-blocks/Bookmark/index';
import { PixelLink } from '@/components/ui/pixel';
import { cn } from '@/utils/utils';
import { RichText } from '../RichText';

/**
 * Notion Bookmark 블록을 렌더링하는 컴포넌트
 * 링크 미리보기 데이터를 서버 컴포넌트(BookmarkServer)에서 주입받아 표시합니다
 *
 * @param block - Notion API에서 반환된 Bookmark 블록 데이터
 * @param preview - 서버에서 미리 페치된 OG/Twitter 메타데이터
 */
export function Bookmark({ block, preview }: BookmarkProps) {
  const { url, caption } = block.bookmark;

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
      <div className="flex gap-4">
        {/* 썸네일 이미지 */}
        {preview?.image && (
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
            <img
  src={preview.image}
  alt={preview.title || 'Bookmark preview'}
  className="h-full w-full object-cover"
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
              <RichText richTextArray={caption} />
            </div>
          )}
        </div>
      </div>
    </a>
  );
}

export type { LinkPreviewData };
