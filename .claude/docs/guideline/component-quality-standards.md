# Notion Block Component Quality Standards

## 목적

이 문서는 모든 Notion 블록 컴포넌트가 일관성과 완성도를 유지하기 위한 최소 기준과 체크리스트를 제공합니다.

---

## 1. 타입 시스템 기준

### 1.1 타입 정의 위치

- ✅ **MUST**: 모든 Block 타입은 `types/notion/content/block.ts`에 정의
- ✅ **MUST**: 컴포넌트 Props는 각 컴포넌트의 `index.ts`에 정의
- ❌ **MUST NOT**: 컴포넌트 폴더 내에 별도 `types.ts` 파일 생성 금지

### 1.2 Props 인터페이스 패턴

```typescript
// ✅ CORRECT: Block 기반 패턴
export interface ComponentProps {
  block: ComponentBlock;
  children?: React.ReactNode;
  // 추가 props (예: index, className 등)
}

// ❌ WRONG: 개별 필드 기반 패턴
export interface ComponentProps {
  richText: RichText[];
  color?: string;
  // ...
}
```

### 1.3 타입 Import 패턴

```typescript
// ✅ CORRECT
import type { ComponentBlock } from '@/types/notion';
import type { ComponentProps } from './index';

// ❌ WRONG
import type { ComponentProps } from './types';
```

---

## 2. 컴포넌트 구조 기준

### 2.1 필수 파일 구조

```
ComponentName/
├── ComponentName.tsx        # 컴포넌트 구현
├── ComponentName.test.tsx   # 테스트 (최소 5개)
├── ComponentName.stories.tsx # Storybook (최소 2개)
└── index.ts                 # Export 및 Props 정의
```

### 2.2 컴포넌트 구현 패턴

```typescript
import { renderRichText } from '@/lib/notion/rich-text-renderer';
import { getColorClass } from '@/lib/notion/color-utils'; // 통합된 유틸
import type { ComponentProps } from './index';

export function ComponentName({ block, children }: ComponentProps) {
  const { rich_text, color } = block.component_name;
  const colorClass = getColorClass(color);

  return (
    <div className={colorClass}>
      {renderRichText(rich_text)}
      {children}
    </div>
  );
}
```

---

## 3. 색상 처리 기준

### 3.1 통합 Color 유틸리티 사용

- ✅ **MUST**: `lib/notion/color-utils.ts`의 `getColorClass()` 함수 사용
- ❌ **MUST NOT**: 컴포넌트 내부에 `colorMap` 중복 정의 금지

### 3.2 Color 유틸리티 구현 표준

```typescript
// lib/notion/color-utils.ts
export type NotionColorVariant = 'text' | 'background';

export function getColorClass(color: string, variant: NotionColorVariant = 'text'): string {
  // 통합 구현
}
```

### 3.3 적용 예시

```typescript
// ✅ CORRECT
import { getColorClass } from '@/lib/notion/color-utils';

const colorClass = getColorClass(color, 'background');

// ❌ WRONG
const colorMap: Record<string, string> = {
  gray: 'text-gray-600 dark:text-gray-400',
  // ...
};
```

---

## 4. RichText 렌더링 기준

### 4.1 통합 렌더러 사용

- ✅ **MUST**: `lib/notion/rich-text-renderer.tsx`의 `renderRichText()` 함수 사용
- ✅ **MUST**: RichText 배열을 직접 매핑하지 않고 유틸리티 사용

### 4.2 적용 예시

```typescript
// ✅ CORRECT
import { renderRichText } from '@/lib/notion/rich-text-renderer';

return <p>{renderRichText(rich_text)}</p>;

// ❌ WRONG
return (
  <p>
    {rich_text.map((item, i) => (
      <span key={i}>{item.plain_text}</span>
    ))}
  </p>
);
```

---

## 5. 재귀적 Children 처리 기준

### 5.1 Children 렌더링 패턴

```typescript
// ✅ CORRECT: children prop으로 외부에서 렌더링된 결과 받기
export function Component({ block, children }: ComponentProps) {
  return (
    <div>
      {renderRichText(block.component.rich_text)}
      {children && <div className="nested-content">{children}</div>}
    </div>
  );
}

// ❌ WRONG: has_children 체크는 불필요 (children prop이 있으면 표시)
{has_children && children && <div>{children}</div>}
```

