# Notion 블록 컴포넌트 개발 가이드

## 문서 목적

이 문서는 Notion API 블록을 React 컴포넌트로 렌더링하는 시스템 구축을 위한 전체 프로세스와 체크리스트를 제공합니다.

**핵심 원칙: TDD (Test-Driven Development)**

- 각 컴포넌트는 테스트 작성 → 구현 → 테스트 통과 사이클을 따릅니다
- 테스트가 통과할 때까지 반복적으로 수정합니다
- 모든 컴포넌트는 테스트와 스토리북을 함께 제공해야 합니다

---

## 전체 진행 과정

### Phase 0: 환경 설정 (사전 준비)

→ Phase 1: 공통 유틸리티 개발
→ Phase 2: 기본 블록 컴포넌트 개발
→ Phase 3: 고급 블록 컴포넌트 개발
→ Phase 4: BlockRenderer 통합
→ Phase 5: 실제 Notion API 연동 테스트

---

## Phase 0: 환경 설정

### 목표

개발에 필요한 도구 설치 및 설정 완료

### 작업 항목

#### 0.1 Storybook 설치 및 설정

- [ ] Storybook 설치 (`@storybook/nextjs`, `storybook`)
- [ ] Storybook 초기화
- [ ] Tailwind CSS Storybook 통합
- [ ] Pretendard 폰트 적용 확인
- [ ] 다크 모드 설정
- [ ] 첫 샘플 스토리 작성 및 동작 확인

**완료 기준:**

- `pnpm storybook` 실행 시 브라우저에서 정상 작동
- Tailwind CSS 스타일 적용 확인
- 다크/라이트 모드 전환 확인

#### 0.2 테스트 환경 설정

- [ ] Vitest 설치 및 설정
- [ ] React Testing Library 설치
- [ ] @testing-library/jest-dom 설치
- [ ] vitest.config.ts 생성
- [ ] test setup 파일 생성
- [ ] 첫 샘플 테스트 작성 및 통과 확인

**완료 기준:**

- `pnpm test` 실행 시 테스트 정상 실행
- TypeScript 타입 에러 없음
- 테스트 커버리지 리포트 생성 가능

#### 0.3 디렉토리 구조 생성

```bash
mkdir -p components/notion-blocks
mkdir -p lib/notion
touch components/notion-blocks/index.ts
touch lib/notion/index.ts
```

---

## Phase 1: 공통 유틸리티 개발

### 목표

모든 블록 컴포넌트에서 사용할 공통 유틸리티 개발

### 1.1 RichText 렌더링 헬퍼

**TDD 사이클:**

#### 단계 1: 테스트 작성

- [ ] `lib/notion/rich-text-renderer.test.tsx` 생성
- [ ] 기본 텍스트 렌더링 테스트
- [ ] Bold 스타일 테스트
- [ ] Italic 스타일 테스트
- [ ] Code 스타일 테스트
- [ ] 링크 렌더링 테스트
- [ ] 복합 스타일 테스트
- [ ] 빈 배열 처리 테스트

**테스트 실행:** `pnpm test rich-text-renderer`
→ **예상 결과:** 모두 실패 (Red)

#### 단계 2: 구현

- [ ] `lib/notion/rich-text-renderer.tsx` 생성
- [ ] RichText 타입 정의 확인 (types/notion.ts)
- [ ] renderRichText 함수 구현
  - [ ] 기본 텍스트 렌더링
  - [ ] annotations 처리 (bold, italic, strikethrough, underline, code)
  - [ ] color 처리
  - [ ] link 처리

**테스트 실행:** `pnpm test rich-text-renderer`
→ **목표:** 모든 테스트 통과 (Green)

#### 단계 3: 리팩토링

- [ ] 중복 코드 제거
- [ ] 타입 안정성 개선
- [ ] 성능 최적화 (필요시)

**테스트 실행:** `pnpm test rich-text-renderer`
→ **확인:** 여전히 모든 테스트 통과

#### 단계 4: 스토리북

- [ ] `lib/notion/rich-text-renderer.stories.tsx` 생성
- [ ] 다양한 스타일 조합 스토리 작성

**완료 기준:**
✅ 모든 테스트 통과
✅ Storybook에서 시각적 확인 완료
✅ 타입 에러 없음

---

## Phase 2: 기본 블록 컴포넌트 개발

### 개발 순서

1. Paragraph
2. Heading (h1, h2, h3)
3. BulletedListItem
4. NumberedListItem
5. Code
6. Callout

### 각 컴포넌트별 TDD 사이클

> **중요:** 한 컴포넌트를 완전히 완성하고 테스트를 통과한 후 다음 컴포넌트로 진행합니다.

---

### 2.1 Paragraph 컴포넌트

#### 단계 1: 테스트 작성 (Red)

