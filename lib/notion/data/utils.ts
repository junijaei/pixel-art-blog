/**
 * Data Layer Utilities - Memoization helpers
 */

/**
 * Memoize a promise-returning function (no args)
 */
export function memoize<T>(fn: () => Promise<T>) {
  let promise: Promise<T> | null = null;

  return () => {
    if (promise) return promise;

    promise = (async () => {
      try {
        return await fn();
      } catch (error) {
        promise = null;
        throw error;
      }
    })();

    return promise;
  };
}

/**
 * Memoize a promise-returning function (with args)
 */
export function memoizeWithArgs<T, Args extends any[]>(fn: (...args: Args) => Promise<T>) {
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
