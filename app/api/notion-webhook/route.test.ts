import { signWebhookPayload } from '@notionhq/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// vi.mock 팩토리는 파일 최상단으로 호이스팅되므로 모의 함수도 같이 끌어올려야 한다
const { fetchBlockComments, setBlockComments, revalidateTag, revalidatePath, getPosts, getCategories } =
  vi.hoisted(() => ({
    fetchBlockComments: vi.fn(),
    setBlockComments: vi.fn(),
    revalidateTag: vi.fn(),
    revalidatePath: vi.fn(),
    getPosts: vi.fn(),
    getCategories: vi.fn(),
  }));

vi.mock('@/features/post/api/comment', () => ({ fetchBlockComments }));
vi.mock('@/features/post/api/comment-index', () => ({
  setBlockComments,
  postCommentsTag: (pageId: string) => `comments:${pageId}`,
}));
vi.mock('next/cache', () => ({ revalidateTag, revalidatePath }));
vi.mock('@/features/post', () => ({ getPosts, getCategories }));

import { POST } from '@/app/api/notion-webhook/route';

const TOKEN = 'secret_test_token';
const PAGE_ID = '0ef104cd-477e-80e1-8571-cfd10e92339a';
const BLOCK_ID = '153104cd-477e-803a-88dc-caececf26478';

async function request(body: unknown, signature?: string | null): Promise<Request> {
  const raw = JSON.stringify(body);
  const headers = new Headers({ 'content-type': 'application/json' });
  const value =
    signature === undefined
      ? await signWebhookPayload({ body: raw, verificationToken: TOKEN })
      : signature;
  if (value !== null) headers.set('x-notion-signature', value);

  return new Request('https://example.com/api/notion-webhook', {
    method: 'POST',
    headers,
    body: raw,
  });
}

function commentEvent(type: string, overrides: Record<string, unknown> = {}) {
  return {
    id: 'evt-1',
    type,
    entity: { id: 'comment-1', type: 'comment' },
    data: { page_id: PAGE_ID, parent: { id: BLOCK_ID, type: 'block' } },
    ...overrides,
  };
}

// route 모듈이 NextRequest를 기대하지만 Request로 충분하다
type RouteRequest = Parameters<typeof POST>[0];

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv('NOTION_WEBHOOK_SECRET', TOKEN);
  fetchBlockComments.mockResolvedValue([{ id: 'c1' }]);
});

describe('구독 검증 요청', () => {
  it('서명 없이도 통과시키고 토큰을 로그로 남긴다', async () => {
    const log = vi.spyOn(console, 'info').mockImplementation(() => undefined);

    const res = await POST((await request({ verification_token: 'secret_abc' }, null)) as RouteRequest);

    expect(res.status).toBe(200);
    expect(log).toHaveBeenCalledWith('[NotionWebhook] verification_token =', 'secret_abc');
    log.mockRestore();
  });
});

describe('서명 검증', () => {
  it('서명이 틀리면 401', async () => {
    const res = await POST((await request(commentEvent('comment.created'), 'sha256=deadbeef')) as RouteRequest);
    expect(res.status).toBe(401);
    expect(setBlockComments).not.toHaveBeenCalled();
  });

  it('시크릿 미설정이면 500', async () => {
    vi.stubEnv('NOTION_WEBHOOK_SECRET', '');
    const err = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const res = await POST((await request(commentEvent('comment.created'))) as RouteRequest);

    expect(res.status).toBe(500);
    err.mockRestore();
  });

  it('본문이 JSON이 아니면 400', async () => {
    const res = await POST(
      new Request('https://example.com/api/notion-webhook', {
        method: 'POST',
        body: 'not json',
      }) as RouteRequest
    );
    expect(res.status).toBe(400);
  });
});

describe('댓글 이벤트', () => {
  it.each(['comment.created', 'comment.updated', 'comment.deleted'])(
    '%s 는 해당 블록만 다시 읽어 인덱스를 갱신한다',
    async (type) => {
      const res = await POST((await request(commentEvent(type))) as RouteRequest);

      expect(res.status).toBe(200);
      expect(fetchBlockComments).toHaveBeenCalledWith(BLOCK_ID);
      expect(setBlockComments).toHaveBeenCalledWith(PAGE_ID, BLOCK_ID, [{ id: 'c1' }]);
      // 프로필의 expire(7일)가 인덱스 캐시 TTL(24시간)보다 길어야 지워진 댓글이 되살아나지 않는다
      expect(revalidateTag).toHaveBeenCalledWith(`comments:${PAGE_ID}`, 'days');
    }
  );

  it('페이지 자체에 달린 댓글은 건너뛴다', async () => {
    const event = commentEvent('comment.created', {
      data: { page_id: PAGE_ID, parent: { id: PAGE_ID, type: 'page' } },
    });

    const res = await POST((await request(event)) as RouteRequest);

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toMatchObject({ synced: false });
    expect(setBlockComments).not.toHaveBeenCalled();
  });

  it('처리 중 실패하면 500으로 알려 Notion이 재전송하게 한다', async () => {
    fetchBlockComments.mockRejectedValue(new Error('redis down'));
    const err = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const res = await POST((await request(commentEvent('comment.created'))) as RouteRequest);

    expect(res.status).toBe(500);
    err.mockRestore();
  });
});

describe('page.content_updated', () => {
  it('해당 글 경로만 revalidate 한다', async () => {
    getPosts.mockResolvedValue([{ id: PAGE_ID, slug: '28', categoryId: 'cat-1' }]);
    getCategories.mockResolvedValue({
      maps: { byId: new Map([['cat-1', { fullPath: 'notes/translate' }]]) },
    });

    const event = {
      id: 'evt-2',
      type: 'page.content_updated',
      entity: { id: PAGE_ID, type: 'page' },
      data: { page_id: PAGE_ID },
    };

    const res = await POST((await request(event)) as RouteRequest);

    expect(res.status).toBe(200);
    expect(revalidatePath).toHaveBeenCalledWith('/notes/translate/28');
  });

  it('모르는 글이면 revalidate 하지 않는다', async () => {
    getPosts.mockResolvedValue([]);
    getCategories.mockResolvedValue({ maps: { byId: new Map() } });

    const res = await POST(
      (await request({
        id: 'evt-3',
        type: 'page.content_updated',
        entity: { id: 'unknown', type: 'page' },
        data: {},
      })) as RouteRequest
    );

    expect(res.status).toBe(200);
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});

describe('그 외 이벤트', () => {
  it('무시하고 200을 준다', async () => {
    const res = await POST(
      (await request({
        id: 'evt-4',
        type: 'database.created',
        entity: { id: 'x' },
        data: {},
      })) as RouteRequest
    );

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toMatchObject({ ignored: 'database.created' });
    expect(setBlockComments).not.toHaveBeenCalled();
  });
});
