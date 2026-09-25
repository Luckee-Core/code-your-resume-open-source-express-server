/**
 * Ensures a SQL identifier is a simple unquoted name (no injection via table/column strings).
 */
export const assertSafeIdent = (name: string): string => {
  if (!/^[a-z_][a-z0-9_]*$/i.test(name)) {
    throw new Error(`Unsafe SQL identifier: ${name}`);
  }
  return name;
};
