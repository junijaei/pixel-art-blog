# ISR (Incremental Static Regeneration) 설계 가이드

## 📖 개요

이 프로젝트는 **ISR 방식**으로 설계되어, 빌드 타임에 Notion API로부터 모든 데이터를 가져와 정적 페이지를 생성하고, 변경된 콘텐츠만 재생성합니다.

---

## 🏗️ 아키텍처

### 데이터 흐름

```
┌─────────────────┐
│   Notion CMS    │
│  (Data Source)  │
└────────┬────────┘
         │
         │ Build Time
         ↓
┌─────────────────┐
│  Next.js Build  │
│   (SSG + ISR)   │
└────────┬────────┘
         │
         │ Generate
         ↓
┌─────────────────┐
│ Static HTML     │
│ (Edge CDN)      │
└────────┬────────┘
         │
         │ Request
         ↓
┌─────────────────┐
│   End User      │
└─────────────────┘

         ↑
         │ Revalidate (Time-based or On-demand)
         │
┌─────────────────┐
│ ISR Background  │
│   Regeneration  │
└─────────────────┘
```

---

## 📂 파일 구조

### 새로 추가된 파일

```
lib/notion/
├── api.ts              # 서버 전용 Notion API 함수
├── config.ts           # ISR 설정 (revalidate 시간 등)
└── client.ts           # 기존 Notion Client

app/
├── posts/[slug]/
│   ├── page.tsx        # ISR 적용된 포스트 상세 페이지
│   └── page.example.tsx # 구현 예시
└── api/
    └── revalidate/
        └── route.ts    # On-Demand Revalidation Webhook

.env.example            # 환경변수 템플릿 (업데이트됨)
```

---

## 🔧 핵심 개념

### 1. **generateStaticParams**

빌드 타임에 동적 라우트의 모든 경로를 미리 생성합니다.

```typescript
// app/posts/[slug]/page.tsx
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs(DATABASE_ID);

  return slugs.map((slug) => ({
    slug, // → /posts/hello-world, /posts/nextjs-isr, ...
  }));
}
```

**동작:**
- 빌드 시점에 Notion에서 모든 포스트의 slug를 fetch
- 각 slug에 대해 정적 페이지 생성
- `npm run build` 시 `/posts/[모든-slug]` HTML 파일 생성

---

### 2. **revalidate (Time-based ISR)**

정적 페이지를 주기적으로 재생성합니다.

```typescript
// app/posts/[slug]/page.tsx
export const revalidate = 3600; // 1시간 (초 단위)
```

**동작:**
1. 사용자가 `/posts/hello-world` 요청
2. 캐시된 정적 HTML 즉시 반환 (빠름!)
3. 마지막 생성 후 1시간 경과했다면:
   - 백그라운드에서 새 데이터 fetch
   - 페이지 재생성
   - 다음 요청부터 새 페이지 제공

**설정값 ([lib/notion/config.ts](lib/notion/config.ts)):**
```typescript
REVALIDATE_TIME: {
  HOME: 3600,        // 1시간
  POSTS_LIST: 1800,  // 30분
  POST_DETAIL: 3600, // 1시간
  STATIC: false,     // 재검증 안함 (완전 정적)
}
```

---

### 3. **On-Demand Revalidation**

특정 이벤트 발생 시 즉시 재생성합니다.

```bash
# Notion에서 포스트 수정 시 즉시 재검증
curl -X POST https://your-domain.com/api/revalidate \
  -H "Authorization: Bearer YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"type": "post", "slug": "hello-world"}'
```

**사용 케이스:**
- Notion 데이터베이스에서 포스트 발행/수정
- 특정 포스트만 재생성 (전체 빌드 불필요)
- Notion Webhook 연동 가능

---

## 🚀 구현 단계

### Step 1: 환경변수 설정

`.env.local` 파일 생성:

```bash
# Notion API Key
NOTION_API_KEY=secret_xxxxxxxxxxxxx

# Notion Database ID
NOTION_DATABASE_ID=xxxxxxxxxxxxx

# Revalidation Secret
REVALIDATE_SECRET=your-random-secret-key
```

---

### Step 2: 서버 API 함수 구현

[lib/notion/api.ts](lib/notion/api.ts) 파일이 이미 생성되어 있습니다.

**주요 함수:**
- `getAllPosts()` - 모든 발행된 포스트 가져오기
- `getPostBySlug()` - 슬러그로 포스트 찾기
- `getAllPostSlugs()` - generateStaticParams용 슬러그 목록
- `getPageBlocks()` - 포스트 내용(블록) 가져오기

---

### Step 3: 포스트 페이지에 ISR 적용

현재 [app/posts/[slug]/page.example.tsx](app/posts/[slug]/page.example.tsx)에 예시가 있습니다.

**실제 구현 시:**
1. `page.example.tsx` → `page.tsx`로 복사/수정
2. `generateStaticParams()` 추가
3. `revalidate` 설정
4. `generateMetadata()` 구현 (SEO)

---

### Step 4: Notion 블록 렌더링

Notion 블록을 React 컴포넌트로 변환해야 합니다.

**옵션 1: react-notion-x (추천)**
```bash
pnpm add react-notion-x
```

**옵션 2: 커스텀 렌더러**
```typescript
// components/notion/BlockRenderer.tsx
export function BlockRenderer({ blocks }) {
  return blocks.map(block => {
    switch (block.type) {
      case 'paragraph':
        return <p>{/* render */}</p>;
      case 'heading_1':
        return <h1>{/* render */}</h1>;
      // ...
    }
  });
}
```

