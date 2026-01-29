export function memoizePromise<T>(fn: () => Promise<T>) {
  let promise: Promise<T> | null = null;

  return () => {
    if (promise) return promise;

    promise = (async () => {
      try {
        return await fn();
      } catch (error) {
        // 실패 시 다음 호출 때 재시도할 수 있도록 캐시 초기화
        promise = null;
        throw error;
      }
    })();

    return promise;
  };
}

export function memoizePromiseWithArgs<T, Args extends any[]>(fn: (...args: Args) => Promise<T>) {
  const cache = new Map<string, Promise<T>>();

  return (...args: Args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key)!;

    const promise = fn(...args).catch((err) => {
      cache.delete(key);
      throw err;
    });

    cache.set(key, promise);
    return promise;
  };
}
