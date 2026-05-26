import type { NotionComment } from '@/types/notion';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { CommentWrapper } from './CommentWrapper';

const meta = {
  title: 'Notion Blocks/InlineComment/CommentWrapper',
  component: CommentWrapper,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
노션 블록에 달린 추가 설명을 엑셀 메모 스타일로 표시합니다.

**시각적 강조:**
- 오른쪽 상단 오렌지 삼각형 (엑셀 메모 스타일)
- 왼쪽 오렌지 테두리
- 연한 오렌지 배경 틴팅

**인터랙션:**
- 블록 본문 또는 삼각형 클릭 → 팝오버 열기/닫기
- 팝오버 내부 클릭은 팝오버를 닫지 않음
- 외부 클릭 시 닫힘

**노션 API 한계:**
노션 공개 REST API는 특정 텍스트 범위와 댓글의 연결 정보를 제공하지 않습니다.
따라서 블록 전체 단위로 추가 설명을 연결합니다.
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CommentWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

function makeComment(overrides: Partial<NotionComment> = {}): NotionComment {
  return {
    object: 'comment',
    id: 'comment-1',
    parent: { type: 'block_id', block_id: 'block-1' },
    discussion_id: 'discussion-1',
    created_time: '2026-01-15T10:30:00.000Z',
    last_edited_time: '2026-01-15T10:30:00.000Z',
    created_by: { object: 'user', id: 'user-1', name: '전희재', avatar_url: undefined },
    rich_text: [
      {
        type: 'text',
        text: {
          content: 'React Server Components는 서버에서 실행되므로 클라이언트 번들에 포함되지 않습니다.',
          link: null,
        },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'React Server Components는 서버에서 실행되므로 클라이언트 번들에 포함되지 않습니다.',
        href: null,
      },
    ],
    ...overrides,
  };
}

/** 단일 추가 설명 */
export const SingleNote: Story = {
  args: {
    comments: [makeComment()],
    children: (
      <p className="leading-relaxed">
        Next.js 16에서는 App Router를 기본으로 사용하며, React Server Components를 통해 서버에서 데이터를 직접 가져올 수
        있습니다.
      </p>
    ),
  },
};

/** 여러 추가 설명 (번호가 붙어 구분됨) */
export const MultipleNotes: Story = {
  args: {
    comments: [
      makeComment({ id: 'c-1' }),
      makeComment({
        id: 'c-2',
        rich_text: [
          {
            type: 'text',
            text: { content: '스트리밍 SSR을 활용하면 TTFB(Time To First Byte)를 크게 줄일 수 있습니다.', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: '스트리밍 SSR을 활용하면 TTFB(Time To First Byte)를 크게 줄일 수 있습니다.',
            href: null,
          },
        ],
      }),
      makeComment({
        id: 'c-3',
        rich_text: [
          {
            type: 'text',
            text: {
              content: 'Suspense 경계를 활용해 일부 UI만 지연 로딩할 수 있어 사용자 경험이 향상됩니다.',
              link: null,
            },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'Suspense 경계를 활용해 일부 UI만 지연 로딩할 수 있어 사용자 경험이 향상됩니다.',
            href: null,
          },
        ],
      }),
    ],
    children: (
      <p className="leading-relaxed">
        Next.js 16에서는 App Router를 기본으로 사용하며, React Server Components를 통해 서버에서 데이터를 직접 가져올 수
        있습니다.
      </p>
    ),
  },
};

/** 긴 추가 설명 (스크롤) */
export const LongNote: Story = {
  args: {
    comments: [
      makeComment({
        rich_text: [
          {
            type: 'text',
            text: {
              content:
                'React Server Components(RSC)는 단순한 성능 최적화 기법이 아니라, 컴포넌트 설계 패러다임 자체를 바꾸는 혁신입니다. 서버에서 렌더링된 컴포넌트는 클라이언트에 JavaScript를 전혀 전송하지 않으므로, 기존 SPA 방식에서 불가피하게 발생하던 번들 비대화 문제를 근본적으로 해결합니다.\n\n다만 이 패러다임에 익숙해지려면 "어떤 컴포넌트를 서버에서 실행하고, 어떤 컴포넌트를 클라이언트에서 실행할지"를 명확히 구분하는 사고 전환이 필요합니다. 특히 useState, useEffect 같은 훅이나 브라우저 API를 사용하는 컴포넌트는 반드시 클라이언트 컴포넌트여야 합니다.',
              link: null,
            },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text:
              'React Server Components(RSC)는 단순한 성능 최적화 기법이 아니라, 컴포넌트 설계 패러다임 자체를 바꾸는 혁신입니다. 서버에서 렌더링된 컴포넌트는 클라이언트에 JavaScript를 전혀 전송하지 않으므로, 기존 SPA 방식에서 불가피하게 발생하던 번들 비대화 문제를 근본적으로 해결합니다.\n\n다만 이 패러다임에 익숙해지려면 "어떤 컴포넌트를 서버에서 실행하고, 어떤 컴포넌트를 클라이언트에서 실행할지"를 명확히 구분하는 사고 전환이 필요합니다. 특히 useState, useEffect 같은 훅이나 브라우저 API를 사용하는 컴포넌트는 반드시 클라이언트 컴포넌트여야 합니다.',
            href: null,
          },
        ],
      }),
    ],
    children: (
      <p className="leading-relaxed">
        Next.js 16에서는 App Router를 기본으로 사용하며, React Server Components를 통해 서버에서 데이터를 직접 가져올 수
        있습니다.
      </p>
    ),
  },
};

/** 스크롤이 생기는 예시 — max-h-96(384px)을 초과하는 다수/장문 설명 */
export const WithScroll: Story = {
  name: '스크롤 (다수·장문 설명)',
  args: {
    comments: [
      makeComment({
        id: 's-1',
        rich_text: [
          {
            type: 'text',
            text: {
              content:
                'React Server Components(RSC)는 서버에서만 실행되는 컴포넌트입니다.\n클라이언트 번들에 포함되지 않으므로 초기 로딩 속도가 크게 향상됩니다.\n특히 대형 라이브러리를 서버 컴포넌트에서 사용하면 번들 크기 절감 효과가 큽니다.',
              link: null,
            },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text:
              'React Server Components(RSC)는 서버에서만 실행되는 컴포넌트입니다.\n클라이언트 번들에 포함되지 않으므로 초기 로딩 속도가 크게 향상됩니다.\n특히 대형 라이브러리를 서버 컴포넌트에서 사용하면 번들 크기 절감 효과가 큽니다.',
            href: null,
          },
        ],
      }),
      makeComment({
        id: 's-2',
        rich_text: [
          {
            type: 'text',
            text: {
              content:
                'App Router에서는 layout.tsx가 중첩 레이아웃을 지원합니다.\n각 세그먼트마다 별도의 layout을 정의할 수 있어 코드 구조가 명확해집니다.\n공통 UI(헤더, 사이드바 등)를 상위 layout에서 한 번만 정의하면 됩니다.',
              link: null,
            },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text:
              'App Router에서는 layout.tsx가 중첩 레이아웃을 지원합니다.\n각 세그먼트마다 별도의 layout을 정의할 수 있어 코드 구조가 명확해집니다.\n공통 UI(헤더, 사이드바 등)를 상위 layout에서 한 번만 정의하면 됩니다.',
            href: null,
          },
        ],
      }),
      makeComment({
        id: 's-3',
        rich_text: [
          {
            type: 'text',
            text: {
              content:
                'ISR(Incremental Static Regeneration)은 빌드 시 생성된 정적 페이지를 일정 주기로 재생성합니다.\nrevalidate 값을 설정하면 Next.js가 백그라운드에서 페이지를 갱신합니다.\n이를 통해 정적 사이트의 성능과 동적 콘텐츠의 최신성을 동시에 누릴 수 있습니다.',
              link: null,
            },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'ISR(Incremental Static Regeneration)은 빌드 시 생성된 정적 페이지를 일정 주기로 재생성합니다.',
            href: null,
          },
        ],
      }),
      makeComment({
        id: 's-4',
        rich_text: [
          {
            type: 'text',
            text: {
              content:
                'Turbopack은 Rust 기반의 차세대 번들러로, Webpack 대비 최대 700배 빠른 HMR을 제공합니다.\nNext.js 16부터 dev 환경에서 기본 번들러로 채택되었습니다.',
              link: null,
            },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'Turbopack은 Rust 기반의 차세대 번들러로, Webpack 대비 최대 700배 빠른 HMR을 제공합니다.',
            href: null,
          },
        ],
      }),
      makeComment({
        id: 's-5',
        rich_text: [
          {
            type: 'text',
            text: {
              content:
                'Partial Prerendering(PPR)은 동일 페이지 내에서 정적 셸과 동적 콘텐츠를 혼합하는 새로운 렌더링 모델입니다.\n정적 부분은 즉시 전달되고, 동적 부분은 스트리밍으로 채워져 초기 응답 속도가 크게 향상됩니다.',
              link: null,
            },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text:
              'Partial Prerendering(PPR)은 동일 페이지 내에서 정적 셸과 동적 콘텐츠를 혼합하는 새로운 렌더링 모델입니다.',
            href: null,
          },
        ],
      }),
    ],
    children: (
      <p className="leading-relaxed">
        Next.js 16에서는 App Router를 기본으로 사용하며, React Server Components를 통해 서버에서 데이터를 직접 가져올 수
        있습니다.
      </p>
    ),
  },
};

/** 이미지 블록에 달린 추가 설명 */
export const OnImageBlock: Story = {
  name: '이미지 블록의 추가 설명',
  args: {
    comments: [
      makeComment({
        rich_text: [
          {
            type: 'text',
            text: {
              content: '이 다이어그램은 Next.js App Router의 렌더링 흐름을 나타냅니다. 왼쪽부터 오른쪽으로 읽으세요.',
              link: null,
            },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: '이 다이어그램은 Next.js App Router의 렌더링 흐름을 나타냅니다. 왼쪽부터 오른쪽으로 읽으세요.',
            href: null,
          },
        ],
      }),
    ],
    children: (
      <div className="border-border bg-muted text-muted-foreground my-2 flex h-40 items-center justify-center rounded-lg border text-sm">
        [이미지 블록]
      </div>
    ),
  },
};
