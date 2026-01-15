# Notion Block Integration Test Plan

## 목적

이 문서는 Notion 블록 컴포넌트의 통합 테스트 계획을 제공합니다. 개별 컴포넌트 단위 테스트를 넘어서 실제 사용 시나리오를 검증하기 위한 두 가지 핵심 영역을 다룹니다.

---

## 1. 블록 중첩 통합 테스트 (Nested Block Integration Tests)

### 1.1 목적
- 실제 Notion 페이지처럼 여러 블록이 중첩된 구조를 검증
- 재귀적 children 렌더링이 올바르게 작동하는지 확인
- 다양한 블록 조합의 edge case 검증
- Storybook으로 시각적 회귀 테스트 지원

### 1.2 테스트 범위

#### Phase 1: 기본 중첩 시나리오
**목표**: 가장 흔한 중첩 패턴 검증

1. **List 중첩**
   - BulletedListItem 안에 BulletedListItem (2-3 depth)
   - NumberedListItem 안에 NumberedListItem (2-3 depth)
   - BulletedListItem 안에 NumberedListItem (혼합)
   - NumberedListItem 안에 BulletedListItem (혼합)
   - index prop이 각 depth에서 올바르게 전달되는지 확인

2. **Toggle 중첩**
   - Toggle 안에 Paragraph
   - Toggle 안에 BulletedList
   - Toggle 안에 Code
   - Toggle 안에 Toggle (2-3 depth)

3. **Callout 중첩**
   - Callout 안에 Paragraph
   - Callout 안에 BulletedList
   - Callout 안에 Code

#### Phase 2: 복잡한 중첩 시나리오
**목표**: 실제 문서에서 발생할 수 있는 복잡한 구조 검증

1. **다층 복합 구조**
   - Toggle > Callout > BulletedList > Paragraph
   - Callout > Toggle > NumberedList > Code
   - BulletedList > Toggle > Callout > Paragraph

2. **같은 타입 깊은 중첩**
   - BulletedList 5 depth
   - NumberedList 5 depth
   - Toggle 5 depth

3. **모든 블록 타입 조합**
   - 11개 블록 타입을 포함하는 복합 문서 구조
   - Heading > Paragraph > Quote > Code > Callout > BulletedList > NumberedList > Toggle > ToDo > Divider

#### Phase 3: Edge Cases
**목표**: 경계 상황 및 오류 처리 검증

1. **빈 콘텐츠 처리**
   - children은 있지만 rich_text가 빈 배열
   - rich_text는 있지만 children이 없음
   - 둘 다 빈 경우

2. **깊이 제한 테스트**
   - 10 depth 이상 중첩 (성능 확인)
   - 메모리 누수 확인

3. **스타일 충돌 테스트**
   - 부모-자식 모두 color가 다른 경우
   - 중첩된 리스트의 간격이 올바른지
   - Toggle 안에 Toggle이 중첩될 때 인덴트

### 1.3 파일 구조

```
components/notion-blocks/
├── __integration__/
│   ├── nested-blocks.test.tsx        # 중첩 블록 통합 테스트
│   ├── nested-blocks.stories.tsx     # Storybook 시각적 테스트
│   └── fixtures/
│       ├── simple-nested.ts          # Phase 1 fixture
│       ├── complex-nested.ts         # Phase 2 fixture
│       └── edge-cases.ts             # Phase 3 fixture
```

### 1.4 구현 예시

