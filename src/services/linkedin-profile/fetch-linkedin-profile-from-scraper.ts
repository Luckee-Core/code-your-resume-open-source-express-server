import type { ApifyProfileItem } from "../../utils/linkedin-profile";
import { getLinkedInScraperExpressUrl } from "./get-linkedin-scraper-express-url";

const LOG = "[linkedin-profile:fetch-from-scraper]";

/**
 * POSTs a LinkedIn profile URL to linkedin-scraper-express-server and returns the Apify profile object.
 */
export const fetchLinkedInProfileFromScraper = async (
  linkedinUrl: string,
): Promise<{ item: ApifyProfileItem } | { error: string }> => {
  const scraperBase = getLinkedInScraperExpressUrl();
  const scraperUrl = `${scraperBase}/api/services/get-linkedin-profile-by-url`;

  console.log(`🚀 ${LOG} POST ${scraperUrl}`);

  let response: Response;
  try {
    response = await fetch(scraperUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: linkedinUrl }),
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
    return { error: `LinkedIn scraper returned non-JSON (HTTP ${response.status})` };
  }

  const json = parsed as { success?: boolean; error?: string; data?: unknown };

  if (!response.ok || !json.success) {
    const msg = json.error || `LinkedIn scraper HTTP ${response.status}`;
    console.warn(`❌ ${LOG} scraper error ${msg}`);
    return { error: msg };
  }

  if (!json.data || typeof json.data !== "object" || Array.isArray(json.data)) {
    console.error(`❌ ${LOG} unexpected scraper response shape`);
    return { error: "LinkedIn scraper returned an unexpected response shape" };
  }

  console.log(`✅ ${LOG} ok`);
  return { item: json.data as ApifyProfileItem };
};
