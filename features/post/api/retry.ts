const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;
const MAX_DELAY_MS = 30_000;

function isRetryable(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const name = (error as { name?: string }).name;
  if (name === 'APIConnectionTimeoutError' || name === 'RequestTimeoutError') return true;
  const status = (error as { status?: number }).status;
  return typeof status === 'number' && (status === 429 || status >= 500);
}

function getDelayMs(error: unknown, attempt: number): number {
  if (error && typeof error === 'object') {
    const status = (error as { status?: number }).status;
    const headers = (error as { headers?: Record<string, string> }).headers;
    if (status === 429 && headers?.['retry-after']) {
      const seconds = parseInt(headers['retry-after'], 10);
      if (!isNaN(seconds)) return seconds * 1000;
    }
  }
  const jitter = Math.random() * 200;
  return Math.min(BASE_DELAY_MS * 2 ** attempt + jitter, MAX_DELAY_MS);
}

export async function withRetry<T>(fn: () => Promise<T>, maxRetries: number = MAX_RETRIES): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries || !isRetryable(error)) throw error;

      const delay = getDelayMs(error, attempt);
      console.warn(`[Notion] Retry ${attempt + 1}/${maxRetries} in ${Math.round(delay)}ms`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error('unreachable');
}