- [ ] `components/notion-blocks/Paragraph/Paragraph.test.tsx` 생성
- [ ] 테스트 케이스 작성:
  ```typescript
  describe('Paragraph', () => {
    it('renders plain text');
    it('renders with bold annotation');
    it('renders with italic annotation');
    it('renders with code annotation');
    it('renders with link');
    it('handles empty rich_text array');
    it('applies correct color class');
  });
  ```

**테스트 실행:** `pnpm test Paragraph`
→ **예상 결과:** 모두 실패 (컴포넌트 미구현)

#### 단계 2: 타입 정의

- [ ] `components/notion-blocks/Paragraph/types.ts` 생성
- [ ] ParagraphProps 인터페이스 정의
- [ ] Notion API의 paragraph 블록 타입 참고

#### 단계 3: 컴포넌트 구현 (Green)

- [ ] `components/notion-blocks/Paragraph/Paragraph.tsx` 생성
- [ ] Props 타입 정의 import
- [ ] RichText 렌더링 헬퍼 사용
- [ ] 기본 구조 작성
- [ ] 스타일 적용 (Tailwind CSS)

**테스트 실행:** `pnpm test Paragraph`
→ **목표:** 모든 테스트 통과

**통과하지 않으면:**

- [ ] 실패한 테스트 확인
- [ ] 코드 수정
- [ ] 다시 테스트 실행
- [ ] 모든 테스트 통과할 때까지 반복

#### 단계 4: 리팩토링 (Refactor)

- [ ] 코드 정리
- [ ] 중복 제거
- [ ] 접근성 개선 (semantic HTML)

**테스트 실행:** `pnpm test Paragraph`
→ **확인:** 여전히 모든 테스트 통과

#### 단계 5: 스토리북 작성

- [ ] `components/notion-blocks/Paragraph/Paragraph.stories.tsx` 생성
- [ ] 스토리 작성:
  - Default (기본 텍스트)
  - WithBold
  - WithItalic
  - WithCode
  - WithLink
  - WithMultipleStyles
  - WithColor
  - Empty

**확인:** `pnpm storybook` 실행 후 모든 스토리 시각적 검증

#### 단계 6: Export

- [ ] `components/notion-blocks/Paragraph/index.ts` 생성
- [ ] 컴포넌트 및 타입 export
- [ ] `components/notion-blocks/index.ts`에 추가

**체크리스트:**

- [x] 테스트 작성 완료
- [x] 모든 테스트 통과
- [x] 컴포넌트 구현 완료
- [x] 스토리북 작성 완료
- [x] Export 완료
- [x] ESLint 에러 없음
- [x] TypeScript 에러 없음

**완료 기준:**
✅ `pnpm test Paragraph` 모두 통과
✅ `pnpm lint` 에러 없음
✅ Storybook에서 모든 상태 확인 완료

---

### 2.2 Heading 컴포넌트

#### 단계 1: 테스트 작성 (Red)

- [ ] `components/notion-blocks/Heading/Heading.test.tsx` 생성
- [ ] 테스트 케이스:
  ```typescript
  describe('Heading', () => {
    it('renders h1 for heading_1');
    it('renders h2 for heading_2');
    it('renders h3 for heading_3');
    it('applies correct font sizes');
    it('renders rich text with styles');
    it('handles empty rich_text');
  });
  ```

**테스트 실행:** `pnpm test Heading`
→ **예상 결과:** 모두 실패

#### 단계 2-6: 위와 동일한 TDD 사이클 반복

**체크리스트:**

- [ ] 테스트 작성 완료
- [ ] 모든 테스트 통과
- [ ] 컴포넌트 구현 완료
- [ ] 스토리북 작성 완료
- [ ] Export 완료

---

### 2.3 BulletedListItem 컴포넌트

#### TDD 사이클 체크리스트

- [ ] 테스트 작성 (Red)
- [ ] 타입 정의
- [ ] 컴포넌트 구현 (Green)
- [ ] 테스트 통과 확인
- [ ] 리팩토링 (Refactor)
- [ ] 테스트 재확인
- [ ] 스토리북 작성
- [ ] Export

**특별 고려사항:**

- [ ] has_children 처리 (재귀 렌더링 준비)
- [ ] 중첩 리스트 스타일

---

### 2.4 NumberedListItem 컴포넌트

#### TDD 사이클 체크리스트

- [ ] 테스트 작성 (Red)
- [ ] 타입 정의
- [ ] 컴포넌트 구현 (Green)
- [ ] 테스트 통과 확인
- [ ] 리팩토링 (Refactor)
- [ ] 테스트 재확인
- [ ] 스토리북 작성
- [ ] Export

**특별 고려사항:**

- [ ] 번호 매기기 처리
- [ ] 중첩 리스트 스타일

---

### 2.5 Code 컴포넌트