---

### Step 5: Webhook 설정 (선택사항)

Notion에서 변경 시 자동 재검증하려면:

1. **Notion Automation 또는 Zapier 사용**
   - Notion 페이지 업데이트 감지
   - Webhook URL 호출: `POST /api/revalidate`

2. **수동 재검증**
   ```bash
   curl -X POST https://your-site.com/api/revalidate \
     -H "Authorization: Bearer ${REVALIDATE_SECRET}" \
     -H "Content-Type: application/json" \
     -d '{"type": "post", "slug": "your-post-slug"}'
   ```

---

## ⚙️ 빌드 & 배포

### 로컬 빌드

```bash
# 환경변수 설정 후
pnpm build
```

**빌드 과정:**
1. `generateStaticParams()` 실행 → Notion에서 모든 slug fetch
2. 각 slug마다 페이지 생성
3. `/posts/[slug]/*.html` 파일 생성
4. `.next` 폴더에 정적 파일 저장

---

### 배포 (Vercel 추천)

```bash
# Vercel CLI
vercel

# 환경변수 설정
vercel env add NOTION_API_KEY
vercel env add NOTION_DATABASE_ID
vercel env add REVALIDATE_SECRET
```

**Vercel 특징:**
- ISR 자동 지원
- Edge CDN 캐싱
- On-Demand Revalidation 지원
- 자동 HTTPS

---

## 📊 재검증 전략

### Time-based Revalidation (기본)

| 페이지 타입 | Revalidate 시간 | 이유 |
|------------|----------------|------|
| 홈페이지 (`/`) | 1시간 | 최신 포스트 목록 표시 |
| 포스트 목록 (`/posts`) | 30분 | 자주 업데이트될 수 있음 |
| 포스트 상세 (`/posts/[slug]`) | 1시간 | 콘텐츠는 자주 변경되지 않음 |
| About 페이지 | `false` | 정적 (거의 변경 안됨) |

---

### On-Demand Revalidation (권장)

**장점:**
- 즉시 반영 (사용자가 기다릴 필요 없음)
- 불필요한 재생성 방지
- API 호출 최소화

**단점:**
- Webhook 설정 필요
- Notion 자체 Webhook 미지원 (서드파티 필요)

---

## 🎯 최적화 팁

### 1. **Partial Prerendering (Next.js 15+)**

```typescript
// app/posts/[slug]/page.tsx
export const experimental_ppr = true;

export default async function PostPage() {
  return (
    <>
      <Suspense fallback={<Skeleton />}>
        <PostContent /> {/* 동적 부분 */}
      </Suspense>
      <StaticSidebar /> {/* 정적 부분 */}
    </>
  );
}
```

---

### 2. **Cache Tags**

특정 태그로 그룹화된 페이지 재검증:

```typescript
// app/posts/[slug]/page.tsx
export default async function PostPage({ params }) {
  const post = await fetch(/* ... */, {
    next: { tags: ['posts', `post-${params.slug}`] }
  });
}

// Revalidation
revalidateTag('posts'); // 모든 포스트 재검증
revalidateTag('post-hello-world'); // 특정 포스트만
```

---

### 3. **Draft Mode**

비공개 포스트 미리보기:

```typescript
// app/api/draft/route.ts
export async function GET(request: NextRequest) {
  draftMode().enable();
  redirect('/posts/draft-post');
}
```

---

## 🔍 디버깅

### ISR이 작동하는지 확인

```bash
# 빌드 후 확인
pnpm build

# 출력에서 다음 확인
# ├ ○ /posts/[slug]     (ISR: 3600 Seconds)
# └ ● /posts/hello-world  (Static)
```

**심볼 의미:**
- `●` Static: 빌드 타임에 생성
- `○` ISR: 재검증 가능한 정적 페이지
- `λ` Server: 서버 사이드 렌더링

---

### 재검증 로그 확인

```typescript
// app/api/revalidate/route.ts
console.log(`Revalidated post: /posts/${slug}`);
```

Vercel에서 로그 확인:
```bash
vercel logs
```

---

## 📚 참고 자료

- [Next.js ISR 공식 문서](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
- [revalidatePath](https://nextjs.org/docs/app/api-reference/functions/revalidatePath)
- [Notion API Reference](https://developers.notion.com/reference/intro)

---

## 🚨 주의사항

1. **빌드 타임 제한**
   - Notion API Rate Limit: 초당 3회
   - 1000개 포스트 = 최소 5분 소요
   - → 배치 처리 구현 필요

2. **환경변수 보안**
   - `NOTION_API_KEY`: 절대 노출 금지
   - `REVALIDATE_SECRET`: 랜덤 강력한 키 사용

3. **Notion 속성 매핑**
   - Notion 데이터베이스 스키마와 일치 필요
   - [lib/notion/config.ts](lib/notion/config.ts)에서 설정

---

## ✅ 체크리스트

구현 전 확인:

- [ ] Notion Integration 생성 (API Key 발급)
- [ ] Notion Database 생성 (필수 속성: Title, Slug, Status, Created)
- [ ] 환경변수 설정 (`.env.local`)
- [ ] 서버 API 함수 테스트
- [ ] ISR 설정 확인 (`revalidate` 값)
- [ ] 빌드 테스트 (`pnpm build`)
- [ ] Revalidation API 테스트
- [ ] 프로덕션 배포

---

**작성일:** 2026-01-14
**버전:** 1.0.0
