import type { LinkPreviewData } from '@/app/api/link-preview/route';

/**
 * URL에서 링크 미리보기 데이터를 가져옵니다
 * ISR 캐싱을 활용합니다 (24시간)
 *
 * @param url - 미리보기를 가져올 URL
 * @returns LinkPreviewData 또는 null (실패 시)
 */
export async function fetchLinkPreview(url: string): Promise<LinkPreviewData | null> {
  try {
    const apiUrl = `/api/link-preview?url=${encodeURIComponent(url)}`;
    const response = await fetch(apiUrl, {
      next: {
        revalidate: 86400, // 24시간 ISR 캐싱
      },
    });

    if (!response.ok) {
      console.warn(`Failed to fetch link preview for ${url}:`, response.statusText);
      return null;
    }

    const data: LinkPreviewData = await response.json();
    return data;
  } catch (error) {
    console.error('fetchLinkPreview error:', error);
    return null;
  }
}
