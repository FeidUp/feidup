// Shared HTTP client with retry logic, rate limiting, and error handling
// Used by all external API integrations

interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
}

interface RateLimitConfig {
  maxRequestsPerSecond: number;
}

const DEFAULT_RETRY: RetryConfig = { maxRetries: 3, baseDelayMs: 1000, maxDelayMs: 10000 };
const DEFAULT_RATE_LIMIT: RateLimitConfig = { maxRequestsPerSecond: 5 };

export class RateLimiter {
  private queue: Array<{ resolve: () => void }> = [];
  private activeRequests = 0;
  private lastRequestTime = 0;
  private readonly minIntervalMs: number;

  constructor(config: RateLimitConfig = DEFAULT_RATE_LIMIT) {
    this.minIntervalMs = 1000 / config.maxRequestsPerSecond;
  }

  async acquire(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.minIntervalMs) {
      await new Promise(resolve => setTimeout(resolve, this.minIntervalMs - timeSinceLastRequest));
    }
    this.lastRequestTime = Date.now();
    this.activeRequests++;
  }

  release(): void {
    this.activeRequests--;
  }

  get pending(): number {
    return this.activeRequests;
  }
}

export class HttpClientError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public url: string,
    public retryable: boolean
  ) {
    super(message);
    this.name = 'HttpClientError';
  }
}

export interface FetchResult<T> {
  data: T;
  statusCode: number;
  duration: number;
  retries: number;
}

export async function fetchWithRetry<T>(
  url: string,
  options: RequestInit = {},
  retryConfig: RetryConfig = DEFAULT_RETRY
): Promise<FetchResult<T>> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
    const startTime = Date.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const duration = Date.now() - startTime;

      if (response.ok) {
        const data = await response.json() as T;
        return { data, statusCode: response.status, duration, retries: attempt };
      }

      // Rate limited — always retry
      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('retry-after') || '5', 10);
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        continue;
      }

      // Server errors — retry
      if (response.status >= 500) {
        lastError = new HttpClientError(
          `Server error: ${response.status} ${response.statusText}`,
          response.status, url, true
        );
        if (attempt < retryConfig.maxRetries) {
          const delay = Math.min(retryConfig.baseDelayMs * Math.pow(2, attempt), retryConfig.maxDelayMs);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        throw lastError;
      }

      // Client errors — don't retry
      const errorBody = await response.text().catch(() => '');
      throw new HttpClientError(
        `Client error: ${response.status} ${response.statusText} - ${errorBody.slice(0, 200)}`,
        response.status, url, false
      );
    } catch (err) {
      if (err instanceof HttpClientError && !err.retryable) throw err;

      lastError = err instanceof Error ? err : new Error(String(err));

      if (attempt < retryConfig.maxRetries) {
        const delay = Math.min(retryConfig.baseDelayMs * Math.pow(2, attempt), retryConfig.maxDelayMs);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error(`Failed after ${retryConfig.maxRetries} retries: ${url}`);
}

/**
 * Process items in batches with concurrency control
 */
export async function processBatch<T, R>(
  items: T[],
  processor: (item: T, index: number) => Promise<R>,
  options: { concurrency?: number; onProgress?: (completed: number, total: number) => void } = {}
): Promise<{ results: R[]; errors: Array<{ index: number; item: T; error: Error }> }> {
  const concurrency = options.concurrency || 3;
  const results: R[] = new Array(items.length);
  const errors: Array<{ index: number; item: T; error: Error }> = [];
  let completed = 0;

  const semaphore = new Array(concurrency).fill(null);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const idx = nextIndex++;
      try {
        results[idx] = await processor(items[idx], idx);
      } catch (err) {
        errors.push({ index: idx, item: items[idx], error: err instanceof Error ? err : new Error(String(err)) });
      }
      completed++;
      options.onProgress?.(completed, items.length);
    }
  }

  await Promise.all(semaphore.map(() => worker()));
  return { results: results.filter(r => r !== undefined), errors };
}
