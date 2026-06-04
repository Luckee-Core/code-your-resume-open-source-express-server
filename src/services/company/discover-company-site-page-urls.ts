import { fetchJobListingDocument } from "../job/fetch-job-listing-document";
import { validatePublicJobListingUrl } from "../job/validate-public-job-listing-url";
import { getCompanyFromStore, updateCompanyInStore } from "../../data/crm";
import type { Company } from "../../data/crm/types";

export const SITE_PAGE_URL_DISCOVERY_RUN_DISABLED_MESSAGE =
  "Site page URL discovery can only be run once per company. Edit same-domain URLs manually if needed.";

const MAX_DISCOVERED_URLS = 100;

const toFetchableUrl = (raw: string): string | null => {
  const t = raw.trim();
  if (!t) return null;
  const withProto = /^https?:\/\//i.test(t) ? t : `https://${t}`;
  const v = validatePublicJobListingUrl(withProto);
  return v.ok ? v.href : null;
};

const normalizeUrlKey = (href: string): string => {
  try {
    const u = new URL(href);
    u.hash = "";
    return u.href;
  } catch {
    return href;
  }
};

/**
 * Collects same-origin http(s) URLs from `href` attributes in HTML.
 */
const extractSameOriginHttpUrls = (html: string, base: URL): string[] => {
  const host = base.hostname.toLowerCase();
  const out = new Set<string>();
  const re = /href\s*=\s*["']([^"'#]+)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const raw = m[1]?.trim();
    if (!raw || /^javascript:/i.test(raw) || /^mailto:/i.test(raw) || /^tel:/i.test(raw)) {
      continue;
    }
    try {
      const abs = new URL(raw, base);
      if (abs.protocol !== "http:" && abs.protocol !== "https:") continue;
      if (abs.hostname.toLowerCase() !== host) continue;
      abs.hash = "";
      out.add(abs.href);
    } catch {
      // skip invalid
    }
  }
  return [...out].slice(0, MAX_DISCOVERED_URLS);
};

export type DiscoverCompanySitePageUrlsResult =
  | { ok: true; company: Company; companyUpdated: boolean; linkCount: number }
  | {
      ok: false;
      code:
        | "not_found"
        | "no_website"
        | "invalid_website"
        | "already_attempted"
        | "fetch_failed"
        | "empty_html";
      message: string;
    };

/**
 * One-shot: fetch company homepage HTML, harvest same-domain links, merge into `websiteUrls`, set attempted flag.
 */
export const discoverCompanySitePageUrls = async (
  companyId: string,
): Promise<DiscoverCompanySitePageUrlsResult> => {
  const company = await getCompanyFromStore(companyId);
  if (!company) {
    return { ok: false, code: "not_found", message: "Company not found" };
  }
  if (company.playwrightWebsiteUrlDiscoveryAttempted) {
    return {
      ok: false,
      code: "already_attempted",
      message: SITE_PAGE_URL_DISCOVERY_RUN_DISABLED_MESSAGE,
    };
  }

  const primaryHref = toFetchableUrl(company.website);
  if (!company.website.trim()) {
    return {
      ok: false,
      code: "no_website",
      message: "Add a website on the company before discovering page URLs",
    };
  }
  if (!primaryHref) {
    return { ok: false, code: "invalid_website", message: "Company website URL is not valid for fetching" };
  }

  const fetched = await fetchJobListingDocument(primaryHref);
  if (!fetched.ok) {
    return {
      ok: false,
      code: "fetch_failed",
      message: fetched.error || "Failed to fetch homepage",
    };
  }
  if (!fetched.bodyText.trim()) {
    return { ok: false, code: "empty_html", message: "Homepage returned no HTML body" };
  }

  let base: URL;
  try {
    base = new URL(primaryHref);
  } catch {
    return { ok: false, code: "invalid_website", message: "Could not parse company website URL" };
  }

  const harvested = extractSameOriginHttpUrls(fetched.bodyText, base);
  const primaryKey = normalizeUrlKey(primaryHref);
  const filtered = harvested.filter((u) => normalizeUrlKey(u) !== primaryKey);

  const prevUrls = company.websiteUrls ?? [];
  const prevNorm = new Set(prevUrls.map((u) => normalizeUrlKey(u)));
  const brandNew = filtered.filter((u) => !prevNorm.has(normalizeUrlKey(u)));
  const merged = [...new Set([...prevUrls.map((u) => u.trim()).filter(Boolean), ...brandNew])].slice(
    0,
    MAX_DISCOVERED_URLS,
  );

  const linkCount = brandNew.length;
  const next = await updateCompanyInStore(companyId, {
    websiteUrls: merged,
    playwrightWebsiteUrlDiscoveryAttempted: true,
  });
  if (!next) {
    return { ok: false, code: "not_found", message: "Company not found after update" };
  }

  const companyUpdated = linkCount > 0;

  return { ok: true, company: next, companyUpdated, linkCount };
};