```typescript
// components/notion-blocks/__integration__/nested-blocks.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BlockRenderer } from '../BlockRenderer'; // 구현 필요
import { simpleBulletedListFixture } from './fixtures/simple-nested';

describe('Nested Blocks Integration', () => {
  describe('Phase 1: Basic Nesting', () => {
    describe('Bulleted List Nesting', () => {
      it('2 depth 중첩된 불릿 리스트를 렌더링한다', () => {
        const blocks = [
          {
            type: 'bulleted_list_item',
            bulleted_list_item: {
              rich_text: [{ type: 'text', text: { content: 'Parent 1' } }],
              color: 'default',
            },
            children: [
              {
                type: 'bulleted_list_item',
                bulleted_list_item: {
                  rich_text: [{ type: 'text', text: { content: 'Child 1-1' } }],
                  color: 'default',
                },
              },
            ],
          },
        ];

        render(<BlockRenderer blocks={blocks} />);

        expect(screen.getByText('Parent 1')).toBeInTheDocument();
        expect(screen.getByText('Child 1-1')).toBeInTheDocument();

        // 중첩 구조 확인
        const parentLi = screen.getByText('Parent 1').closest('li');
        const childUl = parentLi?.querySelector('ul');
        expect(childUl).toBeInTheDocument();
      });
    });

    describe('Numbered List Nesting', () => {
      it('index가 각 depth에서 올바르게 증가한다', () => {
        const blocks = [
          {
            type: 'numbered_list_item',
            numbered_list_item: {
              rich_text: [{ type: 'text', text: { content: 'First' } }],
            },
          },
          {
            type: 'numbered_list_item',
            numbered_list_item: {
              rich_text: [{ type: 'text', text: { content: 'Second' } }],
            },
            children: [
              {
                type: 'numbered_list_item',
                numbered_list_item: {
                  rich_text: [{ type: 'text', text: { content: 'Nested 1' } }],
                },
              },
              {
                type: 'numbered_list_item',
                numbered_list_item: {
                  rich_text: [{ type: 'text', text: { content: 'Nested 2' } }],
                },
              },
            ],
          },
        ];

        render(<BlockRenderer blocks={blocks} />);

        // 부모 레벨: 1, 2
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();

        // 자식 레벨: 1, 2 (새로 시작)
        const nestedNumbers = screen.getAllByText('1');
        expect(nestedNumbers).toHaveLength(2); // 부모의 1 + 자식의 1
      });
    });
  });
});
```

### 1.5 Storybook Stories 예시

```typescript
// components/notion-blocks/__integration__/nested-blocks.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { BlockRenderer } from '../BlockRenderer';

const meta = {
  title: 'Integration/Nested Blocks',
  component: BlockRenderer,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof BlockRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SimpleBulletedList: Story = {
  args: {
    blocks: [
      {
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{ type: 'text', text: { content: 'Parent item' } }],
          color: 'default',
        },
        children: [
          {
            type: 'bulleted_list_item',
            bulleted_list_item: {
              rich_text: [{ type: 'text', text: { content: 'Child item 1' } }],
              color: 'default',
            },
          },
          {
            type: 'bulleted_list_item',
            bulleted_list_item: {
              rich_text: [{ type: 'text', text: { content: 'Child item 2' } }],
              color: 'default',
            },
          },
        ],
      },
    ],
  },
};

export const ComplexNestedStructure: Story = {
  args: {
    blocks: [
      {
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: 'Complex Document Structure' } }],
        },
      },
      {
        type: 'callout',
        callout: {
          rich_text: [{ type: 'text', text: { content: 'Important information' } }],
          icon: { type: 'emoji', emoji: '💡' },
          color: 'blue_background',
        },
        children: [
          {
            type: 'toggle',
            toggle: {
              rich_text: [{ type: 'text', text: { content: 'Click to expand' } }],
            },
            children: [
              {
                type: 'bulleted_list_item',
                bulleted_list_item: {
                  rich_text: [{ type: 'text', text: { content: 'Nested bullet 1' } }],
                },
              },
              {
                type: 'bulleted_list_item',
                bulleted_list_item: {
                  rich_text: [{ type: 'text', text: { content: 'Nested bullet 2' } }],
                },
              },
            ],
          },
        ],
      },
    ],
  },
};

export const DeepNesting5Levels: Story = {
  name: '5 Depth Nested List',
  args: {
    blocks: [
      {
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{ type: 'text', text: { content: 'Level 1' } }],
        },
        children: [
          {
            type: 'bulleted_list_item',
            bulleted_list_item: {
              rich_text: [{ type: 'text', text: { content: 'Level 2' } }],
            },
            children: [
              {
                type: 'bulleted_list_item',
                bulleted_list_item: {
                  rich_text: [{ type: 'text', text: { content: 'Level 3' } }],
                },
                children: [
                  {
                    type: 'bulleted_list_item',
                    bulleted_list_item: {
                      rich_text: [{ type: 'text', text: { content: 'Level 4' } }],
                    },
                    children: [
                      {
                        type: 'bulleted_list_item',
                        bulleted_list_item: {
                          rich_text: [{ type: 'text', text: { content: 'Level 5' } }],
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};
```

