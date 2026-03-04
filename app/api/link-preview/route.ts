import { scrapePreview } from '@/lib/link-preview/scrape';
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

  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
  }

  const preview = await scrapePreview(url);

  if (!preview) {
    return NextResponse.json({ url, error: 'Failed to fetch link preview' }, { status: 500 });
  }

  return NextResponse.json(preview, {
    headers: {
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
