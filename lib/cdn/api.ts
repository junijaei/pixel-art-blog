import type { CdnUploadResponse, ImageUploadResult } from '@/types/cdn';
import { CDN_BASE_URL } from '@/types/cdn';
import crypto from 'crypto';

const DEFAULT_TIMEOUT = 30000;
const MAX_RETRIES = 3;

/**
 * CDN에 저장될 파일명을 생성합니다.
 * blockId + lastEditedTime을 해시하여 일관된 파일명을 생성합니다.
 * 이미지가 수정되면 lastEditedTime이 변경되어 새 파일명이 생성됩니다.
 */
export function generateFileName(blockId: string, lastEditedTime: string): string {
  const contentHash = crypto.createHash('sha256').update(`${blockId}:${lastEditedTime}`).digest('hex').slice(0, 8);
  const sanitizedBlockId = blockId.replace(/-/g, '');
  return `${sanitizedBlockId}_${contentHash}.webp`;
}

export function getCdnUrl(fileName: string): string {
  return `${CDN_BASE_URL}/${fileName}`;
}

async function fetchWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function uploadWithRetry(
  imageUrl: string,
  fileName: string,
  maxRetries: number = MAX_RETRIES
): Promise<CdnUploadResponse> {
  let lastError: Error | null = null;

  const apiKey = process.env.CLOUDFLARE_API_KEY;
  if (!apiKey) {
    throw new Error('CLOUDFLARE_API_KEY environment variable is not set');
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetchWithTimeout(
        CDN_BASE_URL,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
          },
          body: JSON.stringify({ imageUrl, fileName }),
        },
        DEFAULT_TIMEOUT
      );

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`Worker returned ${response.status}: ${errorText}`);
      }

      const result: CdnUploadResponse = await response.json();

      if (!result.url) {
        throw new Error('Worker returned empty URL');
      }

      console.debug(`[CDN] Uploaded: ${fileName} (attempt ${attempt})`);
      return result;
    } catch (error) {
      lastError = error as Error;

      if ((error as Error).name === 'AbortError') {
        console.warn(`[CDN] Upload timeout (attempt ${attempt}/${maxRetries})`);
      } else {
        console.warn(`[CDN] Upload failed (attempt ${attempt}/${maxRetries}):`, (error as Error).message);
      }

      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt - 1) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('Upload failed after max retries');
}

export async function uploadImage(
  imageUrl: string,
  blockId: string,
  lastEditedTime: string
): Promise<ImageUploadResult> {
  try {
    const fileName = generateFileName(blockId, lastEditedTime);

    console.debug(`[CDN] Uploading: ${fileName}`);
    const result = await uploadWithRetry(imageUrl, fileName);

    return {
      success: true,
      cdnUrl: result.url,
      fromCache: false,
    };
  } catch (error) {
    console.error(`[CDN] Upload failed:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function checkImageExists(fileName: string): Promise<boolean> {
  try {
    const response = await fetchWithTimeout(getCdnUrl(fileName), { method: 'HEAD' }, 5000);
    return response.ok;
  } catch {
    return false;
  }
}
