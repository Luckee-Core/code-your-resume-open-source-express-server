export * from './cursor-api-client';

import { CursorApiClient } from './cursor-api-client';

/**
 * Get an authenticated Cursor API client.
 *
 * @returns CursorApiClient instance
 * @throws Error if CURSOR_API_KEY env var is not set
 */
export const getCursorClient = (): CursorApiClient => {
  const apiKey = process.env.CURSOR_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('CURSOR_API_KEY environment variable is not set');
  }
  return new CursorApiClient(apiKey);
};
