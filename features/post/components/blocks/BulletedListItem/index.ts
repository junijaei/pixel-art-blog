import type { BulletedListBlock } from '@/features/post/model';
import { ReactNode } from 'react';

export type { BulletedListBlock as BulletedListItemBlock } from '@/features/post/model';
export { BulletedListItem } from './BulletedListItem';

export interface BulletedListItemProps {
  block: BulletedListBlock;
  children?: ReactNode;
  /**
   * 기본은 li. 댓글이 달려 CommentWrapper가 li를 맡는 경우에만 div로 바꾼다.
   * li 안에 li가 들어가면 스크린 리더가 리스트 구조를 잃는다.
   */
  as?: 'li' | 'div';
}