### 1.6 테스트 체크리스트

#### Phase 1 (필수)
- [ ] BulletedListItem 2-3 depth 중첩
- [ ] NumberedListItem 2-3 depth 중첩 + index 검증
- [ ] Bulleted + Numbered 혼합 중첩
- [ ] Toggle > Paragraph/List/Code
- [ ] Callout > Paragraph/List/Code
- [ ] 각 시나리오별 Storybook story 작성

#### Phase 2 (권장)
- [ ] 다층 복합 구조 (4+ depth)
- [ ] 모든 블록 타입 조합 문서
- [ ] 깊은 중첩 (5+ depth)
- [ ] 복잡한 시나리오 Storybook story 작성

#### Phase 3 (선택)
- [ ] 빈 콘텐츠 edge case
- [ ] 10+ depth 성능 테스트
- [ ] 스타일 충돌 시나리오
- [ ] Edge case Storybook story 작성

---

## 2. Notion API 모킹 통합 테스트 (MSW Integration Tests)

### 2.1 목적
- Notion API 응답을 모킹하여 실제 API 호출 없이 테스트
- 데이터 fetching ~ 렌더링까지 전체 플로우 검증
- 에러 처리, 로딩 상태, 캐싱 동작 확인
- ISR(Incremental Static Regeneration) 동작 검증

### 2.2 테스트 범위

#### Phase 1: 기본 API 모킹
**목표**: Notion API의 핵심 엔드포인트 모킹

1. **Page 조회 API**
   - `GET /v1/pages/{page_id}`
   - 정상 응답
   - 404 Not Found
   - 401 Unauthorized
   - Rate limiting (429)

2. **Block Children 조회 API**
   - `GET /v1/blocks/{block_id}/children`
   - 정상 응답 (has_more: false)
   - 페이지네이션 (has_more: true)
   - 빈 결과
   - 에러 응답

3. **Database Query API**
   - `POST /v1/databases/{database_id}/query`
   - 블로그 포스트 목록 조회
   - 필터링 (published: true)
   - 정렬 (created_time desc)
   - 페이지네이션

#### Phase 2: 복잡한 시나리오
**목표**: 실제 사용 패턴과 동일한 복합 시나리오

1. **재귀적 Block 조회**
   - 블록에 children이 있을 때 재귀 호출
   - 깊이 제한 (max_depth: 5)
   - has_more: true일 때 페이지네이션 처리

2. **이미지 다운로드 & 캐싱**
   - Notion hosted 이미지 URL
   - 로컬 캐싱 (last_edited_time 기반)
   - 캐시 히트/미스 시나리오
   - 이미지 다운로드 실패 처리

3. **ISR 동작 검증**
   - revalidate 시간 경과 후 재생성
   - stale-while-revalidate 동작
   - On-demand revalidation

#### Phase 3: 에러 처리 & Edge Cases
**목표**: 예외 상황 및 복구 메커니즘 검증

1. **네트워크 에러**
   - Timeout
   - Connection refused
   - DNS resolution failure

2. **API 에러 응답**
   - Invalid request (400)
   - Unauthorized (401)
   - Forbidden (403)
   - Not found (404)
   - Rate limit (429) + Retry-After 헤더
   - Server error (500, 502, 503)

3. **데이터 불일치**
   - Block type이 unknown
   - Required 필드 누락
   - 타입 불일치

### 2.3 파일 구조

