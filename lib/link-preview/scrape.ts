/**
 * Core link-preview scraping logic — server-only, no I/O side effects.
 * Used directly by server components and by the /api/link-preview route.
 */
import type { LinkPreviewData } from '@/app/api/link-preview/route';
import * as cheerio from 'cheerio';

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

/**
 * Fetch OG/Twitter meta tags from a URL.
 * Results are cached by Next.js `fetch` for 24 hours (ISR).
 */
export async function scrapePreview(url: string): Promise<LinkPreviewData | null> {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      next: { revalidate: 86400 },
    });

    if (!response.ok) return null;

    const html = await response.text();
    const $ = cheerio.load(html);

    const title =
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('title').text() ||
      undefined;

    const description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="twitter:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      undefined;

    const rawImage =
      $('meta[property="og:image"]').attr('content') || $('meta[name="twitter:image"]').attr('content');

    let image: string | undefined;
    if (rawImage) {
      try {
        image = new URL(rawImage, url).toString();
      } catch {
        image = undefined;
      }
    }

    return { url, title, description, image };
  } catch {
    return null;
  }
}
