# AGENTS.md

이 파일은 AI 코딩 에이전트를 위한 프로젝트 가이드입니다. 이 저장소에서 작업할 때 반드시 따라야 할 명령어, 코드 스타일, 규칙을 정의합니다.

---

## 📦 프로젝트 개요

**Pixel Art Blog** - Next.js 16 기반의 개인 블로그 프로젝트

- Notion을 CMS로 사용 (계획)
- 레트로 픽셀 + 모던 디자인 융합
- SEO 최적화된 정적/ISR 페이지
- Vercel 무료 호스팅 (제로 비용)

**핵심 원칙:**

- 픽셀/도트 요소는 **악센트만** (15-20% 비주얼 비중)
- 모던 디자인이 **주축** (80-85% 비주얼 비중)
- 가독성 > 미학
- 픽셀 폰트(Silkscreen)는 라벨, 배지, 작은 헤딩에만 사용. **본문/아티클에 절대 사용 금지**

---

## 🛠️ 개발 명령어

### 필수 명령어

```bash
# 개발 서버 시작 (포트 3000)
pnpm dev

# 프로덕션 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start

# 린트 검사
pnpm lint

# 린트 자동 수정
pnpm lint:fix

# 코드 포맷팅
pnpm format

# 포맷 검사만
pnpm format:check
```

### 테스트 명령어

```bash
# 모든 테스트 실행
pnpm test

# 특정 파일 테스트
pnpm test Paragraph

# UI 모드로 테스트
pnpm test:ui

# 커버리지 리포트 생성
pnpm test:coverage

# Watch 모드
pnpm test -- --watch
```

### Storybook

```bash
# Storybook 개발 서버 (포트 6006)
pnpm storybook

# Storybook 빌드
pnpm build-storybook
```

---

## 📁 프로젝트 구조

```
app/                      # Next.js App Router 페이지
├── layout.tsx           # 루트 레이아웃 (폰트 설정)
├── page.tsx             # 홈 페이지
├── posts/               # 블로그 포스트
│   ├── page.tsx        # 포스트 목록
│   └── [slug]/page.tsx # 개별 포스트 (centered reading layout)
└── about/page.tsx       # 소개 페이지

components/              # React 컴포넌트
├── latouts/            # 레이아웃 컴포넌트 (header, footer, sidebar)
├── ui/                 # UI 컴포넌트 (post-card, pixel-icons, dot-decoration)
├── notion-blocks/      # Notion 블록 컴포넌트 (TDD 방식)
│   ├── Paragraph/      # 각 블록은 자체 폴더에 .tsx, .test.tsx, .stories.tsx 포함
│   ├── Heading/
│   ├── Code/
│   └── BlockRenderer/  # 블록 타입을 컴포넌트에 매핑
└── theme-provider.tsx  # 다크 모드 provider

lib/                     # 유틸리티 및 헬퍼
├── utils.ts            # cn() 헬퍼, 유틸 함수들
├── notion/             # Notion API 통합
└── demo-posts.ts       # 데모 콘텐츠 데이터
```

---

## 🎨 코드 스타일 가이드

### Import 규칙

```typescript
// 1. React/Next.js imports
import { ReactNode } from 'react';
import Link from 'next/link';

// 2. Third-party libraries
import { clsx } from 'clsx';

// 3. @/ imports (internal)
import { cn } from '@/lib/utils';
import type { PostCardProps } from '@/types/notion';

// 4. Relative imports (피할 것 - eslint 경고)
// import { Button } from '../ui/button'; // ❌ 사용 금지
```

**중요:** 절대 경로 `@/`를 사용하세요. 상대 경로는 피하세요.

### TypeScript 스타일

```typescript
// ✅ 명시적 타입 정의
export interface ButtonProps {
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

// ✅ Props 인터페이스와 함께 export
export function Button({ variant = 'default', size = 'md', children }: ButtonProps) {
  // ...
}

// ⚠️ any 사용 지양 (경고 발생)
// const data: any = fetchData(); // 가능한 한 타입 정의

// ✅ 함수형 컴포넌트 사용
export function MyComponent() {
  return <div>Hello</div>;
}
```

### Tailwind CSS 스타일링

```typescript
import { cn } from '@/lib/utils';

// ✅ cn() 유틸 사용 (조건부 클래스)
<div className={cn(
  "base-class",
  variant === "primary" && "bg-primary",
  isActive && "border-accent"
)} />

// ✅ 카드 hover 패턴
<div className="transition-all duration-300 hover:border-muted-foreground/30" />

// ✅ 아이콘 + 텍스트 간격
<div className="flex items-center gap-2" />

// ✅ 픽셀 아이콘 크기
<PixelIcon className="h-4 w-4" />  // 표준 (네비게이션/버튼)
<PixelIcon className="h-3 w-3" />  // 작게 (메타데이터)
<PixelIcon className="h-2 w-2" />  // 장식용 도트

// ❌ rounded-none 사용 금지 - 항상 약간의 라운딩 유지
<div className="rounded-xl" />  // ✅ 올바름
```