#### TDD 사이클 체크리스트

- [ ] 테스트 작성 (Red)
  - 언어 표시
  - 코드 하이라이팅 (선택적)
  - 복사 버튼 (선택적)
- [ ] 타입 정의
- [ ] 컴포넌트 구현 (Green)
- [ ] 테스트 통과 확인
- [ ] 리팩토링
- [ ] 스토리북 작성
- [ ] Export

**특별 고려사항:**

- [ ] 코드 스타일 (monospace, 배경색)
- [ ] 스크롤 처리 (긴 코드)
- [ ] 다크 모드 대응

---

### 2.6 Callout 컴포넌트

#### TDD 사이클 체크리스트

- [ ] 테스트 작성 (Red)
- [ ] 타입 정의
- [ ] 컴포넌트 구현 (Green)
- [ ] 테스트 통과 확인
- [ ] 리팩토링
- [ ] 스토리북 작성
- [ ] Export

**특별 고려사항:**

- [ ] 아이콘 처리 (emoji)
- [ ] 배경색 처리
- [ ] has_children 처리

---

## Phase 3: 고급 블록 컴포넌트 개발

### 3.1 Image 컴포넌트

#### TDD 사이클 체크리스트

- [ ] 테스트 작성 (Red)
  - 외부 URL 렌더링
  - 로컬 이미지 렌더링
  - caption 처리
  - 로딩 상태
  - 에러 처리
- [ ] 타입 정의
- [ ] 컴포넌트 구현 (Green)
  - Next.js Image 컴포넌트 사용
  - responsive 처리
- [ ] 테스트 통과 확인
- [ ] 리팩토링
- [ ] 스토리북 작성
- [ ] Export

**특별 고려사항:**

- [ ] Next.js Image 최적화
- [ ] caption 렌더링
- [ ] 반응형 처리
- [ ] 로딩/에러 상태 UI

---

### 3.2 Quote 컴포넌트

#### TDD 사이클 체크리스트

- [ ] 테스트 작성
- [ ] 컴포넌트 구현
- [ ] 테스트 통과
- [ ] 스토리북 작성

---

### 3.3 Divider 컴포넌트

#### TDD 사이클 체크리스트

- [ ] 테스트 작성
- [ ] 컴포넌트 구현
- [ ] 테스트 통과
- [ ] 스토리북 작성

---

### 3.4 Toggle 컴포넌트

#### TDD 사이클 체크리스트

- [ ] 테스트 작성 (상태 관리 포함)
- [ ] 컴포넌트 구현
- [ ] 테스트 통과
- [ ] 스토리북 작성 (열림/닫힘 상태)

**특별 고려사항:**

- [ ] 클라이언트 컴포넌트 ('use client')
- [ ] 상태 관리 (useState)
- [ ] 애니메이션 (선택적)

---

## Phase 4: BlockRenderer 통합

### 목표

모든 블록 컴포넌트를 재귀적으로 렌더링하는 통합 컴포넌트 개발

### 4.1 BlockRenderer 컴포넌트

#### 단계 1: 테스트 작성 (Red)

- [ ] `components/notion-blocks/BlockRenderer.test.tsx` 생성
- [ ] 테스트 케이스:
  ```typescript
  describe('BlockRenderer', () => {
    it('renders paragraph block');
    it('renders heading blocks');
    it('renders unsupported block with fallback');
    it('recursively renders children blocks');
    it('handles empty children array');
    it('renders multiple blocks in sequence');
  });
  ```

**테스트 실행:** `pnpm test BlockRenderer`
→ **예상 결과:** 모두 실패

#### 단계 2: 구현

- [ ] `components/notion-blocks/BlockRenderer.tsx` 생성
- [ ] 블록 타입별 컴포넌트 매핑 로직
- [ ] 재귀 렌더링 처리
- [ ] 지원하지 않는 블록 fallback UI

**구현 예시:**

```typescript
function BlockRenderer({ block, children }: BlockRendererProps) {
  switch (block.type) {
    case 'paragraph':
      return <Paragraph block={block} />;
    case 'heading_1':
    case 'heading_2':
    case 'heading_3':
      return <Heading block={block} />;
    // ... 다른 블록들
    default:
      console.warn(`Unsupported block type: ${block.type}`);
      return <UnsupportedBlock type={block.type} />;
  }
}
```

**테스트 실행:** `pnpm test BlockRenderer`
→ **목표:** 모든 테스트 통과

#### 단계 3: 재귀 처리 구현

- [ ] has_children 처리
- [ ] children 블록 재귀 렌더링
- [ ] 중첩 레벨 제한 (스택 오버플로우 방지)

**테스트 실행:** `pnpm test BlockRenderer`
→ **확인:** 재귀 테스트 포함 모두 통과

#### 단계 4: 스토리북

