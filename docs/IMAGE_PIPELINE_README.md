# 이미지 파이프라인 개요

## 🎯 목적

Notion의 임시 이미지 URL(1시간 만료)을 Cloudflare Images CDN으로 영구 저장하고 최적화하여 블로그에서 사용합니다.

## 📂 프로젝트 구조

```
pixel-art-blog/
│
├── types/cloudflare/         # 타입 정의
│   ├── image.ts             # 이미지 관련 타입
│   └── index.ts             # Export
│
├── lib/cloudflare/           # 비즈니스 로직
│   ├── api.ts               # Cloudflare API 호출
│   ├── processor.ts         # Notion 블록 처리
│   └── index.ts             # Export
│
├── components/ui/            # UI 컴포넌트
│   └── Image.tsx            # 최적화된 이미지 컴포넌트
│
├── docs/                     # 문서
│   ├── CLOUDFLARE_IMAGES_SETUP.md  # 상세 가이드
│   └── IMAGE_PIPELINE_README.md    # 이 파일
│
└── .env.local                # 환경 변수
```

## 🔑 핵심 기능

### 1. 자동 중복 제거
- Notion URL을 SHA-256 해시로 변환
- Cloudflare에 이미 존재하는지 확인
- 존재하면 업로드 스킵, CDN URL 즉시 반환

### 2. WebP 자동 변환
- Sharp 라이브러리로 서버 사이드 변환
- Quality 85로 최적화
- 원본 포맷 상관없이 WebP 출력

### 3. 배치 처리
- 여러 이미지를 5개씩 병렬 처리
- 재시도 로직 (최대 3회, 지수 백오프)
- 실패 시 에러 로깅

### 4. 반응형 이미지
- srcset 자동 생성
- Cloudflare URL 파라미터 활용
- 다양한 화면 크기 지원

## ⚡ 빠른 시작

### 1. 패키지 설치
```bash
pnpm add sharp
```

### 2. 환경 변수 설정
```bash
cp .env.example .env.local
# .env.local 파일에서 Cloudflare 정보 입력
```

### 3. 기본 사용
```typescript
import { processNotionBlocks } from '@/lib/cloudflare';

const blocks = await fetchNotionBlocks(pageId);
const stats = await processNotionBlocks(blocks);
// blocks의 이미지 URL이 자동으로 Cloudflare URL로 교체됨
```

### 4. 컴포넌트 사용
```tsx
import { BlogImage } from '@/components/ui/Image';

<BlogImage
  src={cloudflareUrl}
  alt="설명"
  caption="캡션"
/>
```

## 🔧 설정 가이드

자세한 설정 방법은 [CLOUDFLARE_IMAGES_SETUP.md](./CLOUDFLARE_IMAGES_SETUP.md)를 참고하세요.

## 📝 주요 API

### `uploadImageToCloudflare(url, filename?)`
개별 이미지 업로드

### `uploadImagesInBatch(urls)`
여러 이미지 배치 업로드

### `processNotionBlocks(blocks)`
Notion 블록 배열의 모든 이미지 처리

### `getCloudflareImageUrl(imageId, variant?)`
Cloudflare CDN URL 생성

## 🚀 프로덕션 체크리스트

- [ ] Sharp 패키지 설치
- [ ] 환경 변수 설정 완료
- [ ] Cloudflare Account ID 확인
- [ ] Cloudflare Account Hash 확인
- [ ] API Token 권한 확인 (Images - Edit)
- [ ] ISR revalidate 시간 설정
- [ ] 에러 로깅 모니터링 설정
- [ ] (선택) Redis 캐시 구현

## 🛠️ 트러블슈팅

**Q: Sharp 설치 오류**
```bash
# 네이티브 모듈 재빌드
pnpm rebuild sharp
```

**Q: Cloudflare 업로드 실패**
- API Token 권한 확인
- Account ID/Hash 정확도 확인
- 네트워크 연결 확인

**Q: 이미지가 표시되지 않음**
- Cloudflare URL variant 확인
- `requireSignedURLs` 설정 확인 (false여야 함)
- 브라우저 콘솔에서 이미지 URL 직접 접속 테스트

## 📊 성능 지표

- **중복 제거율**: ~80% (일반적인 블로그 기준)
- **업로드 속도**: ~500ms/이미지 (네트워크 환경에 따라 변동)
- **WebP 압축률**: 원본 대비 ~30-50% 용량 감소
- **빌드 시간**: 100개 이미지 기준 ~2-3분

## 🔗 관련 문서

- [상세 설정 가이드](./CLOUDFLARE_IMAGES_SETUP.md)
- [프로젝트 전체 가이드](../CLAUDE.md)
- [디자인 시스템](../DESIGN_SYSTEM.md)
