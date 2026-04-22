import type { LinkPreviewData } from '@/app/api/link-preview/route';
import type { BookmarkProps } from '@/components/notion-blocks/Bookmark/index';
import { PixelLink } from '@/components/ui/pixel';
import { cn } from '@/utils/utils';
import { ChildBlockContainer } from '../ChildBlockContainer';
import { RichText } from '../RichText';

/**
 * Renders a Notion bookmark block with optional link preview data.
 */
export function Bookmark({ block, preview, children }: BookmarkProps) {
  const { url, caption } = block.bookmark;

  return (
    <>
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
            <div className="mb-2 flex items-start gap-2">
              <PixelLink className="text-muted-foreground mt-0.5 h-3 w-3 shrink-0" />
              <span className="group-hover:text-muted-foreground line-clamp-1 text-sm leading-tight font-medium transition-colors">
                {preview?.title || url}
              </span>
            </div>

            {preview?.description && (
              <p className="text-muted-foreground mb-2 line-clamp-2 text-xs leading-relaxed">{preview.description}</p>
            )}

            <p className="text-muted-foreground mb-2 truncate text-xs">{url}</p>

            {caption.length > 0 && (
              <div className="caption-container text-muted-foreground mt-2 text-xs leading-relaxed">
                <RichText richTextArray={caption} />
              </div>
            )}
          </div>
        </div>
      </a>
      {children && <ChildBlockContainer>{children}</ChildBlockContainer>}
    </>
  );
}

export type { LinkPreviewData };
