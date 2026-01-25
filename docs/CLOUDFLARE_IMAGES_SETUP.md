# Cloudflare Images 파이프라인 가이드

Notion CMS의 임시 이미지 URL(1시간 만료)을 Cloudflare Images CDN으로 영구 저장하고 최적화하는 전체 파이프라인입니다.

## 📁 폴더 구조

```
types/cloudflare/
  ├── image.ts                 # 이미지 관련 타입 정의
  └── index.ts                 # Export 모듈

lib/cloudflare/
  ├── api.ts                   # Cloudflare Images API 호출
  ├── cache.ts                 # JSON 파일 기반 캐시 시스템
  ├── processor.ts             # Notion 블록 이미지 처리 로직
  └── index.ts                 # Export 모듈

components/ui/
  └── Image.tsx                # 최적화된 이미지 컴포넌트

.cache/
  └── cloudflare-images.json   # 이미지 캐시 (자동 생성)
```

## 🔧 환경 변수 설정

### 1. Cloudflare 계정 정보 확인

**Account ID 확인:**

1. Cloudflare Dashboard 접속
2. 우측 사이드바에서 Account ID 확인

**Account Hash 확인:**

1. Cloudflare Images → 기존 이미지 URL 확인
2. URL 형식: `https://imagedelivery.net/{ACCOUNT_HASH}/{IMAGE_ID}/public`
3. `{ACCOUNT_HASH}` 부분을 복사

**API Token 생성:**

1. Cloudflare Dashboard → My Profile → API Tokens
2. "Create Token" 클릭
3. 권한: "Account - Cloudflare Images - Edit"
4. 생성된 토큰 복사

### 2. .env.local 설정

```bash
# Cloudflare Images Configuration
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
CLOUDFLARE_ACCOUNT_HASH=your_account_hash_here
CLOUDFLARE_API_KEY=your_api_token_here
```

## 📦 필수 패키지 설치

```bash
# Sharp 라이브러리 (이미지 WebP 변환용)
pnpm add sharp

# 타입 정의
pnpm add -D @types/node
```

## 🚀 사용 방법

### 0. 개발 환경에서 테스트하기 (Mock Mode)

개발 서버(`pnpm dev`)에서는 **자동으로 Mock 모드**가 활성화됩니다.

- 실제 Cloudflare 업로드 없이 `/placeholder-image.png` 사용
- 환경 변수 설정 불필요
- 빠른 개발 및 테스트 가능

```typescript
import { processNotionBlocks } from '@/lib/cloudflare';

// NODE_ENV=development 일 때 자동으로 Mock 사용
const stats = await processNotionBlocks(blocks);
// 🎨 Development mode: Using mock processor
// 🖼️  Replaced image abc-123 with placeholder
```

**프로덕션 빌드 테스트:**

```bash
# 프로덕션 모드로 빌드 (실제 Cloudflare 업로드)
pnpm build

# 로컬에서 프로덕션 빌드 실행
pnpm start
```

### 1. 기본 사용법 (포스트 빌드 시)

```typescript
import { processNotionBlocks } from '@/lib/cloudflare';
import type { Block } from '@/types/notion/content/block';

// Next.js 페이지나 API 라우트에서
export async function getStaticProps() {
  // Notion에서 블록 가져오기
  const blocks: Block[] = await fetchNotionBlocks(pageId);

  // 이미지 처리 (in-place로 URL 교체됨)
  const stats = await processNotionBlocks(blocks);

  console.log('이미지 처리 완료:', stats);
  // {
  //   totalImages: 10,
  //   uploaded: 3,      // 새로 업로드된 이미지
  //   cached: 6,        // 캐시에서 가져온 이미지
  //   failed: 1         // 실패한 이미지
  // }

  return {
    props: { blocks },
    revalidate: 3600, // ISR: 1시간마다 갱신
  };
}
```

### 2. 개별 이미지 블록 처리

```typescript
import { processSingleImageBlock } from '@/lib/cloudflare';

const result = await processSingleImageBlock(imageBlock);

if (result?.success) {
  console.log('Cloudflare URL:', result.cloudflareUrl);
  console.log('캐시 사용:', result.isDuplicate);
}
```

### 3. 이미지 컴포넌트 사용

```tsx
import { BlogImage, ThumbnailImage, HeroImage } from '@/components/ui/Image';

// 블로그 포스트 내 이미지
<BlogImage
  src="https://imagedelivery.net/{hash}/{id}/public"
  alt="포스트 이미지"
  caption="이미지 설명"
/>

// 썸네일 (카드형 레이아웃)
<ThumbnailImage
  src="https://imagedelivery.net/{hash}/{id}/thumbnail"
  alt="썸네일"
/>

// Hero 이미지 (우선 로딩)
<HeroImage
  src="https://imagedelivery.net/{hash}/{id}/hero"
  alt="메인 이미지"
/>
```

## 🔄 이미지 처리 플로우

### Block ID + last_edited_time 기반 캐싱

