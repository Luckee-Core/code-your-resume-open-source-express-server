import type { ApifyProfileItem } from "../../utils/linkedin-profile";
import { normalizeLinkedInProfileUrl } from "../../utils/linkedin-profile";

const LOG = "[linkedin-profile:fetch-from-apify]";

const APIFY_LINKEDIN_PROFILE_SCRAPER_ACTOR_ID = "harvestapi~linkedin-profile-scraper";
const APIFY_PROFILE_SCRAPER_MODE_NO_EMAIL = "Profile details no email ($4 per 1k)";
const APIFY_BASE_URL = "https://api.apify.com/v2/actors";

/**
 * Scrapes one LinkedIn profile URL via Apify harvestapi~linkedin-profile-scraper.
 */
export const fetchLinkedInProfileFromApify = async (
  linkedinUrl: string,
): Promise<{ item: ApifyProfileItem } | { error: string }> => {
  const token = process.env.APIFY_API_TOKEN?.trim();
  if (!token) {
    console.warn(`❌ ${LOG} APIFY_API_TOKEN is not set`);
    return { error: "APIFY_API_TOKEN is not configured on the server" };
  }

  const url = normalizeLinkedInProfileUrl(linkedinUrl);
  if (!url) {
    return { error: "Empty url" };
  }

  const apifyUrl = `${APIFY_BASE_URL}/${APIFY_LINKEDIN_PROFILE_SCRAPER_ACTOR_ID}/run-sync-get-dataset-items?token=${encodeURIComponent(token)}`;
  const body = {
    profileScraperMode: APIFY_PROFILE_SCRAPER_MODE_NO_EMAIL,
    urls: [url],
  };

  console.log(`🚀 ${LOG} POST Apify profileUrl=${JSON.stringify(url)}`);

  const startedAt = Date.now();
  let response: Response;

  try {
    response = await fetch(apifyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`❌ ${LOG} fetch failed`, message);
    return { error: message };
  }

  const text = await response.text();
  let parsed: unknown;

  try {
    parsed = JSON.parse(text) as unknown;
  } catch {
    console.error(`❌ ${LOG} non-JSON response status=${response.status}`, text.slice(0, 200));
    return { error: `Apify returned non-JSON (HTTP ${response.status})` };
  }

  if (!response.ok) {
    const errObj = parsed as { error?: { message?: string } };
    const msg = errObj.error?.message || `Apify HTTP ${response.status}`;
    console.warn(`❌ ${LOG} Apify error ${msg}`);
    return { error: msg };
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    const errObj = parsed as { error?: { message?: string } };
    if (errObj.error?.message) {
      console.warn(`❌ ${LOG} Apify error ${errObj.error.message}`);
      return { error: errObj.error.message };
    }
    console.error(`❌ ${LOG} no items returned`);
    return { error: "Apify returned no items for this profile URL" };
  }

  const items = parsed as ApifyProfileItem[];
  console.log(`✅ ${LOG} ok count=${items.length} durationMs=${Date.now() - startedAt}`);
  return { item: items[0] };
};
