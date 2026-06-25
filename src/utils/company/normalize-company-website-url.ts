/**
 * Normalize a company website input for storage and fetch (https, no hash, trim trailing slash on path).
 *
 * @param raw - User-pasted website URL
 * @returns Normalized absolute URL or empty string when invalid
 */
export const normalizeCompanyWebsiteUrlInput = (raw: string): string => {
  const trimmed = raw.trim();
  if (!trimmed) {
    return "";
  }
  const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withProto);
    url.hash = "";
    if (url.pathname !== "/" && url.pathname.endsWith("/")) {
      url.pathname = url.pathname.slice(0, -1);
    }
    return url.href;
  } catch {
    return "";
  }
};

/**
 * Hostname used for company dedup (lowercase, strips leading `www.`).
 *
 * @param raw - Website URL or normalized href
 * @returns Comparable hostname or empty string
 */
export const extractCompanyWebsiteHostname = (raw: string): string => {
  const normalized = normalizeCompanyWebsiteUrlInput(raw);
  if (!normalized) {
    return "";
  }
  try {
    let host = new URL(normalized).hostname.toLowerCase();
    if (host.startsWith("www.")) {
      host = host.slice(4);
    }
    return host;
  } catch {
    return "";
  }
};