```
lib/notion/
├── __tests__/
│   ├── api.test.ts                   # API 레이어 단위 테스트
│   └── integration/
│       ├── page-fetch.test.tsx       # 페이지 조회 통합 테스트
│       ├── block-render.test.tsx     # 블록 렌더링 통합 테스트
│       ├── image-cache.test.ts       # 이미지 캐싱 테스트
│       └── error-handling.test.ts    # 에러 처리 테스트
├── __mocks__/
│   ├── handlers.ts                   # MSW 핸들러 정의
│   ├── fixtures/
│   │   ├── pages/                    # Page 응답 fixture
│   │   ├── blocks/                   # Block 응답 fixture
│   │   └── databases/                # Database 응답 fixture
│   └── server.ts                     # MSW 서버 설정
└── api.ts                            # Notion API 클라이언트 (구현 필요)
```

### 2.4 MSW Setup

```typescript
// lib/notion/__mocks__/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

// vitest.setup.ts에 추가
import { server } from './lib/notion/__mocks__/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### 2.5 구현 예시

```typescript
// lib/notion/__mocks__/handlers.ts
import { http, HttpResponse } from 'msw';
import { pageFixture } from './fixtures/pages/sample-page';
import { blockChildrenFixture } from './fixtures/blocks/sample-children';

const NOTION_API_BASE = 'https://api.notion.com/v1';

export const handlers = [
  // Page 조회
  http.get(`${NOTION_API_BASE}/pages/:pageId`, ({ params }) => {
    const { pageId } = params;

    if (pageId === 'not-found-page-id') {
      return HttpResponse.json(
        {
          object: 'error',
          status: 404,
          code: 'object_not_found',
          message: 'Could not find page with ID: not-found-page-id',
        },
        { status: 404 }
      );
    }

    return HttpResponse.json(pageFixture);
  }),

  // Block Children 조회
  http.get(`${NOTION_API_BASE}/blocks/:blockId/children`, ({ params, request }) => {
    const { blockId } = params;
    const url = new URL(request.url);
    const startCursor = url.searchParams.get('start_cursor');

    // 페이지네이션 테스트
    if (blockId === 'paginated-block-id') {
      if (!startCursor) {
        return HttpResponse.json({
          results: blockChildrenFixture.slice(0, 100),
          has_more: true,
          next_cursor: 'cursor-1',
        });
      } else {
        return HttpResponse.json({
          results: blockChildrenFixture.slice(100),
          has_more: false,
          next_cursor: null,
        });
      }
    }

    return HttpResponse.json({
      results: blockChildrenFixture,
      has_more: false,
      next_cursor: null,
    });
  }),

  // Database Query
  http.post(`${NOTION_API_BASE}/databases/:databaseId/query`, async ({ params, request }) => {
    const { databaseId } = params;
    const body = await request.json();

    // 필터링 & 정렬 시뮬레이션
    const { filter, sorts } = body;

    return HttpResponse.json({
      results: [/* filtered & sorted pages */],
      has_more: false,
      next_cursor: null,
    });
  }),

  // Rate Limiting 시뮬레이션
  http.get(`${NOTION_API_BASE}/pages/rate-limited-page-id`, () => {
    return HttpResponse.json(
      {
        object: 'error',
        status: 429,
        code: 'rate_limited',
        message: 'Rate limited',
      },
      {
        status: 429,
        headers: {
          'Retry-After': '60',
        },
      }
    );
  }),
];
```

```typescript
// lib/notion/__tests__/integration/page-fetch.test.tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { server } from '../../__mocks__/server';
import { http, HttpResponse } from 'msw';
import { NotionPageRenderer } from '@/components/notion/NotionPageRenderer'; // 구현 필요

