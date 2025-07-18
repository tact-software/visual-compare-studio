import { logger } from './logger';

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export type Result<T, E = AppError> = { ok: true; value: T } | { ok: false; error: E };

export function ok<T>(value: T): Result<T> {
  return { ok: true, value };
}

export function err<E = AppError>(error: E): Result<never, E> {
  return { ok: false, error };
}

export async function tryCatch<T>(
  fn: () => Promise<T>,
  errorMessage: string,
  errorCode: string
): Promise<Result<T>> {
  try {
    const result = await fn();
    return ok(result);
  } catch (error) {
    logger.error(errorMessage, error);
    return err(
      new AppError(errorMessage, errorCode, error instanceof Error ? error.message : error)
    );
  }
}

export function handleTauriError(error: unknown): AppError {
  if (error instanceof Error) {
    return new AppError(error.message, 'TAURI_ERROR', error);
  }

  return new AppError('An unknown error occurred', 'UNKNOWN_ERROR', error);
}
