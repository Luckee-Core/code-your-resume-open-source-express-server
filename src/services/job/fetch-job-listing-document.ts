import {
  JOB_LISTING_FETCH_TIMEOUT_MS,
  JOB_LISTING_FETCH_USER_AGENT,
  JOB_LISTING_MAX_RESPONSE_BYTES,
} from "./job-listing-constants";
import { fetchJobListingViaWebsiteScraper } from "./fetch-job-listing-via-website-scraper";
import { getWebsiteScraperBaseUrl } from "./get-website-scraper-base-url";

export type FetchJobListingDocumentResult =
  | {
      ok: true;
      httpStatus: number;
      bytesRead: number;
      bodyText: string;
      fetchMethod: "http" | "playwright";
      finalUrl?: string;
    }
  | { ok: false; httpStatus: number | null; error: string };

const bufferToUtf8 = (buf: ArrayBuffer): string => {
  try {
    return new TextDecoder("utf-8", { fatal: false }).decode(buf);
  } catch {
    return "";
  }
};

const fetchJobListingDocumentViaHttp = async (
  href: string
): Promise<FetchJobListingDocumentResult> => {
  console.log("📥 fetchJobListingDocument: GET (plain HTTP)", {
    requestedUrl: href.slice(0, 200),
    timeoutMs: JOB_LISTING_FETCH_TIMEOUT_MS,
  });

  let res: Response;
  try {
    res = await fetch(href, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(JOB_LISTING_FETCH_TIMEOUT_MS),
      headers: {
        "User-Agent": JOB_LISTING_FETCH_USER_AGENT,
        Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Network error";
    console.warn("⚠️ fetchJobListingDocument: network error", {
      requestedUrl: href.slice(0, 200),
      error: msg,
    });
    return { ok: false, httpStatus: null, error: msg };
  }

  const httpStatus = res.status;
  const finalUrl = res.url || href;
  const contentType = res.headers.get("content-type") ?? "";

  if (!res.ok) {
    console.warn("⚠️ fetchJobListingDocument: HTTP error", {
      requestedUrl: href.slice(0, 200),
      finalUrl: finalUrl.slice(0, 200),
      httpStatus,
      contentType,
    });
    return { ok: false, httpStatus, error: `HTTP ${httpStatus}` };
  }

  const reader = res.body?.getReader();
  if (!reader) {
    const ab = await res.arrayBuffer();
    const slice =
      ab.byteLength > JOB_LISTING_MAX_RESPONSE_BYTES
        ? ab.slice(0, JOB_LISTING_MAX_RESPONSE_BYTES)
        : ab;
    const bodyText = bufferToUtf8(slice);
    console.log("✅ fetchJobListingDocument: response read (plain HTTP)", {
      requestedUrl: href.slice(0, 200),
      finalUrl: finalUrl.slice(0, 200),
      redirected: finalUrl !== href,
      httpStatus,
      contentType,
      bytesRead: slice.byteLength,
    });
    return {
      ok: true,
      httpStatus,
      bytesRead: slice.byteLength,
      bodyText,
      fetchMethod: "http",
      finalUrl,
    };
  }

  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;
    if (total + value.length > JOB_LISTING_MAX_RESPONSE_BYTES) {
      const rest = JOB_LISTING_MAX_RESPONSE_BYTES - total;
      if (rest > 0) {
        chunks.push(value.subarray(0, rest));
        total += rest;
      }
      await reader.cancel();
      break;
    }
    chunks.push(value);
    total += value.length;
  }

  const merged = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    merged.set(c, offset);
    offset += c.length;
  }
  const ab = merged.buffer.slice(merged.byteOffset, merged.byteOffset + merged.byteLength);
  const bodyText = bufferToUtf8(ab);
  console.log("✅ fetchJobListingDocument: response read (plain HTTP)", {
    requestedUrl: href.slice(0, 200),
    finalUrl: finalUrl.slice(0, 200),
    redirected: finalUrl !== href,
    httpStatus,
    contentType,
    bytesRead: total,
  });
  return {
    ok: true,
    httpStatus,
    bytesRead: total,
    bodyText,
    fetchMethod: "http",
    finalUrl,
  };
};

/**
 * Fetches job listing content. Uses Playwright website scraper when `WEBSITE_SCRAPER_URL`
 * is set; otherwise plain HTTP GET (no JS execution).
 */
export const fetchJobListingDocument = async (
  href: string
): Promise<FetchJobListingDocumentResult> => {
  if (getWebsiteScraperBaseUrl()) {
    const scraped = await fetchJobListingViaWebsiteScraper(href);
    if (scraped.ok) {
      return scraped;
    }
    console.warn("⚠️ fetchJobListingDocument: Playwright scrape failed, falling back to HTTP", {
      requestedUrl: href.slice(0, 200),
      error: scraped.error,
    });
  }

  return fetchJobListingDocumentViaHttp(href);
};
