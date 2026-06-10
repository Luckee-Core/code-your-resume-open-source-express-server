const trimSlash = (url: string): string => url.replace(/\/$/, "");

/**
 * Base URL for linkedin-scraper-express-server (Apify proxy).
 */
export const getLinkedInScraperExpressUrl = (): string => {
  const fromEnv = process.env.LINKEDIN_SCRAPER_EXPRESS_URL?.trim();
  if (fromEnv) return trimSlash(fromEnv);
  return "http://localhost:3039";
};
