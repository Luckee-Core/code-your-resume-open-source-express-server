/** Placeholder title until `runJobListingImport` overwrites from the listing. */
export const PLACEHOLDER_JOB_LISTING_TITLE = "Job listing";

/** Wall-clock timeout for listing HTTP fetch. */
export const JOB_LISTING_FETCH_TIMEOUT_MS = 20_000;

/** Max bytes read from response body (DoS guard). */
export const JOB_LISTING_MAX_RESPONSE_BYTES = 2_000_000;

/** Max characters passed to HTML→text and optional LLM. */
export const JOB_LISTING_MAX_PLAINTEXT_CHARS = 120_000;

/** Max characters stored on the scrape run row (`plainText`). */
export const JOB_LISTING_MAX_SCRAPE_PLAINTEXT_STORED = 100_000;

/** Max characters stored on Job `description`. */
export const JOB_LISTING_MAX_STORED_DESCRIPTION_CHARS = 50_000;

/** User-Agent for outbound listing fetches. */
export const JOB_LISTING_FETCH_USER_AGENT =
  "CodeYourResumeJobListingBot/1.0 (+https://github.com/codeyourresume)";
