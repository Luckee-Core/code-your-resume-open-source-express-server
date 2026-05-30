/**
 * Server-side metadata for error table inserts (not trusted from client).
 */
export const resolveAppErrorInsertMeta = (): {
  appSlug: string;
  environment: string;
  release: string | null;
} => {
  const appSlug = process.env.APP_SLUG?.trim() || "code-your-resume";
  const environment = process.env.NODE_ENV === "production" ? "production" : "development";
  const release = process.env.GIT_COMMIT_SHA?.trim() || null;
  return { appSlug, environment, release };
};
