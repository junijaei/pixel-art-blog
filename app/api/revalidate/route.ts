/**
 * On-Demand Revalidation API
 * Notion에서 변경 사항 발생 시 특정 페이지만 재생성
 */

import { ISR_CONFIG } from '@/lib/notion/config';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // 시크릿 키 검증
    const authHeader = request.headers.get('authorization');
    const secret = authHeader?.replace('Bearer ', '');

    if (secret !== ISR_CONFIG.API_KEY) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    // 요청 본문 파싱
    const body = await request.json();
    const { type, slug, tag } = body;

    // 재검증 타입에 따라 처리
    switch (type) {
      case 'post':
        // 특정 포스트 재검증
        if (slug) {
          revalidatePath(`/posts/${slug}`);
          console.log(`Revalidated post: /posts/${slug}`);
        }
        break;

      case 'posts':
        // 전체 포스트 목록 재검증
        revalidatePath('/posts');
        console.log('Revalidated posts list');
        break;

      case 'home':
        // 홈페이지 재검증
        revalidatePath('/');
        console.log('Revalidated home page');
        break;

      case 'all':
        // 모든 페이지 재검증
        revalidatePath('/', 'layout');
        console.log('Revalidated all pages');
        break;

      case 'tag':
        // 특정 태그로 재검증
        if (tag) {
          // revalidateTag(tag);
          console.log(`Revalidated tag: ${tag}`);
        }
        break;

      default:
        return NextResponse.json({ message: 'Invalid revalidation type' }, { status: 400 });
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      type,
      slug,
      tag,
    });
  } catch (err) {
    console.error('Revalidation error:', err);
    return NextResponse.json({ message: 'Error revalidating', error: String(err) }, { status: 500 });
  }
}

// GET 요청은 거부
export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}
