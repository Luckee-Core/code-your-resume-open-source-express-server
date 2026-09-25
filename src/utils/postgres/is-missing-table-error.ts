/**
 * True when Postgres reports an undefined table (SQLSTATE 42P01).
 */
export const isMissingTableError = (error: { code?: string; message?: string }): boolean => {
  if (error.code === "42P01") return true;
  const msg = error.message ?? "";
  return msg.includes("does not exist") && msg.toLowerCase().includes("relation");
};
