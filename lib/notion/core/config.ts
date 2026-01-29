export const NOTION_DATASOURCE_CATEGORY_ID = process.env.NOTION_DATASOURCE_CATEGORY_ID || '';
export const NOTION_DATASOURCE_POST_ID = process.env.NOTION_DATASOURCE_POST_ID || '';

/**
 * ISR 및 캐시 설정
 */

export const ISR_CONFIG = {
  // 재검증 시간 (초 단위)
  REVALIDATE_TIME: {
    HOME: 3600, // 1시간 - 홈페이지
    CATEGORY_LIST: 3600, // 1시간 - 카테고리 목록 (자주 변경되지 않음)
    POSTS_LIST: 1800, // 30분 - 포스트 목록
    POST_DETAIL: 3600, // 1시간 - 개별 포스트
    CATEGORY_POSTS: 1800, // 30분 - 카테고리별 포스트 목록
    STATIC: false, // 정적 페이지 (About 등)
  },

  // 환경변수
  API_KEY: process.env.NOTION_API_KEY || '',
  CATEGORY_DATABASE_ID: process.env.NOTION_DATASOURCE_CATEGORY_ID || '',
  POST_DATABASE_ID: process.env.NOTION_DATASOURCE_POST_ID || '',
} as const;

/**
 * 카테고리 속성 매핑
 */
export const CATEGORY_PROPERTIES = {
  ID: 'ID',
  LABEL: 'label',
  PARENT: 'parent',
  CHILDREN: 'children',
  PATH: 'path',
  IS_ACTIVE: 'isActive',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
} as const;

/**
 * 카테고리 활성화 상태
 */
export const CATEGORY_STATUS = {
  ACTIVE: 'active',
  DEACTIVE: 'deactive',
} as const;

/**
 * 포스트 속성 매핑
 */
export const POST_PROPERTIES = {
  ID: 'ID',
  TITLE: 'title',
  CATEGORY: 'category',
  STATUS: 'status',
  DESCRIPTION: 'description',
  IS_PUBLISHED: 'isPublished',
  PUBLISHED_AT: 'publishedAt',
  TAG: 'tag',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
} as const;

/**
 * 포스트 상태
 */
export const POST_STATUS = {
  SCHEDULED: 'scheduled',
  DRAFT: 'draft',
  COMPLETED: 'completed',
} as const;

export const NOTION_LIMITS = {
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE_SIZE: 50,
  MAX_DEPTH: 2,
  RATE_LIMIT_PER_SECOND: 3,
} as const;
