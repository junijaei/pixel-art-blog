# 개발 환경 테스트 가이드

개발 서버에서 Cloudflare Images 파이프라인을 테스트하는 방법입니다.

## 🎨 자동 Mock 모드 (권장)

개발 환경(`NODE_ENV=development`)에서는 자동으로 Mock 모드가 활성화됩니다.

### 작동 방식

```typescript
// lib/cloudflare/processor.ts
export async function processNotionBlocks(blocks: Block[]) {
  // 개발 환경에서는 Mock 사용
  if (isDevelopment()) {
    return mockProcessNotionBlocks(blocks);
  }

  // 프로덕션에서는 실제 Cloudflare 업로드
  // ...
}
```

### 개발 서버 실행

```bash
# 개발 서버 시작 (자동으로 Mock 모드)
pnpm dev

# 브라우저에서 localhost:3000 접속
# Notion 이미지가 모두 /placeholder-image.png로 교체됨
```

### 콘솔 로그 확인

```
[ImageProcessor] 🎨 Development mode: Using mock processor
[Dev Mock] 🖼️  Replaced image abc-123 with placeholder
[Dev Mock] 🖼️  Replaced image def-456 with placeholder
[ImageProcessor] ✅ Processing complete: {
  totalImages: 2,
  uploaded: 0,
  cached: 2,
  failed: 0
}
```

## 🏗️ 프로덕션 빌드 테스트

실제 Cloudflare 업로드를 로컬에서 테스트하려면:

### 1. 환경 변수 설정

`.env.local` 파일에 Cloudflare 정보 입력:

```bash
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_ACCOUNT_HASH=your_account_hash
CLOUDFLARE_API_KEY=your_api_token
```

### 2. 프로덕션 빌드

```bash
# NODE_ENV=production으로 빌드
pnpm build
```

빌드 중 콘솔 로그:

```
[ImageProcessor] 🚀 Starting image processing...
[ImageProcessor] 📸 Found 10 images
[Cache] 📦 Cache hit for block abc-123
[Cloudflare] ⬇️  Downloading image from Notion...
[Cloudflare] 🔄 Converting to WebP...
[Cloudflare] ⬆️  Uploading to Cloudflare...
[Cloudflare] ✅ Image uploaded successfully: def456
[Cache] ✅ Cached image for block def-456
[ImageProcessor] ✅ Processing complete: {
  totalImages: 10,
  uploaded: 3,
  cached: 7,
  failed: 0
}
```

### 3. 로컬에서 프로덕션 실행

```bash
# 빌드된 결과를 로컬에서 실행
pnpm start
```

## 🔄 환경별 동작 차이

| 환경 | 명령어       | NODE_ENV      | 이미지 처리            |
| ---- | ------------ | ------------- | ---------------------- |
| 개발 | `pnpm dev`   | `development` | Mock (placeholder)     |
| 빌드 | `pnpm build` | `production`  | 실제 Cloudflare 업로드 |
| 실행 | `pnpm start` | `production`  | 빌드 시 이미 처리됨    |

## 🧪 특정 환경 강제하기

환경 변수를 직접 설정하여 동작 변경:

```bash
# 개발 서버를 프로덕션 모드로 (권장하지 않음)
NODE_ENV=production pnpm dev

# 빌드를 Mock 모드로 (테스트용)
NODE_ENV=development pnpm build
```

## 📝 Mock 모드 커스터마이징

다른 placeholder 이미지를 사용하려면 `lib/cloudflare/dev-mock.ts` 수정:

```typescript
export async function mockUploadImage(): Promise<ImageUploadResult> {
  return {
    success: true,
    cloudflareUrl: '/your-custom-placeholder.png', // 여기 수정
    cloudflareId: 'dev-mock-image',
    isDuplicate: false,
  };
}
```

## 🚨 주의사항

1. **개발 환경에서는 실제 업로드 없음**
   - `pnpm dev`로 실행 시 Cloudflare API 호출 없음
   - 환경 변수 설정 불필요

2. **프로덕션 빌드는 실제 업로드**
   - `pnpm build` 시 실제로 이미지가 Cloudflare에 업로드됨
   - 반드시 환경 변수가 올바르게 설정되어야 함

3. **캐시는 개발/프로덕션 공유**
   - `.cache/cloudflare-images.json`은 환경 관계없이 동일
   - 개발 환경에서는 캐시에 쓰지 않음

## 🎯 권장 워크플로우

```bash
# 1. 개발 중: Mock 모드로 빠르게 개발
pnpm dev
# → Notion 이미지가 placeholder로 표시됨

# 2. 로컬 테스트: 실제 업로드 테스트 (선택)
pnpm build
pnpm start
# → 실제 Cloudflare에 업로드되고 CDN URL 사용

# 3. 배포: Vercel에서 자동 빌드
git push
# → Vercel이 자동으로 pnpm build 실행
# → 환경 변수는 Vercel Dashboard에서 설정
```

## 🔍 디버깅

### Mock 모드가 작동하지 않는 경우

```bash
# NODE_ENV 확인
echo $NODE_ENV

# 강제로 development 설정
export NODE_ENV=development
pnpm dev
```

### 프로덕션 빌드 시 업로드 실패

```bash
# 환경 변수 확인
cat .env.local

# API 키 유효성 테스트
curl -X GET "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/images/v1" \
  -H "Authorization: Bearer $CLOUDFLARE_API_KEY"
```

## 📚 관련 문서

- [Cloudflare Images 전체 가이드](./CLOUDFLARE_IMAGES_SETUP.md)
- [Next.js 환경 변수](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables)