### 5.2 중첩 컨테이너 스타일링 표준

```typescript
// List items
{children && <ul className="mt-2 space-y-2">{children}</ul>}
{children && <ol className="mt-2 space-y-2">{children}</ol>}

// Block-level nested content
{children && <div className="ml-6 mt-1 space-y-1">{children}</div>}
```

---

## 6. 상태 관리 기준

### 6.1 Client Component 지정

- ✅ **MUST**: 인터랙션이 있는 컴포넌트는 `'use client'` 선언
  - Toggle, Code (copy 버튼)
- ✅ **SHOULD**: 서버 컴포넌트가 가능한 경우 기본값 유지

### 6.2 useState 패턴

```typescript
'use client';

import { useState } from 'react';

export function InteractiveComponent({ block }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  // ...
}
```

---

## 7. 스타일링 기준

### 7.1 Tailwind 클래스 사용 원칙

- ✅ **MUST**: `cn()` 유틸리티로 조건부 클래스 결합
- ✅ **MUST**: DESIGN_SYSTEM.md의 색상, 간격, 타이포그래피 가이드 준수
- ❌ **MUST NOT**: 인라인 스타일 사용 금지

### 7.2 공통 스타일 패턴

```typescript
// Spacing
className = 'mb-4'; // Block bottom margin
className = 'my-6'; // Section vertical spacing
className = 'gap-3'; // Flex gap
className = 'mt-2 space-y-2'; // Nested list spacing

// Text
className = 'leading-relaxed'; // Body text
className = 'text-muted-foreground'; // Secondary text

// Interactive
className = 'transition-colors hover:bg-muted/50';
```

---

## 8. 테스트 기준

### 8.1 최소 테스트 케이스

모든 컴포넌트는 다음 테스트를 **반드시** 포함해야 합니다:

1. **기본 렌더링**: 기본 텍스트가 올바르게 표시되는가?
2. **Color 지원**: color prop이 적용되는가?
3. **RichText Annotations**: bold, italic 등이 작동하는가?
4. **Children 렌더링**: 중첩 콘텐츠가 표시되는가? (해당 시)
5. **Edge Cases**: 빈 rich_text 배열을 처리하는가?

### 8.2 타입별 Props 테스트 요구사항

모든 Block 타입이 가질 수 있는 props를 **전부** 테스트해야 합니다:

#### 8.2.1 공통 Block Properties (모든 타입)

모든 Block 타입은 다음 공통 필드를 가집니다:

- `id`: string
- `type`: BlockType
- `created_time`: string
- `last_edited_time`: string
- `created_by`: { id: string }
- `last_edited_by`: { id: string }
- `has_children`: boolean
- `archived`: boolean
- `in_trash`: boolean
- `parent`: Parent (page_id, database_id, block_id 등)

**테스트 권장사항**: 공통 필드는 렌더링에 영향을 주지 않으므로 테스트 필수는 아니지만, `has_children`과 `children` prop 조합은 반드시 테스트해야 합니다.

#### 8.2.2 타입별 특수 Properties

각 Block 타입은 고유한 필드를 가집니다. **해당 타입이 가진 모든 필드를 테스트**해야 합니다:

**ParagraphBlock**:

- `paragraph.rich_text`: RichText[]
- `paragraph.color`: Color

**HeadingBlock** (heading_1, heading_2, heading_3):

- `heading_1.rich_text`: RichText[]
- `heading_1.color`: Color
- `heading_1.is_toggleable`: boolean (현재 미구현이지만 타입에는 존재)

**BulletedListItemBlock**:

- `bulleted_list_item.rich_text`: RichText[]
- `bulleted_list_item.color`: Color

**NumberedListBlock**:

- `numbered_list_item.rich_text`: RichText[]
- `numbered_list_item.color`: Color

**ToDoBlock**:

- `to_do.rich_text`: RichText[]
- `to_do.color`: Color
- `to_do.checked`: boolean

**ToggleBlock**:

- `toggle.rich_text`: RichText[]
- `toggle.color`: Color (현재 미구현일 수 있음)