### 픽셀 폰트 사용법

```typescript
// ✅ 올바른 픽셀 폰트 적용
<span className="font-[family-name:var(--font-silkscreen)] text-xs tracking-wider">
  LABEL
</span>

// 사용 가능: 라벨, 배지, 네비게이션 항목, 작은 섹션 헤더
// 사용 금지: 본문 텍스트, 아티클, 긴 콘텐츠, 메인 헤딩
```

### 컴포넌트 구조

```typescript
// ✅ 표준 컴포넌트 템플릿
import type { ComponentProps } from './index';

/**
 * 컴포넌트 설명 (JSDoc)
 *
 * @param props - 속성 설명
 */
export function MyComponent({ prop1, prop2 }: ComponentProps) {
  // 로직

  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Error Handling

```typescript
// ✅ try-catch로 에러 처리
try {
  const data = await fetchData();
  return data;
} catch (error) {
  console.error('Failed to fetch data:', error);
  return fallbackData;
}

// ✅ Optional chaining 사용
const value = obj?.nested?.property ?? 'default';
```

---

## 🧪 테스트 가이드 (TDD)

### Notion Block Component 개발 프로세스

**반드시 TDD 방식으로 개발하세요:**

1. **테스트 작성** (`Component.test.tsx`)
2. **컴포넌트 구현** (`Component.tsx`)
3. **Storybook 스토리 작성** (`Component.stories.tsx`)
4. **한 컴포넌트 완전히 완료 후 다음으로 이동**

자세한 내용은 [.claude/docs/guideline/notion-block-components.md](.claude/docs/guideline/notion-block-components.md) 참조.

### 테스트 작성 패턴

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles props correctly', () => {
    render(<MyComponent variant="primary" />);
    expect(screen.getByRole('button')).toHaveClass('bg-primary');
  });
});
```

---

## 🚨 중요 규칙

### 절대 하지 말아야 할 것

1. **Notion 콘텐츠를 Markdown으로 변환하지 마세요** - 구조를 보존하고 커스텀 렌더링을 허용합니다
2. **긴 콘텐츠에 픽셀 폰트 사용 금지** - 가독성 우선
3. **무작위 장식 요소 추가 금지** - 15-20% 비주얼 비중 규칙 준수
4. **컴포넌트에서 Math.random() 사용 금지** - hydration 에러 발생
5. **과도한 엔지니어링 지양** - 단순함 > 조기 추상화
6. **정당한 이유 없이 하위 호환성 훼손 금지**

### 디자인 시스템 준수

- **컬러**: `oklch(lightness 0 0)` 사용 (순수 무채색)
- **레이아웃**:
  - Wide: `max-w-6xl` (홈, 목록, 카드 그리드)
  - Reading: `max-w-2xl` (아티클 콘텐츠, 중앙 정렬)
- **간격**: `px-6` (수평), `py-16` (섹션), `gap-6` (카드 그리드)
- **카드**: `rounded-xl`, `border border-border`, hover 트랜지션
- **라이트/다크 모드 모두 테스트**

자세한 내용은 [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) 참조.

---

## 🔧 설정 파일

- **TypeScript**: `tsconfig.json` - strict mode, `@/` 경로 별칭
- **ESLint**: `eslint.config.mjs` - TypeScript, Next.js, Prettier 통합
- **Prettier**: `.prettierrc` - 세미콜론, 작은따옴표, 120 printWidth
- **Vitest**: `vitest.config.ts` - jsdom 환경, `@/` 별칭

---

## 📚 추가 문서

- **전체 가이드**: [CLAUDE.md](CLAUDE.md)
- **Notion 통합**: [.claude/docs/guideline/GUIDELINE.md](.claude/docs/guideline/GUIDELINE.md)
- **디자인 시스템**: [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)
- **TDD 워크플로우**: [.claude/docs/guideline/notion-block-components.md](.claude/docs/guideline/notion-block-components.md)

---

**작업 시작 전 체크리스트:**

- [ ] `pnpm dev` 실행 확인
- [ ] 관련 문서 읽기 (CLAUDE.md, DESIGN_SYSTEM.md)
- [ ] TDD 방식 준수 (테스트 → 구현 → 스토리)
- [ ] 픽셀 폰트 사용 규칙 확인
- [ ] 라이트/다크 모드 모두 테스트
- [ ] `pnpm lint` 및 `pnpm format` 실행

**완료 전 체크리스트:**

- [ ] `pnpm test` 통과
- [ ] `pnpm lint` 통과
- [ ] `pnpm build` 성공
- [ ] Storybook 스토리 추가 (새 컴포넌트인 경우)
- [ ] 라이트/다크 모드 동작 확인