describe('Notion Page Fetch Integration', () => {
  describe('Phase 1: Basic API Mocking', () => {
    it('페이지를 조회하고 렌더링한다', async () => {
      render(<NotionPageRenderer pageId="sample-page-id" />);

      // 로딩 상태
      expect(screen.getByText(/loading/i)).toBeInTheDocument();

      // 렌더링 완료
      await waitFor(() => {
        expect(screen.getByText('Sample Page Title')).toBeInTheDocument();
      });
    });

    it('404 에러를 처리한다', async () => {
      render(<NotionPageRenderer pageId="not-found-page-id" />);

      await waitFor(() => {
        expect(screen.getByText(/not found/i)).toBeInTheDocument();
      });
    });

    it('Rate limiting을 처리한다', async () => {
      render(<NotionPageRenderer pageId="rate-limited-page-id" />);

      await waitFor(() => {
        expect(screen.getByText(/rate limited/i)).toBeInTheDocument();
      });
    });
  });

  describe('Phase 2: Complex Scenarios', () => {
    it('재귀적으로 block children을 조회한다', async () => {
      const recursiveBlockFixture = {
        type: 'toggle',
        toggle: {
          rich_text: [{ type: 'text', text: { content: 'Parent Toggle' } }],
        },
        has_children: true,
      };

      server.use(
        http.get('https://api.notion.com/v1/blocks/recursive-block/children', () => {
          return HttpResponse.json({
            results: [
              {
                type: 'paragraph',
                paragraph: {
                  rich_text: [{ type: 'text', text: { content: 'Nested content' } }],
                },
              },
            ],
            has_more: false,
          });
        })
      );

      render(<NotionPageRenderer pageId="recursive-page-id" />);

      await waitFor(() => {
        expect(screen.getByText('Parent Toggle')).toBeInTheDocument();
        expect(screen.getByText('Nested content')).toBeInTheDocument();
      });
    });

    it('페이지네이션을 처리한다', async () => {
      render(<NotionPageRenderer pageId="paginated-page-id" />);

      // 100개 블록 + 추가 조회로 나머지 블록
      await waitFor(() => {
        const allParagraphs = screen.getAllByText(/Block \d+/);
        expect(allParagraphs.length).toBeGreaterThan(100);
      });
    });
  });

  describe('Phase 3: Error Handling', () => {
    it('네트워크 타임아웃을 처리한다', async () => {
      server.use(
        http.get('https://api.notion.com/v1/pages/timeout-page-id', async () => {
          await new Promise((resolve) => setTimeout(resolve, 10000)); // 타임아웃
        })
      );

      render(<NotionPageRenderer pageId="timeout-page-id" />);

      await waitFor(
        () => {
          expect(screen.getByText(/timeout/i)).toBeInTheDocument();
        },
        { timeout: 6000 }
      );
    });

    it('unknown block type을 gracefully 처리한다', async () => {
      server.use(
        http.get('https://api.notion.com/v1/blocks/unknown-type-block/children', () => {
          return HttpResponse.json({
            results: [
              {
                type: 'unsupported_block_type',
                unsupported_block_type: {},
              },
            ],
            has_more: false,
          });
        })
      );

      render(<NotionPageRenderer pageId="unknown-type-page-id" />);

      await waitFor(() => {
        // Unknown block은 스킵하거나 placeholder 표시
        expect(screen.queryByText(/unsupported/i)).toBeInTheDocument();
      });
    });
  });
});
```

### 2.6 Fixture 예시

```typescript
// lib/notion/__mocks__/fixtures/pages/sample-page.ts
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

