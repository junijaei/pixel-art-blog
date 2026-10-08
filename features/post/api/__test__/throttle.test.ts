import { __resetThrottle, schedule } from '@/features/post/api/throttle';
import { NOTION_LIMITS } from '@/features/post/constants';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const MIN_INTERVAL_MS = 1000 / NOTION_LIMITS.RATE_LIMIT_PER_SECOND;

describe('schedule', () => {
  beforeEach(() => {
    // vitest.config.ts가 스로틀을 꺼두므로 여기서는 실제 제한값으로 되돌린다
    vi.stubEnv('NOTION_RATE_LIMIT_PER_SECOND', String(NOTION_LIMITS.RATE_LIMIT_PER_SECOND));
    vi.stubEnv('NOTION_MAX_CONCURRENT', String(NOTION_LIMITS.MAX_CONCURRENT));
    __resetThrottle();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
  });

  it('요청 시작 간격이 속도 제한 이상으로 벌어진다', async () => {
    const startedAt: number[] = [];
    const run = () =>
      schedule(async () => {
        startedAt.push(Date.now());
      });

    const all = Promise.all([run(), run(), run()]);
    await vi.advanceTimersByTimeAsync(MIN_INTERVAL_MS * 3);
    await all;

    expect(startedAt).toHaveLength(3);
    expect(startedAt[1] - startedAt[0]).toBeGreaterThanOrEqual(MIN_INTERVAL_MS);
    expect(startedAt[2] - startedAt[1]).toBeGreaterThanOrEqual(MIN_INTERVAL_MS);
  });

  it('동시 실행 수가 상한을 넘지 않는다', async () => {
    let inFlight = 0;
    let peak = 0;

    const total = NOTION_LIMITS.MAX_CONCURRENT + 3;
    const all = Promise.all(
      Array.from({ length: total }, () =>
        schedule(async () => {
          inFlight++;
          peak = Math.max(peak, inFlight);
          await new Promise((resolve) => setTimeout(resolve, MIN_INTERVAL_MS * 4));
          inFlight--;
        })
      )
    );

    await vi.advanceTimersByTimeAsync(MIN_INTERVAL_MS * (total + 4) * 2);
    await all;

    expect(peak).toBeLessThanOrEqual(NOTION_LIMITS.MAX_CONCURRENT);
  });

  it('실패한 요청이 슬롯을 점유한 채 남지 않는다', async () => {
    const failing = schedule(async () => {
      throw new Error('boom');
    });
    // 타이머를 먼저 돌리면 핸들러가 붙기 전에 reject되어 unhandled rejection이 뜬다
    const rejected = expect(failing).rejects.toThrow('boom');
    await vi.advanceTimersByTimeAsync(MIN_INTERVAL_MS);
    await rejected;

    const after = schedule(async () => 'ok');
    await vi.advanceTimersByTimeAsync(MIN_INTERVAL_MS * 2);
    await expect(after).resolves.toBe('ok');
  });

  it('결과를 그대로 돌려준다', async () => {
    const result = schedule(async () => ({ value: 42 }));
    await vi.advanceTimersByTimeAsync(MIN_INTERVAL_MS);
    await expect(result).resolves.toEqual({ value: 42 });
  });
});
