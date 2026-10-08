import type { ISODate, UUID } from '@/features/post/model/base';

/** 구독을 만들 때 Notion이 한 번 보내는 검증 요청. 이때는 아직 서명이 없다. */
export interface NotionWebhookVerification {
  verification_token: string;
}

export type NotionCommentEventType = 'comment.created' | 'comment.updated' | 'comment.deleted';

export interface NotionWebhookEvent {
  id: UUID;
  timestamp: ISODate;
  workspace_id: UUID;
  type: string;
  entity: { id: UUID; type: string };
  data: {
    /** 댓글이 달린 대상. 블록이면 블록 ID, 페이지 댓글이면 page_id와 같다. */
    parent?: { id: UUID; type?: string };
    page_id?: UUID;
    discussion_id?: UUID;
  };
}

export function isVerification(
  payload: NotionWebhookVerification | NotionWebhookEvent
): payload is NotionWebhookVerification {
  return 'verification_token' in payload && !('type' in payload);
}

export function isCommentEvent(event: NotionWebhookEvent): boolean {
  return (
    event.type === 'comment.created' ||
    event.type === 'comment.updated' ||
    event.type === 'comment.deleted'
  );
}
