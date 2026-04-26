import { recordPageView } from '@/lib/analytics/pageview';
import type { PageViewPayload, PageViewResult } from '@/lib/analytics/types';
import { NextRequest, NextResponse } from 'next/server';

const BOT_UA = /bot|crawl|spider|headless|puppeteer|playwright|lighthouse/i;

// Loose UUID-v4 shape check; we generate these ourselves with crypto.randomUUID()
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(req: NextRequest): Promise<NextResponse<PageViewResult>> {
  if (BOT_UA.test(req.headers.get('user-agent') ?? '')) {
    return NextResponse.json({ recorded: false });
  }

  let body: Partial<PageViewPayload>;
  try {
    body = (await req.json()) as Partial<PageViewPayload>;
  } catch {
    return NextResponse.json({ recorded: false }, { status: 400 });
  }

  const { path, sessionId } = body;

  if (
    typeof path !== 'string' ||
    typeof sessionId !== 'string' ||
    !path.startsWith('/') ||
    path.length > 500 ||
    !UUID_RE.test(sessionId)
  ) {
    return NextResponse.json({ recorded: false }, { status: 400 });
  }

  const result = await recordPageView(path, sessionId);
  return NextResponse.json(result);
}
