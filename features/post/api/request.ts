import { withRetry } from '@/features/post/api/retry';
import { schedule } from '@/features/post/api/throttle';

/**
 * Notion 호출의 단일 길목. 속도 제한과 재시도를 함께 적용합니다.
 *
 * 재시도마다 다시 큐를 통과하므로, 429 이후 워커들이 동시에 몰리지 않는다.
 * notionClient를 이 함수 밖에서 직접 호출하면 두 보호 장치를 모두 잃는다.
 */
export function notionRequest<T>(fn: () => Promise<T>): Promise<T> {
  return withRetry(() => schedule(fn));
}
