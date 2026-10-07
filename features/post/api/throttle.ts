import { NOTION_LIMITS } from '@/features/post/constants';

/**
 * Notion 통합당 평균 초당 3회 제한에 맞춰 요청 시작 간격과 동시 실행 수를 제어합니다.
 *
 * 버킷은 프로세스 단위다. 정적 생성이 워커를 여러 개 띄우면 전체 처리량은
 * 워커 수만큼 곱해지므로, 빌드에서는 NOTION_RATE_LIMIT_PER_SECOND를 워커 수로 나눠 넣어야 한다.
 */
function minIntervalMs(): number {
  const perSecond =
    Number(process.env.NOTION_RATE_LIMIT_PER_SECOND) || NOTION_LIMITS.RATE_LIMIT_PER_SECOND;
  return 1000 / perSecond;
}

function maxConcurrent(): number {
  return Number(process.env.NOTION_MAX_CONCURRENT) || NOTION_LIMITS.MAX_CONCURRENT;
}

const queue: Array<() => void> = [];
let inFlight = 0;
let lastStartedAt = 0;
let draining = false;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function drain(): Promise<void> {
  if (draining) return;
  draining = true;

  while (queue.length > 0) {
    // 동시 실행이 꽉 찼으면 멈춘다. release()가 다시 깨운다.
    if (inFlight >= maxConcurrent()) break;

    const wait = lastStartedAt + minIntervalMs() - Date.now();
    if (wait > 0) {
      await sleep(wait);
      continue;
    }

    lastStartedAt = Date.now();
    inFlight++;
    queue.shift()!();
  }

  draining = false;
}

function release(): void {
  inFlight--;
  void drain();
}

/** 요청을 큐에 넣고 속도 제한을 지키는 시점에 실행합니다. */
export function schedule<T>(fn: () => Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    queue.push(() => {
      void (async () => {
        try {
          resolve(await fn());
        } catch (error) {
          reject(error);
        } finally {
          release();
        }
      })();
    });

    void drain();
  });
}

/** 테스트 전용 — 모듈 수준 큐 상태를 초기화합니다. */
export function __resetThrottle(): void {
  queue.length = 0;
  inFlight = 0;
  lastStartedAt = 0;
  draining = false;
}