export const pageFixture: PageObjectResponse = {
  object: 'page',
  id: 'sample-page-id',
  created_time: '2026-01-01T00:00:00.000Z',
  last_edited_time: '2026-01-14T00:00:00.000Z',
  created_by: { object: 'user', id: 'user-id' },
  last_edited_by: { object: 'user', id: 'user-id' },
  cover: null,
  icon: null,
  parent: {
    type: 'database_id',
    database_id: 'database-id',
  },
  archived: false,
  in_trash: false,
  properties: {
    title: {
      id: 'title',
      type: 'title',
      title: [
        {
          type: 'text',
          text: { content: 'Sample Page Title', link: null },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          plain_text: 'Sample Page Title',
          href: null,
        },
      ],
    },
  },
  url: 'https://notion.so/sample-page-id',
  public_url: null,
};
```

```typescript
// lib/notion/__mocks__/fixtures/blocks/sample-children.ts
import type { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

export const blockChildrenFixture: BlockObjectResponse[] = [
  {
    object: 'block',
    id: 'block-1',
    type: 'paragraph',
    paragraph: {
      rich_text: [
        {
          type: 'text',
          text: { content: 'This is a sample paragraph.', link: null },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          plain_text: 'This is a sample paragraph.',
          href: null,
        },
      ],
      color: 'default',
    },
    has_children: false,
    // ... other common fields
  },
  {
    object: 'block',
    id: 'block-2',
    type: 'heading_2',
    heading_2: {
      rich_text: [
        {
          type: 'text',
          text: { content: 'Section Heading', link: null },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          plain_text: 'Section Heading',
          href: null,
        },
      ],
      color: 'default',
      is_toggleable: false,
    },
    has_children: false,
    // ... other common fields
  },
  // ... more blocks
];
```

### 2.7 테스트 체크리스트

#### Phase 1 (필수)
- [ ] Page 조회 API 모킹
- [ ] Block Children 조회 API 모킹
- [ ] Database Query API 모킹
- [ ] 기본 에러 응답 (404, 401, 429)
- [ ] Fixture 파일 구조 생성

#### Phase 2 (권장)
- [ ] 재귀적 Block 조회 테스트
- [ ] 페이지네이션 처리 테스트
- [ ] 이미지 다운로드 & 캐싱 테스트
- [ ] ISR 동작 검증

#### Phase 3 (선택)
- [ ] 네트워크 에러 처리
- [ ] 다양한 API 에러 응답 (400, 403, 500 등)
- [ ] Unknown block type 처리
- [ ] 데이터 불일치 시나리오

---

## 3. 구현 우선순위

### 즉시 필요 (Immediate)
1. **BlockRenderer 컴포넌트 구현**
   - 모든 블록 타입을 받아서 적절한 컴포넌트로 렌더링
   - children 재귀 처리
   - 중첩 테스트의 전제 조건

2. **기본 Fixture 작성**
   - 각 블록 타입별 샘플 데이터
   - 중첩 구조 샘플 데이터
   - 테스트와 Storybook에서 공유

### 단기 목표 (Short-term)
3. **Phase 1 중첩 테스트**
   - 가장 흔한 중첩 패턴 검증
   - Storybook story 작성

4. **Phase 1 MSW 테스트**
   - 기본 API 모킹
   - Page/Block 조회 테스트

### 중기 목표 (Mid-term)
5. **Phase 2 중첩 테스트**
   - 복잡한 중첩 구조
   - 모든 블록 조합

6. **Phase 2 MSW 테스트**
   - 재귀 조회, 페이지네이션
   - 이미지 캐싱

### 장기 목표 (Long-term)
7. **Phase 3 Edge Cases**
   - 경계 상황 검증
   - 성능 테스트
   - 에러 복구

---

## 4. 성공 기준

### 중첩 테스트
- [ ] 모든 Phase 1 시나리오 테스트 작성 및 통과
- [ ] 최소 10개 이상의 Storybook story
- [ ] 주요 중첩 패턴 커버리지 90% 이상

### MSW 테스트
- [ ] 모든 Phase 1 API 엔드포인트 모킹
- [ ] API 레이어 통합 테스트 커버리지 80% 이상
- [ ] 주요 에러 시나리오 처리 검증

### 전체
- [ ] CI/CD에서 모든 통합 테스트 자동 실행
- [ ] Storybook 배포로 시각적 회귀 테스트 가능
- [ ] 문서화 완료 (이 파일 + 각 테스트 파일의 주석)

---

## 5. 참고 문서

- [component-quality-standards.md](./component-quality-standards.md): 개별 컴포넌트 품질 기준
- [notion-block-components.md](./notion-block-components.md): TDD 개발 가이드
- [MSW 공식 문서](https://mswjs.io/docs/): Mock Service Worker 사용법
- [Vitest 공식 문서](https://vitest.dev/): Vitest 설정 및 API

---

### 마지막 업데이트
- 작성일: 2026-01-14
- 작성자: Claude
- 버전: 1.0.0