**CodeBlock**:

- `code.rich_text`: RichText[]
- `code.language`: string
- `code.caption`: RichText[]

**QuoteBlock**:

- `quote.rich_text`: RichText[]
- `quote.color`: Color

**CalloutBlock**:

- `callout.rich_text`: RichText[]
- `callout.color`: Color
- `callout.icon`: { type: 'emoji', emoji: string } | { type: 'external', external: { url: string } }

**DividerBlock**:

- 추가 속성 없음

**테스트 예시**:

```typescript
// ✅ CORRECT: 타입별 모든 속성 테스트
describe('Heading', () => {
  it('rich_text를 렌더링한다', () => {
    /* ... */
  });
  it('color를 적용한다', () => {
    /* ... */
  });
  it('is_toggleable이 true일 때 토글 기능을 제공한다', () => {
    /* ... */
  }); // 구현 시
});

describe('ToDo', () => {
  it('rich_text를 렌더링한다', () => {
    /* ... */
  });
  it('color를 적용한다', () => {
    /* ... */
  });
  it('checked가 true일 때 체크박스가 선택된다', () => {
    /* ... */
  });
  it('checked가 false일 때 체크박스가 선택 해제된다', () => {
    /* ... */
  });
});

describe('Callout', () => {
  it('rich_text를 렌더링한다', () => {
    /* ... */
  });
  it('color를 배경색으로 적용한다', () => {
    /* ... */
  });
  it('emoji 아이콘을 표시한다', () => {
    /* ... */
  });
  it('external 아이콘을 표시한다', () => {
    /* ... */
  }); // 구현 시
});
```

### 8.3 테스트 작성 패턴

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Component } from './Component';
import type { ComponentBlock } from '@/types/notion';

describe('Component', () => {
  it('기본 텍스트를 렌더링한다', () => {
    const block: ComponentBlock = {
      type: 'component',
      component: {
        rich_text: [/* ... */],
        color: 'default',
      },
    } as ComponentBlock;

    render(<Component block={block} />);
    expect(screen.getByText('...')).toBeInTheDocument();
  });
});
```

---

## 9. Storybook 기준

### 9.1 최소 Story 케이스

모든 컴포넌트는 다음 스토리를 **반드시** 포함해야 합니다:

1. **Default**: 기본 상태
2. **With Children**: 중첩 콘텐츠 포함 (해당 시)
3. **Color Variants**: 다양한 색상 적용
4. **Rich Text Annotations**: bold, italic, link 등 포함
5. **Edge Cases**: 빈 텍스트, 긴 텍스트 등

### 9.2 Story 작성 패턴

```typescript
import type { Meta, StoryObj } from '@storybook/nextjs';
import { Component } from './Component';
import type { ComponentBlock } from '@/types/notion';

const meta = {
  title: 'Notion Blocks/Component',
  component: Component,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    block: {
      type: 'component',
      component: {
        rich_text: [
          /* ... */
        ],
        color: 'default',
      },
    } as ComponentBlock,
  },
};
```

---

## 10. 특수 케이스 처리 기준

### 10.1 NumberedListItem - 순서 번호

- ✅ **MUST**: `index` prop을 받아서 `index + 1` 표시
- ✅ **MUST**: 픽셀 폰트 사용: `font-(family-name:--font-silkscreen) text-[10px]`

```typescript
export interface NumberedListItemProps {
  block: NumberedListBlock;
  children?: React.ReactNode;
  index?: number; // 필수
}

export function NumberedListItem({ block, children, index = 0 }: Props) {
  return (
    <li>
      <span className="font-(family-name:--font-silkscreen) text-[10px]">
        {index + 1}
      </span>
      {/* ... */}
    </li>
  );
}
```

### 10.2 BulletedListItem - PixelDot 아이콘

- ✅ **MUST**: `PixelDot` 아이콘 컴포넌트 사용
- ✅ **MUST**: 불투명도 적용: `text-muted-foreground/60`

```typescript
import { PixelDot } from '@/components/pixel-icons';

