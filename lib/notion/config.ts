/**
 * ISR 및 캐시 설정
 */

export const ISR_CONFIG = {
  // 재검증 시간 (초 단위)
  REVALIDATE_TIME: {
    HOME: 3600, // 1시간 - 홈페이지
    POSTS_LIST: 1800, // 30분 - 포스트 목록
    POST_DETAIL: 3600, // 1시간 - 개별 포스트
    STATIC: false, // 정적 페이지 (About 등)
  },

  // 환경변수
  DATABASE_ID: process.env.NOTION_DATABASE_ID || '',
  REVALIDATE_SECRET: process.env.REVALIDATE_SECRET || '',
} as const;

/**
 * 포스트 속성 매핑
 */
export const POST_PROPERTIES = {
  TITLE: 'Title',
  SLUG: 'Slug',
  STATUS: 'Status',
  CREATED: 'Created',
  PUBLISHED: 'Published',
  CATEGORY: 'Category',
  TAGS: 'Tags',
  EXCERPT: 'Excerpt',
  COVER: 'Cover',
} as const;

/**
 * 포스트 상태
 */
export const POST_STATUS = {
  PUBLISHED: 'Published',
  DRAFT: 'Draft',
  ARCHIVED: 'Archived',
} as const;
