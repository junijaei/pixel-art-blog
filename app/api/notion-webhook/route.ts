import { fetchBlockComments } from '@/features/post/api/comment';
import { postCommentsTag, setBlockComments } from '@/features/post/api/comment-index';
import { getCategories, getPosts } from '@/features/post';
import { verifyWebhookSignature } from '@notionhq/client';
import type { NotionWebhookEvent, NotionWebhookVerification } from '@/features/post/model';
import { isCommentEvent, isVerification } from '@/features/post/model';
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * 댓글이 달린 블록 하나만 다시 읽어 인덱스를 갱신합니다.
 *
 * created/updated/deleted를 구분하지 않고 항상 현재 상태를 다시 읽는다.
 * 이벤트가 순서를 바꿔 도착하거나 유실돼도 결과가 같아지고, 해결(resolve)된 댓글도
 * comments.list가 돌려주지 않으므로 자연히 인덱스에서 빠진다.
 */
async function syncCommentedBlock(event: NotionWebhookEvent): Promise<boolean> {
  const pageId = event.data.page_id;
  const blockId = event.data.parent?.id;

  if (!pageId || !blockId) return false;
  // 페이지 자체에 달린 댓글은 블록 단위 인덱스의 대상이 아니다
  if (blockId === pageId) return false;

  const comments = await fetchBlockComments(blockId);
  await setBlockComments(pageId, blockId, comments);
  // Next 16의 revalidateTag는 무효화 표식을 얼마나 보관할지 정하는 프로필을 요구한다.
  // 표식이 캐시 항목보다 먼저 사라지면 지워진 댓글이 되살아난다.
  // 'days'는 expire 7일이라 댓글 인덱스 TTL(24시간)을 넉넉히 덮는다.
  revalidateTag(postCommentsTag(pageId), 'days');
  return true;
}

/** 글 페이지의 공개 경로. 찾지 못하면 null. */
async function resolvePostPath(pageId: string): Promise<string | null> {
  const [posts, categories] = await Promise.all([getPosts(), getCategories()]);

  const post = posts.find((candidate) => candidate.id === pageId);
  if (!post) return null;

  const fullPath = categories.maps.byId.get(post.categoryId)?.fullPath || '';
  return `/${fullPath ? `${fullPath}/${post.slug}` : post.slug}`;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const rawBody = await req.text();

  let payload: NotionWebhookVerification | NotionWebhookEvent;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  // 구독 생성 시 한 번 오는 검증 요청. 이 토큰을 Notion UI에 붙여넣어야 구독이 완료되고,
  // 이후 요청의 서명 키가 된다. 아직 키가 없으므로 서명을 검사하지 않는다.
  if (isVerification(payload)) {
    console.info('[NotionWebhook] verification_token =', payload.verification_token);
    return NextResponse.json({ ok: true });
  }

  const token = process.env.NOTION_WEBHOOK_SECRET;
  if (!token) {
    console.error('[NotionWebhook] NOTION_WEBHOOK_SECRET이 설정되지 않았습니다.');
    return NextResponse.json({ error: 'not configured' }, { status: 500 });
  }

  // 서명은 도착한 그대로의 본문에 대해 계산된다. 파싱 후 재직렬화하면 바이트가 달라져 어긋난다.
  const trusted = await verifyWebhookSignature({
    body: rawBody,
    signature: req.headers.get('x-notion-signature'),
    verificationToken: token,
  });
  if (!trusted) {
    return NextResponse.json({ error: 'invalid signature' }, { status: 401 });
  }

  try {
    if (isCommentEvent(payload)) {
      const synced = await syncCommentedBlock(payload);
      return NextResponse.json({ ok: true, handled: payload.type, synced });
    }

    if (payload.type === 'page.content_updated') {
      const pageId = payload.entity?.id ?? payload.data.page_id;
      const path = pageId ? await resolvePostPath(pageId) : null;
      if (path) revalidatePath(path);
      return NextResponse.json({ ok: true, handled: payload.type, revalidated: path });
    }
  } catch (error) {
    // 200을 주면 Notion이 재시도하지 않는다. 실패는 500으로 알려 재전송받는다.
    console.error('[NotionWebhook] 처리 실패:', payload.type, error);
    return NextResponse.json({ error: 'handler failed' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, ignored: payload.type });
}
