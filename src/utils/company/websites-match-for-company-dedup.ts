import { extractCompanyWebsiteHostname } from "./normalize-company-website-url";

/**
 * True when two website inputs resolve to the same dedup hostname.
 *
 * @param a - First website URL
 * @param b - Second website URL
 */
export const websitesMatchForCompanyDedup = (a: string, b: string): boolean => {
  const hostA = extractCompanyWebsiteHostname(a);
  const hostB = extractCompanyWebsiteHostname(b);
  return hostA !== "" && hostA === hostB;
};