<PixelDot className="text-muted-foreground/60 mt-2 h-1.5 w-1.5 shrink-0" />
```

### 10.3 Code - 복사 버튼 & 줄 번호

- ✅ **MUST**: `'use client'` 선언
- ✅ **MUST**: 복사 버튼 구현 (clipboard API)
- ✅ **MUST**: 줄 번호 표시
- ✅ **MUST**: language 표시

### 10.4 Callout - 아이콘 지원

- ✅ **MUST**: `icon.emoji` 지원
- ✅ **SHOULD**: 향후 외부 이미지 아이콘 지원 준비

### 10.5 Toggle - 인터랙션

- ✅ **MUST**: `'use client'` 선언
- ✅ **MUST**: `useState`로 open/close 상태 관리
- ✅ **MUST**: 화살표 아이콘 회전 애니메이션

---

## 11. 컴포넌트 완성도 체크리스트

### Level 1: 최소 요구사항 (필수)

- [ ] `types/notion/content/block.ts`에 Block 타입 정의됨
- [ ] Block 기반 Props 패턴 사용
- [ ] `renderRichText()` 유틸리티 사용
- [ ] 5개 이상의 테스트 작성
- [ ] 2개 이상의 Storybook 스토리 작성
- [ ] 모든 테스트 통과

### Level 2: 표준 완성도 (권장)

- [ ] `getColorClass()` 통합 유틸리티 사용
- [ ] Color variants 테스트 포함
- [ ] RichText annotations 테스트 포함
- [ ] 접근성 고려 (semantic HTML, ARIA)
- [ ] DESIGN_SYSTEM.md 스타일 가이드 준수

### Level 3: 고급 완성도 (선택)

- [ ] Variant prop으로 스타일 변형 지원
- [ ] 모든 edge case 테스트 포함
- [ ] Storybook에 5개 이상의 스토리
- [ ] 인터랙션 테스트 (@testing-library/user-event)
- [ ] 성능 최적화 (memo, useMemo)

---

## 12. 리팩토링 우선순위

### 🔴 긴급 (일관성 문제)

1. **Color 처리 통합**: 모든 컴포넌트에서 `getColorClass()` 사용
2. **NumberedListItem index 전파**: 부모에서 index prop 전달하도록 수정

### 🟡 중요 (완성도 문제)

3. **Callout 외부 이미지 아이콘**: 현재 emoji만 지원, 외부 URL 지원 필요
4. **Code 언어별 syntax highlighting**: 현재 plain text만, 향후 shiki/prism 통합
5. **모든 컴포넌트 Storybook 확장**: color variants, annotations 등 추가

### 🟢 선택 (향상)

6. **Heading toggleable 지원**: Notion API의 `is_toggleable` 필드 처리
7. **성능 최적화**: 큰 문서에서 memo 적용
8. **애니메이션 개선**: Framer Motion 통합 고려

---

## 13. 새 컴포넌트 추가 시 체크리스트

새로운 Notion 블록 컴포넌트를 추가할 때:

### Phase 1: 타입 정의

- [ ] `types/notion/content/block.ts`에 Block 타입 추가
- [ ] Block union type에 추가
- [ ] 컴포넌트 `index.ts`에 Props 인터페이스 작성

### Phase 2: 구현

- [ ] 컴포넌트 파일 생성
- [ ] `renderRichText()` 사용
- [ ] `getColorClass()` 사용 (해당 시)
- [ ] children 지원 (해당 시)

### Phase 3: 테스트

- [ ] 최소 5개 테스트 작성
- [ ] 모든 테스트 통과
- [ ] Coverage 확인

### Phase 4: 문서화

- [ ] Storybook 스토리 작성 (최소 2개)
- [ ] 특수 케이스 문서화 (이 문서에 추가)

### Phase 5: 통합

- [ ] `components/notion-blocks/index.ts`에 export 추가
- [ ] BlockRenderer에 매핑 추가 (구현 시)

---

## 14. 참고 문서

- [DESIGN_SYSTEM.md](../../../DESIGN_SYSTEM.md): 스타일 가이드라인
- [notion-block-components.md](./notion-block-components.md): TDD 개발 가이드
- [GUIDELINE.md](./GUIDELINE.md): 전체 아키텍처 가이드

---

### 마지막 업데이트

- 작성일: 2026-01-14
- 작성자: Claude
- 버전: 1.1.0
