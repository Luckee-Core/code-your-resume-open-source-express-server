import { getWebsiteScraperBaseUrl } from "./get-website-scraper-base-url";
import { JOB_LISTING_FETCH_TIMEOUT_MS } from "./job-listing-constants";
import { shouldWaitForJobListingRedirects } from "./should-wait-for-job-listing-redirects";
import type { FetchJobListingDocumentResult } from "./fetch-job-listing-document";

type WebsiteScrapePage = {
  url: string;
  title: string;
  text: string;
};

type WebsiteScrapeApiSuccess = {
  success: true;
  data: {
    canonicalUrl: string;
    pages: WebsiteScrapePage[];
    meta?: {
      waitForRedirects?: boolean;
      redirectHops?: number;
      navigationTimeoutMs?: number;
    };
  };
};

type WebsiteScrapeApiFailure = {
  success: false;
  error?: string;
  code?: string;
};

/** Playwright scrape needs extra wall time beyond navigation timeout (browser launch). */
const SCRAPER_REQUEST_BUFFER_MS = 15_000;

/** Job boards and SPAs often need longer than the plain-fetch timeout. */
const JOB_LISTING_SCRAPER_NAVIGATION_TIMEOUT_MS = 45_000;

/**
 * POST /api/scrape on the Playwright website scraper service.
 */
export const fetchJobListingViaWebsiteScraper = async (
  href: string
): Promise<FetchJobListingDocumentResult> => {
  const baseUrl = getWebsiteScraperBaseUrl();
  if (!baseUrl) {
    return { ok: false, httpStatus: null, error: "WEBSITE_SCRAPER_URL is not configured" };
  }

  const waitForRedirects = shouldWaitForJobListingRedirects(href);
  const navigationTimeoutMs = Math.max(
    JOB_LISTING_FETCH_TIMEOUT_MS,
    JOB_LISTING_SCRAPER_NAVIGATION_TIMEOUT_MS
  );
  const requestTimeoutMs = navigationTimeoutMs + SCRAPER_REQUEST_BUFFER_MS;

  console.log("📥 fetchJobListingViaWebsiteScraper: POST /api/scrape", {
    scraperBaseUrl: baseUrl,
    requestedUrl: href.slice(0, 200),
    waitForRedirects,
    navigationTimeoutMs,
  });

  let res: Response;
  try {
    res = await fetch(`${baseUrl}/api/scrape`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: href,
        waitForRedirects,
        navigationTimeoutMs,
      }),
      signal: AbortSignal.timeout(requestTimeoutMs),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Website scraper request failed";
    console.warn("⚠️ fetchJobListingViaWebsiteScraper: network error", {
      requestedUrl: href.slice(0, 200),
      error: msg,
    });
    return { ok: false, httpStatus: null, error: msg };
  }

  let payload: WebsiteScrapeApiSuccess | WebsiteScrapeApiFailure;
  try {
    payload = (await res.json()) as WebsiteScrapeApiSuccess | WebsiteScrapeApiFailure;
  } catch {
    return {
      ok: false,
      httpStatus: res.status,
      error: "Website scraper returned non-JSON response",
    };
  }

  if (!res.ok || !payload.success) {
    const errMsg =
      (!payload.success && payload.error) ||
      `Website scraper HTTP ${res.status}`;
    console.warn("⚠️ fetchJobListingViaWebsiteScraper: scrape failed", {
      requestedUrl: href.slice(0, 200),
      httpStatus: res.status,
      code: !payload.success ? payload.code : undefined,
      error: errMsg,
    });
    return { ok: false, httpStatus: res.status, error: errMsg };
  }

  const page = payload.data.pages[0];
  const bodyText = page?.text?.trim() ?? "";
  const canonicalUrl = payload.data.canonicalUrl;

  console.log("✅ fetchJobListingViaWebsiteScraper: scrape ok", {
    requestedUrl: href.slice(0, 200),
    canonicalUrl: canonicalUrl.slice(0, 200),
    redirected: canonicalUrl !== href,
    waitForRedirects,
    redirectHops: payload.data.meta?.redirectHops ?? null,
    plainChars: bodyText.length,
    pageTitle: page?.title ?? "",
  });

  if (!bodyText) {
    return {
      ok: false,
      httpStatus: res.status,
      error: "Website scraper returned empty text",
    };
  }

  return {
    ok: true,
    httpStatus: res.status,
    bytesRead: bodyText.length,
    bodyText,
    fetchMethod: "playwright",
    finalUrl: canonicalUrl,
  };
};
