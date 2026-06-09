/**
 * Optional base URL for the Playwright website scraper (`WEBSITE_SCRAPER_URL`).
 * When unset, job listing import falls back to plain HTTP fetch.
 */
export const getWebsiteScraperBaseUrl = (): string | null => {
  const baseUrl = process.env.WEBSITE_SCRAPER_URL?.trim();
  if (!baseUrl) return null;
  return baseUrl.replace(/\/$/, "");
};
