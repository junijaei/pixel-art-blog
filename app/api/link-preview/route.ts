import * as cheerio from 'cheerio';
import { NextRequest, NextResponse } from 'next/server';

export interface LinkPreviewData {
  title?: string;
  description?: string;
  image?: string;
  url: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  // URL 유효성 검사
  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
  }

  try {
    // HTML 가져오기
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      next: {
        revalidate: 86400, // 24시간 캐싱 (ISR)
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Open Graph 태그 추출
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

    const rawImage = $('meta[property="og:image"]').attr('content') || $('meta[name="twitter:image"]').attr('content');

    let image: string | undefined = rawImage;

    if (rawImage) {
      try {
        image = new URL(rawImage, url).toString();
      } catch {
        image = undefined;
      }
    }

    console.log(image, rawImage);

    const previewData: LinkPreviewData = {
      url,
      title,
      description,
      image,
    };

    return NextResponse.json(previewData, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
      },
    });
  } catch (error) {
    console.error('Link preview error:', error);
    return NextResponse.json(
      {
        url,
        error: 'Failed to fetch link preview',
      },
      { status: 500 }
    );
  }
}