- [ ] `BlockRenderer.stories.tsx` 생성
- [ ] 다양한 블록 조합 스토리
- [ ] 중첩 블록 스토리
- [ ] 전체 페이지 렌더링 시뮬레이션

**체크리스트:**

- [ ] 모든 테스트 통과
- [ ] 재귀 렌더링 정상 작동
- [ ] Fallback UI 확인
- [ ] 스토리북 시각적 검증 완료

---

## Phase 5: 실제 Notion API 연동 테스트

### 5.1 Notion API 호출 함수 구현

- [ ] `lib/notion/api.ts` 생성
- [ ] getPage 함수 구현
- [ ] getBlocks 함수 구현
- [ ] 환경 변수 확인 (NOTION_API_KEY, NOTION_DATABASE_ID)

### 5.2 통합 테스트

- [ ] 실제 Notion 페이지에서 데이터 가져오기
- [ ] BlockRenderer로 렌더링
- [ ] 모든 블록 타입 정상 렌더링 확인
- [ ] 스타일 확인
- [ ] 다크 모드 확인

### 5.3 에러 처리

- [ ] API 호출 실패 처리
- [ ] 네트워크 에러 처리
- [ ] 잘못된 데이터 형식 처리
- [ ] 로딩 상태 UI
- [ ] 에러 상태 UI

---

## TDD 사이클 상세 가이드

### Red-Green-Refactor 사이클

```
1. RED (실패하는 테스트 작성)
   ├─ 요구사항 분석
   ├─ 테스트 케이스 작성
   ├─ 테스트 실행 → 실패 확인
   └─ 실패 이유 명확히 파악

2. GREEN (테스트 통과시키기)
   ├─ 최소한의 코드로 구현
   ├─ 테스트 실행 → 통과 확인
   └─ 모든 테스트 통과까지 반복

3. REFACTOR (코드 개선)
   ├─ 중복 제거
   ├─ 가독성 개선
   ├─ 성능 최적화
   ├─ 테스트 실행 → 여전히 통과 확인
   └─ 타입 안정성 개선
```

### 각 컴포넌트별 필수 체크포인트

**테스트 작성 시:**

- [ ] 정상 케이스
- [ ] 경계 케이스 (빈 데이터, null, undefined)
- [ ] 에러 케이스
- [ ] 다양한 스타일 조합
- [ ] 접근성 (a11y)

**구현 시:**

- [ ] TypeScript 타입 안정성
- [ ] Props validation
- [ ] 에러 처리
- [ ] 접근성 (semantic HTML, ARIA)

**테스트 통과 기준:**

- [ ] `pnpm test [컴포넌트명]` 모두 통과
- [ ] 커버리지 80% 이상
- [ ] TypeScript 에러 없음
- [ ] ESLint 에러 없음

---

## 진행 상황 추적

### 전체 진행률

- [ ] Phase 0: 환경 설정 (0/3)
- [ ] Phase 1: 공통 유틸리티 (0/1)
- [ ] Phase 2: 기본 블록 (0/6)
- [ ] Phase 3: 고급 블록 (0/4)
- [ ] Phase 4: BlockRenderer (0/1)
- [ ] Phase 5: API 연동 (0/3)

### 완료된 컴포넌트

- [ ] RichText 렌더링 헬퍼
- [ ] Paragraph
- [ ] Heading
- [ ] BulletedListItem
- [ ] NumberedListItem
- [ ] Code
- [ ] Callout
- [ ] Image
- [ ] Quote
- [ ] Divider
- [ ] Toggle
- [ ] BlockRenderer

---

## 참고 자료

- [Notion API Documentation](https://developers.notion.com)
- [Notion Block Types](https://developers.notion.com/reference/block)
- [GUIDELINE.md](../../../GUIDELINE.md) - 프로젝트 설계 철학
- [Vitest Documentation](https://vitest.dev)
- [React Testing Library](https://testing-library.com/react)
- [Storybook Documentation](https://storybook.js.org)

---

## 주의사항

### 반드시 지켜야 할 원칙

1. **TDD 사이클 엄수**
   - 테스트 없는 코드 작성 금지
   - 테스트 통과 전 다음 단계 진행 금지

2. **한 번에 하나의 컴포넌트**
   - 현재 컴포넌트 완성 후 다음 진행
   - 여러 컴포넌트 동시 작업 금지

3. **마크다운 변환 금지**
   - Notion 블록을 직접 React로 변환
   - 중간 마크다운 변환 단계 없음

4. **타입 안정성**
   - any 타입 사용 금지
   - 모든 Props에 명확한 타입 정의

5. **문서화**
   - 각 컴포넌트에 JSDoc 주석
   - 복잡한 로직은 주석 설명
   - 스토리북으로 사용 예시 제공

---

**이 문서는 작업 진행 중 지속적으로 업데이트됩니다.**