```
Notion 블록 가져오기
     ↓
각 ImageBlock마다:
     ↓
Block ID + last_edited_time 추출
     ↓
JSON 캐시에서 조회
     ↓
├─ 캐시 히트 + 수정 시간 동일
│  → 캐시된 Cloudflare URL 사용 (업로드 스킵)
│
└─ 캐시 미스 또는 수정 시간 다름
   → Notion URL에서 이미지 다운로드
   → WebP로 변환
   → Cloudflare에 업로드
   → 캐시에 저장 (Block ID, last_edited_time, Cloudflare URL)
     ↓
Notion 블록의 URL을 Cloudflare CDN URL로 교체
```

### 왜 Block ID + last_edited_time?

**Notion 이미지 URL의 특징:**

- 1시간마다 URL이 만료되고 쿼리 파라미터가 변경됨
- 같은 이미지라도 매번 다른 URL이 생성됨
- **URL 기반 중복 검증은 불가능!**

**해결 방법:**

- Block ID: 이미지 블록의 고유 식별자 (불변)
- last_edited_time: 이미지가 수정되면 변경됨
- 두 값을 조합하여 캐시 키로 사용
- **이미지가 수정되지 않았다면 캐시 사용, 수정되었다면 재업로드**

### 캐시 파일 구조

`.cache/cloudflare-images.json`:

```json
{
  "version": "1.0.0",
  "lastUpdated": "2026-01-18T12:00:00.000Z",
  "entries": {
    "abc123-block-id": {
      "blockId": "abc123-block-id",
      "lastEditedTime": "2026-01-15T10:30:00.000Z",
      "cloudflareUrl": "https://imagedelivery.net/hash/abc123/public",
      "cloudflareId": "abc123",
      "uploadedAt": "2026-01-15T10:35:00.000Z",
      "originalFilename": "screenshot.png"
    }
  }
}
```

## 🎨 이미지 최적화

### WebP 자동 변환

- 모든 이미지는 서버 사이드에서 WebP로 자동 변환
- Sharp 라이브러리 사용 (quality: 85)
- 원본 포맷이 WebP가 아니면 변환

### Cloudflare Variants

Cloudflare Images는 다양한 variant를 지원합니다:

```typescript
// variant를 URL에 추가하여 다양한 크기 제공
const publicUrl = getCloudflareImageUrl(imageId, 'public');
const thumbnailUrl = getCloudflareImageUrl(imageId, 'thumbnail');
const heroUrl = getCloudflareImageUrl(imageId, 'hero');
```

Cloudflare Dashboard에서 커스텀 variant 생성 가능:

- `public`: 원본 크기 (WebP)
- `thumbnail`: 400x400 (카드용)
- `hero`: 1920x1080 (히어로 이미지용)
- `avatar`: 200x200 (프로필용)

### 반응형 이미지

Image 컴포넌트는 자동으로 srcset을 생성합니다:

```html
<img
  srcset="
    https://imagedelivery.net/{hash}/{id}/public?width=640   640w,
    https://imagedelivery.net/{hash}/{id}/public?width=1080 1080w,
    https://imagedelivery.net/{hash}/{id}/public?width=1920 1920w
  "
  sizes="(max-width: 640px) 640px, (max-width: 1200px) 1080px, 1920px"
/>
```

## ⚙️ 고급 설정

### 재시도 로직

업로드 실패 시 자동으로 3회까지 재시도합니다 (지수 백오프):

- 1회 실패: 1초 대기 후 재시도
- 2회 실패: 2초 대기 후 재시도
- 3회 실패: 4초 대기 후 재시도
- 이후 실패 처리

### 캐시 관리

```typescript
import { getCacheStats, clearCache, pruneOldCache } from '@/lib/cloudflare';

// 캐시 통계 조회
const stats = await getCacheStats();
console.log(stats);
// {
//   totalEntries: 150,
//   cacheVersion: "1.0.0",
//   lastUpdated: "2026-01-18T12:00:00.000Z",
//   cacheFile: "/path/to/.cache/cloudflare-images.json"
// }

// 전체 캐시 초기화
await clearCache();

// 30일 이상 된 캐시 정리
const prunedCount = await pruneOldCache(30);
console.log(`${prunedCount} 개의 오래된 캐시 삭제됨`);
```

### 캐시 파일 백업

`.cache/cloudflare-images.json` 파일을 주기적으로 백업하는 것을 권장합니다:

```bash
# Git에 커밋하지 않음 (.gitignore에 추가됨)
# 별도 백업 스크립트 사용 권장

cp .cache/cloudflare-images.json backup/cloudflare-images-$(date +%Y%m%d).json
```

## 🔍 로깅

모든 주요 단계에서 콘솔 로그 출력:

```
[Cache] Loaded 150 cached images
[ImageProcessor] 🚀 Starting image processing...
[ImageProcessor] 📸 Found 10 images
[ImageProcessor] 📦 Using cached URL for block abc123
[Cloudflare] ⬇️  Downloading image from Notion...
[Cloudflare] 🔄 Converting to WebP...
[Cloudflare] ⬆️  Uploading to Cloudflare...
[Cloudflare] ✅ Image uploaded successfully: abc123 (attempt 1)
[Cache] ✅ Cached image for block abc123
[ImageProcessor] ✅ Processing complete: {
  totalImages: 10,
  uploaded: 3,
  cached: 6,
  failed: 1
}
```

## 🛡️ 에러 핸들링

### 업로드 실패 처리

```typescript
const stats = await processNotionBlocks(blocks);

if (stats.failed > 0) {
  console.error(`${stats.failed}개 이미지 업로드 실패`);
  // 실패한 이미지는 원본 Notion URL 유지
}
```

### Sharp 미설치 시

Sharp가 설치되지 않은 경우:

- 경고 로그 출력
- WebP 변환 없이 원본 포맷으로 업로드
- 기능은 정상 작동

### 캐시 파일 손상 시

캐시 파일이 손상된 경우:

- 자동으로 새 캐시 생성
- 모든 이미지를 재처리

## 📊 성능 최적화

### ISR (Incremental Static Regeneration)

```typescript
export async function generateStaticParams() {
  // 빌드 타임에 모든 포스트의 이미지 처리
  const posts = await getAllPosts();

  for (const post of posts) {
    await processNotionBlocks(post.blocks);
  }

  return posts.map((post) => ({ slug: post.slug }));
}

export const revalidate = 3600; // 1시간마다 ISR
```

### 빌드 시 처리

- 모든 이미지는 빌드 타임에 Cloudflare로 업로드
- 이미 업로드된 이미지는 캐시에서 가져와 빌드 시간 단축
- **Block ID 기반 캐싱으로 중복 업로드 방지**
- Notion 이미지가 수정되지 않았다면 재빌드 시에도 캐시 사용

### 캐시 효율성

**시나리오 1: 새 포스트 추가**

- 새 이미지만 업로드
- 기존 이미지는 모두 캐시에서 가져옴

**시나리오 2: 포스트 수정 (이미지 변경 없음)**

- `last_edited_time`이 동일하므로 캐시 사용
- 업로드 없이 즉시 완료

**시나리오 3: 이미지 교체**

- `last_edited_time`이 변경되어 캐시 무효화
- 새 이미지 다운로드 및 업로드
- 새 캐시 엔트리 생성

## 🚨 주의사항

1. **서버 사이드 전용**: 이미지 업로드는 반드시 서버에서만 실행
2. **API 키 노출 금지**: 클라이언트 코드에 환경 변수 노출 방지
3. **Sharp 의존성**: WebP 변환을 위해 Sharp 설치 권장
4. **캐시 파일 관리**: `.cache/` 디렉토리는 Git에 커밋하지 않음
5. **Block ID 필수**: 모든 ImageBlock은 `id`와 `last_edited_time` 필드가 있어야 함
6. **비용**: Cloudflare Images는 무료 플랜에서 월 100,000건까지 무료

## 📚 타입 참고

```typescript
// 캐시 엔트리
interface ImageCacheEntry {
  blockId: string;
  lastEditedTime: string;
  cloudflareUrl: string;
  cloudflareId: string;
  uploadedAt: string;
  originalFilename?: string;
}

// 업로드 결과
interface ImageUploadResult {
  success: boolean;
  cloudflareUrl?: string;
  cloudflareId?: string;
  error?: string;
  isDuplicate?: boolean; // 캐시 히트 여부
}

// 처리 통계
interface ProcessingStats {
  totalImages: number; // 전체 이미지 수
  uploaded: number; // 새로 업로드된 수
  cached: number; // 캐시에서 가져온 수
  failed: number; // 실패한 수
}
```

## 🔗 관련 링크

- [Cloudflare Images Docs](https://developers.cloudflare.com/images/)
- [Sharp Documentation](https://sharp.pixelplumbing.com/)
- [Next.js Image Optimization](https://nextjs.org/docs/pages/building-your-application/optimizing/images)

## 🆕 변경 사항 (v2.0)

### Block ID 기반 캐싱으로 변경

**이전 (URL 기반):**

- Notion URL을 해시하여 중복 검증
- ❌ 1시간마다 URL이 변경되어 중복 검증 불가능

**현재 (Block ID 기반):**

- Block ID + last_edited_time으로 캐시 키 생성
- ✅ 이미지가 수정되지 않았다면 캐시 사용
- ✅ 이미지가 수정되면 자동으로 재업로드
- ✅ JSON 파일로 영구 캐시

### 주요 개선 사항

1. **정확한 중복 검증**: URL이 아닌 Block ID 기반
2. **수정 감지**: last_edited_time으로 이미지 변경 감지
3. **영구 캐시**: 메모리가 아닌 파일 시스템 저장
4. **빌드 시간 단축**: 캐시 히트율 대폭 향상
