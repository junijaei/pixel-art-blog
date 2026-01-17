/**
 * UI Component Types
 * UI 컴포넌트에서 사용하는 타입 정의
 */

import type { Post } from './database/post';

/**
 * PostCard 컴포넌트에서 사용하는 포스트 데이터 타입
 */
export interface PostCardData {
  id: string;
  title: string;
  description: string;
  date: string;
  categoryPath: string;
  categoryLabel: string;
  tags?: string[];
}

/**
 * PostCard 컴포넌트 Props
 */
export interface PostCardProps {
  id: string;
  title: string;
  description: string;
  date: string;
  categoryPath: string;
  categoryLabel: string;
  tags?: string[];
}
