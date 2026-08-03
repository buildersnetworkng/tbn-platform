export type Result<T> =
  | { ok: true; data: T; meta: ResultMeta }
  | { ok: false; reason: FailureReason; meta: ResultMeta };

export type FailureReason =
  | 'not_found'
  | 'network_error'
  | 'database_unavailable'
  | 'unknown_error';

export interface ResultMeta {
  durationMs: number;
  repositoryLatencyMs?: number;
  cacheHit?: boolean;
  errorCount: number;
}

export function ok<T>(data: T, meta: ResultMeta): Result<T> {
  return { ok: true, data, meta };
}

export function fail<T>(reason: FailureReason, meta: ResultMeta): Result<T> {
  return { ok: false, reason, meta };
}

export async function runCapability<T>(
  fn: () => Promise<T>
): Promise<Result<T>> {
  const start = performance.now();
  try {
    const data = await fn();
    return ok(data, { durationMs: performance.now() - start, errorCount: 0, cacheHit: false });
  } catch {
    return fail('database_unavailable', {
      durationMs: performance.now() - start,
      errorCount: 1,
    });
  }
}
