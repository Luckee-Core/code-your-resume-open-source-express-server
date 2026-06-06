/**
 * Format a Cursor API error response body into a human-readable message.
 *
 * @param errorData - Parsed JSON error body from a failed Cursor API response
 * @param fallback - Message when no known fields are present
 * @returns Readable error string
 */
export const formatCursorApiError = (
  errorData: unknown,
  fallback: string,
): string => {
  if (typeof errorData === 'string' && errorData.trim()) {
    return errorData.trim();
  }

  if (!errorData || typeof errorData !== 'object') {
    return fallback;
  }

  const record = errorData as Record<string, unknown>;
  const nestedError = record.error;

  if (typeof nestedError === 'string' && nestedError.trim()) {
    return nestedError.trim();
  }

  if (nestedError && typeof nestedError === 'object') {
    const nested = nestedError as Record<string, unknown>;
    if (typeof nested.message === 'string' && nested.message.trim()) {
      const code = typeof nested.code === 'string' ? nested.code : undefined;
      return code ? `${nested.message} (${code})` : nested.message.trim();
    }
  }

  if (typeof record.message === 'string' && record.message.trim()) {
    return record.message.trim();
  }

  try {
    return JSON.stringify(errorData);
  } catch {
    return fallback;
  }
};
