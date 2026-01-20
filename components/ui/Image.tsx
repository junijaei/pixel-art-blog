/**
 * Optimized Image Component
 *
 * Cloudflare Images CDN을 활용한 최적화된 이미지 컴포넌트
 * - Lazy loading 지원
 * - 반응형 크기 지원
 * - Cloudflare transformation URL 활용
 */

'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface ImageProps {
  /** Cloudflare CDN URL 또는 일반 이미지 URL */
  src: string;
  /** 대체 텍스트 (접근성) */
  alt: string;
  /** 이미지 너비 (픽셀) */
  width?: number;
  /** 이미지 높이 (픽셀) */
  height?: number;
  /** CSS 클래스 */
  className?: string;
  /** Lazy loading 여부 (기본: true) */
  lazy?: boolean;
  /** 우선순위 로딩 (LCP 이미지용, 기본: false) */
  priority?: boolean;
  /** 이미지 캡션 */
  caption?: string;
  /** Cloudflare variant (public, thumbnail, hero 등) */
  variant?: string;
  /** 로딩 중 placeholder 표시 여부 */
  showPlaceholder?: boolean;
}

/**
 * Cloudflare Image URL에 variant 적용
 */
function applyVariant(url: string, variant: string = 'public'): string {
  // Cloudflare Images URL 패턴: https://imagedelivery.net/{account-hash}/{image-id}/{variant}
  if (url.includes('imagedelivery.net')) {
    // 기존 variant 교체
    const parts = url.split('/');
    if (parts.length >= 5) {
      parts[parts.length - 1] = variant;
      return parts.join('/');
    }
  }
  // Cloudflare URL이 아니면 원본 반환
  return url;
}

/**
 * 반응형 이미지 srcset 생성
 * Cloudflare Images는 URL에 /width=X,height=Y 같은 파라미터 지원
 */
function generateSrcSet(baseUrl: string, widths: number[]): string {
  if (!baseUrl.includes('imagedelivery.net')) {
    return '';
  }

  return widths
    .map((width) => {
      // Cloudflare flexible variants 사용 시 URL 포맷
      const resizedUrl = `${baseUrl}?width=${width}`;
      return `${resizedUrl} ${width}w`;
    })
    .join(', ');
}

export function Image({
  src,
  alt,
  width,
  height,
  className,
  lazy = true,
  priority = false,
  caption,
  variant = 'public',
  showPlaceholder = true,
}: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Variant 적용된 URL
  const imageUrl = applyVariant(src, variant);

  // 반응형 srcset (Cloudflare Images만)
  const srcSet = src.includes('imagedelivery.net')
    ? generateSrcSet(imageUrl, [640, 750, 828, 1080, 1200, 1920])
    : undefined;

  // 로딩 전략
  const loading = priority ? 'eager' : lazy ? 'lazy' : 'eager';

  return (
    <figure className={cn('relative', className)}>
      {/* Placeholder */}
      {showPlaceholder && !isLoaded && !hasError && (
        <div
          className="absolute inset-0 animate-pulse bg-muted/20"
          style={{ width, height }}
          aria-hidden="true"
        />
      )}

      {/* 실제 이미지 */}
      {!hasError ? (
        <img
          src={imageUrl}
          srcSet={srcSet}
          sizes={srcSet ? '(max-width: 640px) 640px, (max-width: 1200px) 1080px, 1920px' : undefined}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
            console.error(`[Image] Failed to load image: ${src}`);
          }}
          className={cn(
            'transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
            className
          )}
        />
      ) : (
        /* 에러 fallback */
        <div
          className="flex items-center justify-center border border-border bg-muted/10 text-muted-foreground"
          style={{ width: width || '100%', height: height || 200 }}
        >
          <div className="text-center text-sm">
            <p>이미지를 불러올 수 없습니다</p>
            <p className="text-xs opacity-60">{alt}</p>
          </div>
        </div>
      )}

      {/* 캡션 */}
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/**
 * 블로그 포스트용 이미지 컴포넌트 (미리 정의된 스타일)
 */
export function BlogImage({
  src,
  alt,
  caption,
  className,
}: Omit<ImageProps, 'variant' | 'lazy' | 'showPlaceholder'>) {
  return (
    <Image
      src={src}
      alt={alt}
      caption={caption}
      variant="public"
      lazy={true}
      showPlaceholder={true}
      className={cn('my-6 rounded-lg border border-border', className)}
    />
  );
}

/**
 * 썸네일 이미지 컴포넌트
 */
export function ThumbnailImage({
  src,
  alt,
  className,
}: Pick<ImageProps, 'src' | 'alt' | 'className'>) {
  return (
    <Image
      src={src}
      alt={alt}
      variant="thumbnail"
      lazy={true}
      showPlaceholder={true}
      className={cn('h-auto w-full rounded-md', className)}
    />
  );
}

/**
 * Hero 이미지 컴포넌트 (우선 로딩)
 */
export function HeroImage({
  src,
  alt,
  className,
}: Pick<ImageProps, 'src' | 'alt' | 'className'>) {
  return (
    <Image
      src={src}
      alt={alt}
      variant="hero"
      priority={true}
      lazy={false}
      showPlaceholder={false}
      className={cn('h-auto w-full', className)}
    />
  );
}
