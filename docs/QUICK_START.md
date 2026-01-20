# Quick Start: 개발 환경 테스트

Cloudflare Images 파이프라인을 개발 환경에서 빠르게 테스트하는 방법입니다.

## 🚀 1분 안에 시작하기

### 1. 개발 서버 실행

```bash
pnpm dev
```

### 2. 테스트 페이지 접속

브라우저에서 열기:
```
http://localhost:3000/test-image
```

**완료!** ImageBlock이 placeholder 이미지와 함께 렌더링됩니다.

## 🎯 무엇이 표시되나요?

테스트 페이지에서 다음을 확인할 수 있습니다:

1. **Caption 없는 이미지**
2. **Paragraph 블록**
3. **Caption 있는 이미지** (bold, link 포함)

## 🎨 개발 모드 특징

- ✅ **실제 업로드 없음** - Cloudflare API 호출 없음
- ✅ **환경 변수 불필요** - `.env.local` 설정 안 해도 됨
- ✅ **빠른 개발** - placeholder 이미지로 즉시 테스트
- ✅ **자동 감지** - `NODE_ENV=development`면 자동 Mock 모드

## 🔍 콘솔 로그 확인

개발 서버 터미널에서 다음과 같은 로그를 볼 수 있습니다:

```
[ImageProcessor] 🎨 Development mode: Using mock processor
[Dev Mock] 🖼️  Replaced image test-image-1 with placeholder
[Dev Mock] 🖼️  Replaced image test-image-2 with placeholder
```

## 📦 실제 Notion 데이터로 테스트

Notion API에서 가져온 블록을 테스트하려면:

```typescript
// app/posts/[slug]/page.tsx
import { processNotionBlocks } from '@/lib/cloudflare';

export async function generateStaticParams() {
  const blocks = await fetchNotionBlocks(pageId);

  // 개발 환경: placeholder 사용
  // 프로덕션: Cloudflare 업로드
  await processNotionBlocks(blocks);

  return { blocks };
}
```

개발 서버(`pnpm dev`)에서는 자동으로 Mock 모드로 동작합니다.

## 🏗️ 프로덕션 빌드 테스트

실제 Cloudflare 업로드를 테스트하려면:

### 1. 환경 변수 설정

`.env.local` 파일 생성:

```bash
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_ACCOUNT_HASH=your_account_hash
CLOUDFLARE_API_KEY=your_api_token
```

### 2. 프로덕션 빌드

```bash
pnpm build
```

빌드 중 이미지가 실제로 Cloudflare에 업로드됩니다.

### 3. 빌드 결과 확인

```bash
pnpm start
```

## 📚 더 자세한 정보

- **전체 가이드**: [CLOUDFLARE_IMAGES_SETUP.md](./CLOUDFLARE_IMAGES_SETUP.md)
- **개발 테스트**: [DEV_TESTING_GUIDE.md](./DEV_TESTING_GUIDE.md)
- **환경 설정**: `.env.local` 파일 참고

## ❓ 문제 해결

### Q: 이미지가 표시되지 않아요
A: `/placeholder-image.png` 파일이 `public/` 폴더에 있는지 확인하세요.

### Q: "Module not found" 에러가 나요
A: 개발 서버를 재시작해보세요 (`Ctrl+C` → `pnpm dev`)

### Q: 프로덕션 빌드가 실패해요
A: `.env.local` 파일의 Cloudflare 환경 변수를 확인하세요.

## 🎉 다음 단계

1. [components/notion-blocks/Image/Image.tsx](../components/notion-blocks/Image/Image.tsx) - Image 컴포넌트 구현 확인
2. [lib/cloudflare/dev-mock.ts](../lib/cloudflare/dev-mock.ts) - Mock 로직 커스터마이징
3. [app/test-image/page.tsx](../app/test-image/page.tsx) - 테스트 페이지 수정
