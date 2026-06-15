import type { ISODate, NotionUser, UUID } from '@/features/post/model/base';
import type { RichText } from './rich-text';

export interface NotionComment {
  object: 'comment';
  id: UUID;
  parent:
    | { type: 'block_id'; block_id: UUID }
    | { type: 'page_id'; page_id: UUID };
  discussion_id: UUID;
  created_time: ISODate;
  last_edited_time: ISODate;
  created_by: NotionUser;
  rich_text: RichText[];
}

/** 블록 ID → 댓글 배열 맵 (직렬화 가능한 Record 형태) */
export type BlockCommentRecord = Record<UUID, NotionComment[]>;
